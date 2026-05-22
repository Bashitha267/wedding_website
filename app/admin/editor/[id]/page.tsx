'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { PenTool, Users, Image as ImageIcon, Music, MapPin, Calendar, Clock, Disc, Copy, CheckCircle, Menu, X, Save, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset'; 
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dxoa3ashm';

export default function AdminEditor() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [activeTab, setActiveTab] = useState('template');
  const [order, setOrder] = useState<any>(null);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Template draft state
  const [templateDraft, setTemplateDraft] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const isChristian = order?.template_id === 'christian';

  useEffect(() => {
    if (orderId) fetchOrderData(orderId);
  }, [orderId]);

  const fetchOrderData = async (id: string) => {
    // Fetch Order
    const { data: orderData, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
      
    if (orderData) {
      setOrder(orderData);
      const parsedData = orderData.template_data || {};
      if (!parsedData.timeline) {
          parsedData.timeline = [
              { time: '2:30 PM', title: 'Welcome Drinks', icon: '🥂', location: 'Main Entrance' },
              { time: '3:00 PM', title: 'Ceremony', icon: '💍', location: 'The Rose Garden' },
          ];
      }
      setTemplateDraft(parsedData);

      // Fetch RSVPs
      const { data: rsvpData } = await supabase
        .from('rsvps')
        .select('*')
        .eq('order_id', orderData.id);
        
      if (rsvpData) setRsvps(rsvpData);
    }
  };

  // Auto-save logic (Debounced)
  useEffect(() => {
    if (!order?.id || Object.keys(templateDraft).length === 0) return;
    if (saveStatus === 'idle') {
      setSaveStatus('saved');
      return;
    }

    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      const { error } = await supabase
        .from('orders')
        .update({ template_data: templateDraft })
        .eq('id', order.id);
        
      if (!error) {
        setSaveStatus('saved');
        setRefreshKey(k => k + 1);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [templateDraft]);

  const handleCopyLink = () => {
    if (!order) return;
    const url = `${window.location.protocol}//${window.location.host}/${order.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldCategory: string, isArray: boolean = false) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        return fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
          method: 'POST',
          body: formData
        }).then(res => res.json());
      });
      const results = await Promise.all(uploadPromises);
      const urls = results.filter(d => d.secure_url).map(d => d.secure_url);

      if (urls.length > 0) {
        setTemplateDraft((prev: any) => {
          const draft = { ...prev };
          if (!draft.images) draft.images = {};
          if (fieldCategory === 'heroImage') draft.images.heroImage = urls[0];
          else if (fieldCategory === 'musicUrl') draft.musicUrl = urls[0];
          else if (isArray && fieldCategory === 'gallery') draft.images.gallery = [...(draft.images.gallery || []), ...urls];
          else draft.images[fieldCategory] = urls[0];
          return draft;
        });
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const saveTemplateChanges = async () => {
    if (!order) return;
    setSaveStatus('saving');
    const { error } = await supabase
      .from('orders')
      .update({ template_data: templateDraft })
      .eq('id', order.id);
    if (!error) {
      setSaveStatus('saved');
      setRefreshKey(k => k + 1);
    }
  };

  if (!order) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading template...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5', position: 'relative' }}>
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          .sidebar-nav {
            position: fixed !important;
            top: 0;
            bottom: 0;
            z-index: 1000;
            width: 250px !important;
            transition: transform 0.3s ease !important;
          }
          .main-content {
            margin-left: 0 !important;
            padding: 20px !important;
          }
          .editor-layout {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .preview-pane {
            width: 100% !important;
            max-width: 375px !important;
            margin: 0 auto !important;
            position: relative !important;
            top: 0 !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
          .mobile-close-btn {
             display: block !important;
          }
          .sidebar-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn, .mobile-close-btn {
             display: none !important;
          }
        }
      `}</style>

      {isSidebarOpen && <div className="sidebar-overlay mobile-close-btn" style={{ display: 'none' }} onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className="sidebar-nav" style={{ 
        width: '250px', backgroundColor: '#1c1e21', color: 'white',
        padding: '20px 0', flexShrink: 0,
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 1000,
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #333', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', textDecoration: 'none', fontSize: '0.8rem', marginBottom: '10px' }}>
               <ArrowLeft size={14} /> Back to Admin
            </Link>
            <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'white' }}>Admin Editor</h2>
            <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: 0 }}>Order: {order.customer_name}</p>
          </div>
          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: '5px' }}>
             <X size={20} />
          </button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <button onClick={() => setActiveTab('template')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', backgroundColor: activeTab === 'template' ? '#333' : 'transparent', color: 'white', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
            <PenTool size={18} /> Edit Content
          </button>
          <button onClick={() => setActiveTab('confirms')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', backgroundColor: activeTab === 'confirms' ? '#333' : 'transparent', color: 'white', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
            <Users size={18} /> View RSVPs
          </button>
          <button onClick={() => setActiveTab('seating')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', backgroundColor: activeTab === 'seating' ? '#333' : 'transparent', color: 'white', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
            <Disc size={18} /> Seating Chart
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ 
        flex: 1, 
        marginLeft: isSidebarOpen ? '250px' : '0',
        padding: '40px', 
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Mobile Header Toggle */}
        <div className="mobile-menu-btn" style={{ display: 'none', marginBottom: '20px', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            style={{ padding: '8px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}
          >
            <Menu size={24} />
          </button>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Editor</h2>
        </div>
        {/* Status indicator */}
        <div style={{ position: 'fixed', bottom: '20px', left: isSidebarOpen ? '270px' : '20px', backgroundColor: 'white', padding: '10px 20px', borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 50, transition: 'all 0.3s ease' }}>
          {saveStatus === 'saving' ? <><span className="spinner-small" /> Saving...</> : <><CheckCircle size={16} color="#28a745" /> All changes saved</>}
        </div>

        <div className="editor-layout" style={{ display: 'flex', gap: '40px' }}>
            <div style={{ flex: 1, maxWidth: '800px' }}>
                {activeTab === 'template' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginBottom: '20px' }}>Basic Information</h3>
                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div><label>Bride</label><input type="text" value={templateDraft?.brideName || ''} onChange={e => setTemplateDraft({...templateDraft, brideName: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} /></div>
                                <div><label>Groom</label><input type="text" value={templateDraft?.groomName || ''} onChange={e => setTemplateDraft({...templateDraft, groomName: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} /></div>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><ImageIcon size={20} color="#000000" /> Manage Images</h3>
                          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>Upload your photos via Cloudinary.</p>
                          
                          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                             <div>
                                 <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Hero Center Image</label>
                                 <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'heroImage')} disabled={uploading} />
                                 {templateDraft?.images?.heroImage && <img src={templateDraft.images.heroImage} alt="Hero" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
                             </div>
                             <div>
                                 <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Middle Image 1</label>
                                 <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image1')} disabled={uploading} />
                                 {templateDraft?.images?.image1 && <img src={templateDraft.images.image1} alt="Img1" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
                             </div>
                             <div>
                                 <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Middle Image 2</label>
                                 <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image2')} disabled={uploading} />
                                 {templateDraft?.images?.image2 && <img src={templateDraft.images.image2} alt="Img2" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
                             </div>
                             <div>
                                 <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Middle Image 3</label>
                                 <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image3')} disabled={uploading} />
                                 {templateDraft?.images?.image3 && <img src={templateDraft.images.image3} alt="Img3" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
                             </div>
                             <div>
                                 <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Thank You / RSVP Image</label>
                                 <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thankYouImage')} disabled={uploading} />
                                 {templateDraft?.images?.thankYouImage && <img src={templateDraft.images.thankYouImage} alt="ThankYou" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
                             </div>
                          </div>

                          <hr style={{ borderColor: '#eeeeee', margin: '24px 0' }} />
                          <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Gallery Slider (Upload Multiple)</label>
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery', true)} disabled={uploading} multiple />
                          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                             {(templateDraft?.images?.gallery || []).map((imgUrl: string, idx: number) => (
                                 <div key={idx} style={{ position: 'relative' }}>
                                     <img src={imgUrl} alt={`Gallery ${idx}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                     <button onClick={() => {
                                         const gallery = [...(templateDraft.images.gallery || [])];
                                         gallery.splice(idx, 1);
                                         setTemplateDraft({...templateDraft, images: {...templateDraft.images, gallery}});
                                     }} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', border: 'none', cursor: 'pointer' }}>X</button>
                                 </div>
                             ))}
                          </div>
                        </div>

                        <div className="stats-grid" style={{ display: 'flex', gap: '30px' }}>
                          <div style={{ flex: 1, backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><Calendar size={20} color="#000000" /> Date & Time</h3>
                            <input 
                               type="datetime-local" 
                               value={templateDraft?.eventDate ? templateDraft.eventDate.substring(0,16) : ''} 
                               onChange={(e) => setTemplateDraft({...templateDraft, eventDate: e.target.value})}
                               style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '15px' }} 
                            />
                          </div>
                          
                          <div style={{ flex: 1, backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><MapPin size={20} color="#000000" /> Location Details</h3>
                    <input type="text" placeholder="Main Venue / Hotel Name" value={templateDraft?.location?.name || ''} onChange={e => setTemplateDraft({...templateDraft, location: {...(templateDraft.location || {}), name: e.target.value}})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }} />
                    <textarea placeholder="Main Venue Address / Google Maps Link" value={templateDraft?.location?.address || ''} onChange={e => setTemplateDraft({...templateDraft, location: {...(templateDraft.location || {}), address: e.target.value}})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical', minHeight: '60px' }} />

                    <div style={{ height: '20px' }} />
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: '#555' }}>Secondary Location (Optional)</h4>
                    <input type="text" placeholder="Church / Secondary Venue Name" value={templateDraft?.churchLocation?.name || ''} onChange={e => setTemplateDraft({...templateDraft, churchLocation: {...(templateDraft.churchLocation || {}), name: e.target.value}})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }} />
                    <textarea placeholder="Secondary Address / Google Maps Link" value={templateDraft?.churchLocation?.address || ''} onChange={e => setTemplateDraft({...templateDraft, churchLocation: {...(templateDraft.churchLocation || {}), address: e.target.value}})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical', minHeight: '60px' }} />
                          </div>
                        </div>

                        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><Music size={20} color="#000000" /> Background Music</h3>
                          <input 
                             type="text" 
                             value={templateDraft?.musicUrl || ''} 
                             onChange={(e) => setTemplateDraft({...templateDraft, musicUrl: e.target.value})}
                             placeholder="Spotify Link or MP3 URL" 
                             style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '15px' }} 
                          />
                          <input type="file" accept="audio/*" onChange={(e) => handleFileUpload(e, 'musicUrl')} disabled={uploading} />
                        </div>

                        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>👗 Dress Code</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                             <input type="text" placeholder="Title (e.g. Formal Attire)" value={templateDraft?.dressCode?.title || ''} onChange={e => setTemplateDraft({...templateDraft, dressCode: {...(templateDraft.dressCode || {}), title: e.target.value}})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                             <input type="text" placeholder="Emojis (e.g. 🤵‍♂️  👰‍♀️)" value={templateDraft?.dressCode?.icon || ''} onChange={e => setTemplateDraft({...templateDraft, dressCode: {...(templateDraft.dressCode || {}), icon: e.target.value}})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                             <input type="text" placeholder="Description (e.g. Please avoid wearing white.)" value={templateDraft?.dressCode?.description || ''} onChange={e => setTemplateDraft({...templateDraft, dressCode: {...(templateDraft.dressCode || {}), description: e.target.value}})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                          </div>
                        </div>

                        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>📢 Announcements</h3>
                          <textarea 
                             value={templateDraft?.announcements || ''} 
                             onChange={(e) => setTemplateDraft({...templateDraft, announcements: e.target.value})}
                             placeholder="Share any special announcements, dress code details, or transport info here. Leave blank to hide."
                             style={{ width: '100%', padding: '15px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }} 
                          />
                        </div>

                        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><Clock size={20} color="#000000" /> Itinerary Map</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {(templateDraft?.timeline || []).map((item: any, i: number) => (
                                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <input type="text" placeholder="Icon (💍)" value={item.icon || ''} onChange={e => {
                                        const newT = [...(templateDraft.timeline || [])];
                                        newT[i] = { ...newT[i], icon: e.target.value };
                                        setTemplateDraft({...templateDraft, timeline: newT});
                                    }} style={{ width: '50px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }} />
                                    <input type="text" placeholder="Time (3:00 PM)" value={item.time || ''} onChange={e => {
                                        const newT = [...(templateDraft.timeline || [])];
                                        newT[i] = { ...newT[i], time: e.target.value };
                                        setTemplateDraft({...templateDraft, timeline: newT});
                                    }} style={{ width: '100px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                    <input type="text" placeholder="Event Title" value={item.title || ''} onChange={e => {
                                        const newT = [...(templateDraft.timeline || [])];
                                        newT[i] = { ...newT[i], title: e.target.value };
                                        setTemplateDraft({...templateDraft, timeline: newT});
                                    }} style={{ flex: 1, minWidth: '120px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                    <input type="text" placeholder="Location Name" value={item.location || ''} onChange={e => {
                                        const newT = [...(templateDraft.timeline || [])];
                                        newT[i] = { ...newT[i], location: e.target.value };
                                        setTemplateDraft({...templateDraft, timeline: newT});
                                    }} style={{ flex: 1, minWidth: '120px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                    <button onClick={() => {
                                        const newT = [...(templateDraft.timeline || [])];
                                        newT.splice(i, 1);
                                        setTemplateDraft({...templateDraft, timeline: newT});
                                    }} style={{ padding: '8px 12px', background: 'transparent', color: 'red', border: '1px solid red', borderRadius: '4px', cursor: 'pointer' }}>X</button>
                                </div>
                                ))}
                            </div>
                            <button onClick={() => {
                                const newT = [...(templateDraft?.timeline || []), { time: '', title: '', location: '', icon: '✨' }];
                                setTemplateDraft({...templateDraft, timeline: newT});
                            }} style={{ padding: '8px 20px', fontSize: '0.9rem', marginTop: '15px', background: 'transparent', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer' }}>
                                + Add Event
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '20px' }}>
                          <button 
                             onClick={saveTemplateChanges}
                             style={{ padding: '15px 30px', fontSize: '1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                             disabled={uploading}
                          >
                            {uploading ? 'Uploading assets...' : 'Save & Refresh Preview'}
                          </button>
                          <span style={{ fontSize: '0.9rem', color: '#888' }}>* Note: Clicking save will instantly refresh the phone preview on the right.</span>
                        </div>
                    </div>
                )}

                {activeTab === 'confirms' && (
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px' }}>
                        <h3>RSVPs ({rsvps.length})</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <thead><tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}><th style={{ padding: '10px' }}>Name</th><th style={{ padding: '10px' }}>Status</th></tr></thead>
                            <tbody>{rsvps.map(r => (<tr key={r.id} style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px' }}>{r.name}</td><td style={{ padding: '10px' }}>{r.is_attending ? '✅' : '❌'}</td></tr>))}</tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Preview */}
            <div className="preview-pane" style={{ width: '375px', height: '700px', border: '12px solid #111', borderRadius: '40px', overflow: 'hidden', position: 'sticky', top: '20px', flexShrink: 0, backgroundColor: 'white' }}>
                <iframe key={refreshKey} src={`${window.location.origin}/${order.slug}`} style={{ width: '100%', height: '100%', border: 'none' }} />
            </div>
        </div>
      </main>
    </div>
  );
}
