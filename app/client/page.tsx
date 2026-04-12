'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PenTool, Users, Image as ImageIcon, Music, MapPin, Calendar, Clock, Disc, Copy, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset'; 
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dxoa3ashm';

export default function ClientDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('template');
  const [user, setUser] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [selectedTableGuest, setSelectedTableGuest] = useState<any>(null);
  
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Template draft state
  const [templateDraft, setTemplateDraft] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // 1. Get logged in user 
    const stored = localStorage.getItem('wedding_client');
    if (!stored) {
      router.push('/client/login');
      return;
    }
    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);
    
    // 2. Fetch their template order & RSVPs
    fetchClientData(parsedUser.username);
  }, [router]);

  useEffect(() => {
    if (!order?.id) return;
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rsvps', filter: `order_id=eq.${order.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRsvps((prev) => [...prev, payload.new as any]);
          } else if (payload.eventType === 'UPDATE') {
            setRsvps((prev) => prev.map(r => r.id === payload.new.id ? (payload.new as any) : r));
          } else if (payload.eventType === 'DELETE') {
            setRsvps((prev) => prev.filter(r => r.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order?.id]);

  const fetchClientData = async (username: string) => {
    // Fetch Order
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('client_username', username)
      .single();
      
    if (orderData) {
      setOrder(orderData);
      
      const parsedData = orderData.template_data || {};
      if (!parsedData.timeline) {
          parsedData.timeline = [
              { time: '2:30 PM', title: 'Welcome Drinks', icon: '🥂', location: 'Main Entrance' },
              { time: '3:00 PM', title: 'Ceremony', icon: '💍', location: 'The Rose Garden' },
              { time: '4:30 PM', title: 'Cocktails', icon: '🍸', location: 'Main Terrace' },
              { time: '6:00 PM', title: 'Dinner', icon: '🍽️', location: 'Victoria Hall' },
              { time: '9:00 PM', title: 'Party', icon: '💃', location: 'Dance Floor' },
              { time: '11:00 PM', title: 'Send Off', icon: '✨', location: 'Grand Exit' }
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

  const handleCopyLink = () => {
    if (!order) return;
    const url = `${window.location.protocol}//${window.location.host}/${order.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTableAssign = async (id: string, table: string) => {
    // Optimistic UI Update
    setRsvps(rsvps.map(r => r.id === id ? { ...r, table_number: table || null } : r));
    
    // DB Update
    await supabase.from('rsvps').update({ table_number: table || null }).eq('id', id);
  };

  // Generic Cloudinary Unsigned Upload
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
        // Update local draft state
        setTemplateDraft((prev: any) => {
          const draft = { ...prev };
          if (!draft.images) draft.images = {};
          
          if (fieldCategory === 'heroImage') {
             draft.images.heroImage = urls[0];
          } else if (fieldCategory === 'musicUrl') {
             draft.musicUrl = urls[0];
          } else if (isArray && fieldCategory === 'gallery') {
             draft.images.gallery = [...(draft.images.gallery || []), ...urls];
          } else {
             draft.images[fieldCategory] = urls[0];
          }
          return draft;
        });
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload file to Cloudinary.");
    } finally {
      setUploading(false);
    }
  };

  const saveTemplateChanges = async () => {
    if (!order) return;
    const { error } = await supabase
      .from('orders')
      .update({ template_data: templateDraft })
      .eq('id', order.id);
      
    if (error) {
      alert("Failed to save changes.");
    } else {
      setRefreshKey(k => k + 1); // Refresh the embedded phone preview!
    }
  };

  const getTableGuests = (tableNumber: string | null) => {
    if (!tableNumber) return [];
    return rsvps.filter(r => r.table_number === tableNumber);
  };

  if (!user || !order) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading your dashboard...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff9f9' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: 'var(--card-bg)', borderRight: '1px solid #fee6ea', padding: '20px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #fee6ea', marginBottom: '20px' }}>
          <h2 className="font-romantic" style={{ fontSize: '2rem', margin: 0, color: 'var(--rose-dark)' }}>Client Area</h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>Welcome, {user.name}</p>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <button 
            onClick={() => setActiveTab('template')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', 
              backgroundColor: activeTab === 'template' ? 'var(--rose-light)' : 'transparent',
              color: activeTab === 'template' ? 'var(--rose-dark)' : 'var(--text-main)', 
              border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer',
              fontWeight: activeTab === 'template' ? 600 : 400
            }}
          >
            <PenTool size={18} /> Edit Template
          </button>
          <button 
            onClick={() => setActiveTab('confirms')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', 
              backgroundColor: activeTab === 'confirms' ? 'var(--rose-light)' : 'transparent',
              color: activeTab === 'confirms' ? 'var(--rose-dark)' : 'var(--text-main)', 
              border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer',
              fontWeight: activeTab === 'confirms' ? 600 : 400
            }}
          >
            <Users size={18} /> RSVPs ({rsvps.length})
          </button>
        </nav>
        <div style={{ position: 'absolute', bottom: '20px', padding: '0 20px' }}>
            <button 
                onClick={() => { localStorage.removeItem('wedding_client'); router.push('/client/login'); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', fontSize: '0.9rem', opacity: 0.8 }}
            >
                Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', height: '100vh', paddingBottom: '100px' }}>
        
        {/* Universal Top Bar for Client URL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '15px 25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #fee6ea', marginBottom: '30px' }}>
            <div>
               <div style={{ fontSize: '0.8rem', color: 'var(--rose-medium)', fontWeight: 600, letterSpacing: '1px' }}>YOUR LIVE INVITATION URL</div>
               <div style={{ fontSize: '1.2rem', fontWeight: 500 }}>{typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/{order.slug}</div>
            </div>
            <button className="btn-outline" onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem' }}>
                {copied ? <><CheckCircle size={16} /> Copied!</> : <><Copy size={16} /> Share Link</>}
            </button>
        </div>

        {activeTab === 'template' && (
          <div style={{ display: 'flex', gap: '50px', alignItems: 'flex-start' }}>
            {/* Left Column: Form Editor */}
            <div style={{ flex: 1, maxWidth: '800px' }}>
              <h1 style={{ marginBottom: '30px', color: 'var(--rose-dark)' }}>Customize Your Template</h1>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Names */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #fee6ea' }}>
                  <h3 style={{ marginBottom: '15px', color: 'var(--rose-dark)' }}>Couple Names</h3>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Bride's Name</label>
                      <input type="text" value={templateDraft?.brideName || ''} onChange={e => setTemplateDraft({...templateDraft, brideName: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Groom's Name</label>
                      <input type="text" value={templateDraft?.groomName || ''} onChange={e => setTemplateDraft({...templateDraft, groomName: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>
                  </div>
                </div>

                {/* Images Section */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #fee6ea' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><ImageIcon size={20} color="var(--rose-medium)" /> Manage Images</h3>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>Upload your photos via Cloudinary.</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                     <div>
                         <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Hero Cover Image</label>
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
                         <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Thank You / RSVP Image</label>
                         <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thankYouImage')} disabled={uploading} />
                         {templateDraft?.images?.thankYouImage && <img src={templateDraft.images.thankYouImage} alt="ThankYou" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
                     </div>
                  </div>

                  <hr style={{ borderColor: '#fee6ea', margin: '20px 0' }} />
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

                {/* Date & Location Side by Side */}
                <div style={{ display: 'flex', gap: '30px' }}>
                  {/* Date */}
                  <div style={{ flex: 1, backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #fee6ea' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><Calendar size={20} color="var(--rose-medium)" /> Date & Time</h3>
                    <input 
                       type="datetime-local" 
                       value={templateDraft?.eventDate ? templateDraft.eventDate.substring(0,16) : ''} 
                       onChange={(e) => setTemplateDraft({...templateDraft, eventDate: e.target.value})}
                       style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '15px' }} 
                    />
                  </div>
                  
                  {/* Location */}
                  <div style={{ flex: 1, backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #fee6ea' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><MapPin size={20} color="var(--rose-medium)" /> Location</h3>
                    <input type="text" placeholder="Venue Name" value={templateDraft?.location?.name || ''} onChange={e => setTemplateDraft({...templateDraft, location: {...(templateDraft.location || {}), name: e.target.value}})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }} />
                    <textarea placeholder="Full Address / Google Maps Link" value={templateDraft?.location?.address || ''} onChange={e => setTemplateDraft({...templateDraft, location: {...(templateDraft.location || {}), address: e.target.value}})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical', minHeight: '60px' }} />
                  </div>
                </div>

                {/* Music */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #fee6ea' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><Music size={20} color="var(--rose-medium)" /> Background Music</h3>
                  <input 
                     type="text" 
                     value={templateDraft?.musicUrl || ''} 
                     onChange={(e) => setTemplateDraft({...templateDraft, musicUrl: e.target.value})}
                     placeholder="Spotify Link or MP3 URL" 
                     style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '15px' }} 
                  />
                  <input type="file" accept="audio/*" onChange={(e) => handleFileUpload(e, 'musicUrl')} disabled={uploading} />
                </div>

                {/* Dress Code */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #fee6ea' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>👗 Dress Code</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                     <input type="text" placeholder="Title (e.g. Formal Attire)" value={templateDraft?.dressCode?.title || ''} onChange={e => setTemplateDraft({...templateDraft, dressCode: {...(templateDraft.dressCode || {}), title: e.target.value}})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                     <input type="text" placeholder="Emojis (e.g. 🤵‍♂️  👰‍♀️)" value={templateDraft?.dressCode?.icon || ''} onChange={e => setTemplateDraft({...templateDraft, dressCode: {...(templateDraft.dressCode || {}), icon: e.target.value}})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                     <input type="text" placeholder="Description (e.g. Please avoid wearing white.)" value={templateDraft?.dressCode?.description || ''} onChange={e => setTemplateDraft({...templateDraft, dressCode: {...(templateDraft.dressCode || {}), description: e.target.value}})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                  </div>
                </div>

                {/* Announcements */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #fee6ea' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>📢 Announcements</h3>
                  <textarea 
                     value={templateDraft?.announcements || ''} 
                     onChange={(e) => setTemplateDraft({...templateDraft, announcements: e.target.value})}
                     placeholder="Share any special announcements, dress code details, or transport info here. Leave blank to hide."
                     style={{ width: '100%', padding: '15px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }} 
                  />
                </div>

                {/* Itinerary / Timeline */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #fee6ea' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><Clock size={20} color="var(--rose-medium)" /> Itinerary Map</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {(templateDraft?.timeline || []).map((item: any, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input type="text" placeholder="Icon (e.g. 💍)" value={item.icon || ''} onChange={e => {
                          const newT = [...(templateDraft.timeline || [])];
                          newT[i] = { ...newT[i], icon: e.target.value };
                          setTemplateDraft({...templateDraft, timeline: newT});
                        }} style={{ width: '60px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }} />
                        <input type="text" placeholder="Time (3:00 PM)" value={item.time || ''} onChange={e => {
                          const newT = [...(templateDraft.timeline || [])];
                          newT[i] = { ...newT[i], time: e.target.value };
                          setTemplateDraft({...templateDraft, timeline: newT});
                        }} style={{ width: '120px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <input type="text" placeholder="Event Title" value={item.title || ''} onChange={e => {
                          const newT = [...(templateDraft.timeline || [])];
                          newT[i] = { ...newT[i], title: e.target.value };
                          setTemplateDraft({...templateDraft, timeline: newT});
                        }} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <input type="text" placeholder="Location Name" value={item.location || ''} onChange={e => {
                          const newT = [...(templateDraft.timeline || [])];
                          newT[i] = { ...newT[i], location: e.target.value };
                          setTemplateDraft({...templateDraft, timeline: newT});
                        }} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <button onClick={() => {
                          const newT = [...(templateDraft.timeline || [])];
                          newT.splice(i, 1);
                          setTemplateDraft({...templateDraft, timeline: newT});
                        }} className="btn-outline" style={{ padding: '8px 12px', color: 'red', borderColor: 'red' }}>X</button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => {
                    const newT = [...(templateDraft?.timeline || []), { time: '', title: '', location: '', icon: '✨' }];
                    setTemplateDraft({...templateDraft, timeline: newT});
                  }} className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.9rem', marginTop: '15px' }}>
                    + Add Event
                  </button>
                </div>

                {/* Action */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '20px' }}>
                  <button 
                     className="btn-primary" 
                     onClick={saveTemplateChanges}
                     style={{ padding: '15px 30px', fontSize: '1rem' }}
                     disabled={uploading}
                  >
                    {uploading ? 'Uploading assets...' : 'Save & Refresh Preview'}
                  </button>
                  <span style={{ fontSize: '0.9rem', color: '#888' }}>* Note: Clicking save will instantly refresh the phone preview on the right.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Mobile Preview */}
            <div style={{
               width: '375px',
               height: '750px',
               border: '14px solid #111',
               borderRadius: '45px',
               overflow: 'hidden',
               flexShrink: 0,
               backgroundColor: '#fff',
               boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px #eee inset',
               position: 'sticky',
               top: '20px',
               display: 'flex',
               flexDirection: 'column'
            }}>
              <iframe 
                 key={`preview-${refreshKey}`}
                 src={`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/${order.slug}`} 
                 style={{ width: '100%', height: '100%', border: 'none' }} 
                 title="Live Invitation Preview" 
              />
            </div>
          </div>
        )}

        {activeTab === 'confirms' && (
          <div>
            <h1 style={{ marginBottom: '30px', color: 'var(--rose-dark)' }}>RSVPs & Table Assignments</h1>
            
            <div style={{ display: 'flex', gap: '40px' }}>
              {/* RSVP List Table */}
              <div style={{ flex: 2, backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #fee6ea', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: 'var(--rose-light)' }}>
                    <tr>
                      <th style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--rose-dark)' }}>Guest Name</th>
                      <th style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--rose-dark)' }}>Contact Number</th>
                      <th style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--rose-dark)' }}>Table No.</th>
                      <th style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--rose-dark)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvps.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
                           No RSVPs yet. Share your URL!
                        </td>
                      </tr>
                    )}
                    {rsvps.map(rsvp => (
                      <tr key={rsvp.id} style={{ borderBottom: '1px solid #fee6ea' }}>
                        <td style={{ padding: '15px 20px' }}>{rsvp.name}</td>
                        <td style={{ padding: '15px 20px', color: '#666' }}>{rsvp.contact_number}</td>
                        <td style={{ padding: '15px 20px' }}>
                          <input 
                            type="text" 
                            value={rsvp.table_number || ''} 
                            onChange={(e) => handleTableAssign(rsvp.id, e.target.value)}
                            placeholder="Assign..."
                            style={{ 
                              width: '80px', padding: '5px', textAlign: 'center', 
                              border: '1px solid #ccc', borderRadius: '4px' 
                            }}
                          />
                        </td>
                        <td style={{ padding: '15px 20px' }}>
                          <button 
                            onClick={() => setSelectedTableGuest(rsvp)}
                            className="btn-outline" 
                            style={{ 
                                padding: '6px 12px', fontSize: '0.8rem', 
                                backgroundColor: selectedTableGuest?.id === rsvp.id ? 'var(--rose-dark)' : 'transparent', 
                                color: selectedTableGuest?.id === rsvp.id ? 'white' : 'var(--bw-black)' 
                            }}
                            disabled={!rsvp.table_number}
                          >
                            View Table
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table View Visualizer */}
              <div style={{ flex: 1, backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #fee6ea', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ marginBottom: '30px', color: 'var(--rose-dark)' }}>Table Visualizer</h3>
                
                {selectedTableGuest && selectedTableGuest.table_number ? (
                  <div style={{ position: 'relative', width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
                    {/* The Table (Circle) */}
                    <div style={{ 
                      width: '120px', height: '120px', borderRadius: '50%', 
                      backgroundColor: 'var(--rose-light)', border: '2px dashed var(--rose-dark)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10
                    }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--rose-dark)', fontWeight: 600 }}>TABLE</span>
                      <span style={{ fontSize: '2rem', color: 'var(--rose-dark)', fontWeight: 800 }}>{selectedTableGuest.table_number}</span>
                    </div>

                    {/* The Guests (Around the table) */}
                    {getTableGuests(selectedTableGuest.table_number).map((guest, index, arr) => {
                      const angle = (index / arr.length) * Math.PI * 2;
                      const radius = 100;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;
                      
                      const isSelected = guest.id === selectedTableGuest.id;

                      return (
                        <div key={guest.id} style={{
                          position: 'absolute',
                          transform: `translate(${x}px, ${y}px)`,
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          zIndex: 20
                        }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: isSelected ? 'var(--rose-vibrant)' : 'var(--text-main)',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                          }}>
                            {guest.name.charAt(0)}
                          </div>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            marginTop: '5px', 
                            backgroundColor: 'white', 
                            padding: '2px 5px', 
                            borderRadius: '4px',
                            fontWeight: isSelected ? 600 : 400,
                            color: isSelected ? 'var(--rose-dark)' : 'var(--text-main)',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                          }}>
                            {guest.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', opacity: 0.5, textAlign: 'center' }}>
                    <Disc size={40} style={{ marginBottom: '10px' }} />
                    <p>Select a guest to view their table placement.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
