'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PenTool, Users, Image as ImageIcon, Music, MapPin, Calendar, Clock, Disc, Copy, CheckCircle, Menu, X, Save } from 'lucide-react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

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

  // Auto-save logic (Debounced)
  useEffect(() => {
    if (!order?.id || Object.keys(templateDraft).length === 0) return;
    
    // Don't auto-save on initial load
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
        // Refresh preview occasionally
        setRefreshKey(k => k + 1);
      }
    }, 1500); // 1.5s delay after last change

    return () => clearTimeout(timer);
  }, [templateDraft]);

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

  const handleDraftChange = (newData: any) => {
    setSaveStatus('saving');
    setTemplateDraft(newData);
  };

  if (!user || !order) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading your dashboard...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff9f9', position: 'relative' }}>
      {/* Mobile Header */}
      <div style={{ 
        display: 'none', 
        position: 'fixed', top: 0, left: 0, right: 0, height: '60px', 
        backgroundColor: 'white', borderBottom: '1px solid #fee6ea', zIndex: 100,
        padding: '0 20px', alignItems: 'center', justifyContent: 'space-between'
      }} className="mobile-header">
        <h2 className="font-romantic" style={{ fontSize: '1.5rem', margin: 0, color: 'var(--rose-dark)' }}>Client Area</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside style={{ 
        width: '250px', backgroundColor: 'var(--card-bg)', borderRight: '1px solid #fee6ea', 
        padding: '20px 0', flexShrink: 0,
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 1000,
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px 20px', borderBottom: '1px solid #fee6ea', marginBottom: '20px' }}>
          <div>
            <h2 className="font-romantic" style={{ fontSize: '2rem', margin: 0, color: 'var(--rose-dark)' }}>Client Area</h2>
            <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>Welcome, {user.name}</p>
          </div>
          <button className="mobile-only" onClick={() => setIsSidebarOpen(false)} style={{ display: 'none', background: 'none', border: 'none' }}>
             <X size={20} />
          </button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <button 
            onClick={() => { setActiveTab('template'); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
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
            onClick={() => { setActiveTab('confirms'); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
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
          <button 
            onClick={() => { setActiveTab('seating'); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', 
              backgroundColor: activeTab === 'seating' ? 'var(--rose-light)' : 'transparent',
              color: activeTab === 'seating' ? 'var(--rose-dark)' : 'var(--text-main)', 
              border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer',
              fontWeight: activeTab === 'seating' ? 600 : 400
            }}
          >
            <Disc size={18} /> Seating Chart
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

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        marginLeft: isSidebarOpen ? '250px' : '0',
        padding: '40px', 
        overflowY: 'auto', 
        height: '100vh', 
        paddingBottom: '100px',
        transition: 'margin-left 0.3s ease'
      }}>
        
        {/* Status indicator */}
        <div style={{ 
          position: 'fixed', bottom: '20px', left: isSidebarOpen ? '270px' : '20px', 
          backgroundColor: 'white', padding: '10px 20px', borderRadius: '30px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px',
          zIndex: 50, transition: 'all 0.3s ease'
        }}>
          {saveStatus === 'saving' ? (
             <><span className="spinner-small" /> Saving changes...</>
          ) : (
             <><CheckCircle size={16} color="#28a745" /> All changes saved</>
          )}
        </div>

        {/* Feedback Encouragement Banner */}
        <div style={{ 
          backgroundColor: 'var(--rose-vibrant)', 
          color: 'white', 
          padding: '20px 25px', 
          borderRadius: '10px', 
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 15px rgba(227, 99, 135, 0.2)',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>We Value Your Experience!</h3>
            <p style={{ margin: '5px 0 0', fontSize: '0.95rem', opacity: 0.95 }}>
              Your feedbacks are really grateful to us. Be kind to add a feedback about your wedding template experience.
            </p>
          </div>
          <Link href="/feedback" style={{ 
            backgroundColor: 'white', 
            color: 'var(--rose-vibrant)', 
            padding: '10px 25px', 
            borderRadius: '6px', 
            textDecoration: 'none', 
            fontWeight: 700,
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            Give Feedback
          </Link>
        </div>

        {/* Universal Top Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', backgroundColor: 'white', padding: '15px 25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #fee6ea' }}>
                <div>
                   <div style={{ fontSize: '0.8rem', color: 'var(--rose-medium)', fontWeight: 600, letterSpacing: '1px' }}>YOUR LIVE INVITATION URL</div>
                   <div style={{ fontSize: '1.2rem', fontWeight: 500 }}>{typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/{order.slug}</div>
                </div>
                <button className="btn-outline" onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem' }}>
                    {copied ? <><CheckCircle size={16} /> Copied!</> : <><Copy size={16} /> Share Link</>}
                </button>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ backgroundColor: 'white', padding: '15px 25px', borderRadius: '10px', border: '1px solid #fee6ea', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>TOTAL GUESTS</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rose-dark)' }}>{rsvps.length}</div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '15px 25px', borderRadius: '10px', border: '1px solid #fee6ea', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>TOTAL TABLES</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--rose-dark)' }}>{templateDraft?.tables?.length || 0}</div>
                </div>
            </div>
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
            <h1 style={{ marginBottom: '30px', color: 'var(--rose-dark)' }}>RSVP Responses</h1>
            <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #fee6ea', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: 'var(--rose-light)' }}>
                  <tr>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--rose-dark)' }}>Guest Name</th>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--rose-dark)' }}>Contact Number</th>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--rose-dark)' }}>Attendance</th>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--rose-dark)' }}>Assigned Table</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map(rsvp => (
                    <tr key={rsvp.id} style={{ borderBottom: '1px solid #fee6ea' }}>
                      <td style={{ padding: '15px 20px' }}>{rsvp.name}</td>
                      <td style={{ padding: '15px 20px', color: '#666' }}>{rsvp.contact_number}</td>
                      <td style={{ padding: '15px 20px' }}>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem',
                          backgroundColor: '#e6fffa',
                          color: '#2c7a7b',
                          fontWeight: 600
                        }}>
                          ✅ CONFIRMED
                        </span>
                      </td>
                      <td style={{ padding: '15px 20px' }}>
                        {rsvp.table_number ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--rose-medium)' }}>Table {rsvp.table_number}</span>
                            <button 
                              onClick={() => handleTableAssign(rsvp.id, '')}
                              style={{ 
                                padding: '4px 8px', backgroundColor: 'transparent', color: '#c53030', 
                                border: '1px solid #c53030', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer'
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setActiveTab('seating')}
                            style={{ 
                              padding: '6px 12px', backgroundColor: 'var(--rose-medium)', color: 'white', 
                              border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            Assign Table
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'seating' && (
          <SeatingChart 
            rsvps={rsvps} 
            templateDraft={templateDraft} 
            onUpdateDraft={setTemplateDraft}
            onAssignGuest={handleTableAssign}
            onSave={saveTemplateChanges}
          />
        )}
      </main>
    </div>
  );
}

const SeatingChart = ({ rsvps, templateDraft, onUpdateDraft, onAssignGuest, onSave }: any) => {
  const tables = templateDraft.tables || [];
  const unassignedGuests = rsvps.filter((r: any) => !r.table_number);
  const [showAssignModal, setShowAssignModal] = useState<{ tableId: string, seatIdx: number } | null>(null);

  const addNewTable = () => {
    const newTables = [...tables, { id: `table-${Date.now()}`, name: `Table ${tables.length + 1}`, seats: 8 }];
    onUpdateDraft({ ...templateDraft, tables: newTables });
  };

  const addSeatToTable = (tableId: string) => {
    const newTables = tables.map((t: any) => t.id === tableId ? { ...t, seats: (t.seats || 0) + 1 } : t);
    onUpdateDraft({ ...templateDraft, tables: newTables });
  };

  const removeGuestFromSeat = (guestId: string) => {
    onAssignGuest(guestId, '');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--rose-dark)' }}>Seating Arrangement</h1>
        <button className="btn-primary" onClick={addNewTable}>+ Create New Table</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px' }}>
        {tables.map((table: any) => {
          const guestsAtTable = rsvps.filter((r: any) => r.table_number === table.name);
          const totalAdults = guestsAtTable.reduce((sum: number, r: any) => sum + (Number(r.adult_count) || 0), 0);
          const totalChildren = guestsAtTable.reduce((sum: number, r: any) => sum + (Number(r.children_count) || 0), 0);
          const totalHeadcount = totalAdults + totalChildren;
          
          return (
            <div key={table.id} style={{ 
                backgroundColor: 'white', padding: '30px', borderRadius: '15px', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #fee6ea',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={table.name} 
                  onChange={(e) => {
                    const oldName = table.name;
                    const newName = e.target.value;
                    const newTables = tables.map((t: any) => t.id === table.id ? { ...t, name: newName } : t);
                    onUpdateDraft({ ...templateDraft, tables: newTables });
                    
                    // Sync all RSVPs to the new table name
                    rsvps.forEach((r: any) => {
                        if (r.table_number === oldName) {
                            onAssignGuest(r.id, newName);
                        }
                    });
                  }}
                  style={{ fontWeight: 700, fontSize: '1.2rem', border: 'none', color: 'var(--rose-dark)', width: '120px' }}
                />
                <button onClick={() => addSeatToTable(table.id)} style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}>+ Add Seat</button>
              </div>

              <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Visual Table */}
                <div style={{ 
                  width: '100px', height: '100px', borderRadius: '50%', 
                  backgroundColor: 'var(--rose-light)', border: '2px dashed var(--rose-dark)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, flexDirection: 'column'
                }}>
                  <span style={{ fontWeight: 800, color: 'var(--rose-dark)', fontSize: '1.1rem' }}>{totalHeadcount} / {table.seats}</span>
                  <div style={{ fontSize: '0.65rem', color: 'var(--rose-medium)', marginTop: '2px' }}>
                    {totalAdults}A | {totalChildren}C
                  </div>
                </div>

                {/* Seats */}
                {[...Array(table.seats)].map((_, i) => {
                  const angle = (i / table.seats) * Math.PI * 2;
                  const radius = 85;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  // Flatten guests into individual seats with types
                  const seatMap: { guest: any, type: 'adult' | 'child' }[] = [];
                  guestsAtTable.forEach((guest: any) => {
                    const adults = Number(guest.adult_count) || 0;
                    const children = Number(guest.children_count) || 0;
                    for(let j=0; j<adults; j++) {
                      if (seatMap.length < table.seats) seatMap.push({ guest, type: 'adult' });
                    }
                    for(let j=0; j<children; j++) {
                      if (seatMap.length < table.seats) seatMap.push({ guest, type: 'child' });
                    }
                  });
                  const seatData = seatMap[i];
                  const guestAtSeat = seatData?.guest;
                  const isChild = seatData?.type === 'child';

                  return (
                    <div 
                      key={i} 
                      onClick={() => {
                        if (guestAtSeat) {
                          removeGuestFromSeat(guestAtSeat.id);
                        } else {
                          setShowAssignModal({ tableId: table.name, seatIdx: i });
                        }
                      }}
                      style={{
                        position: 'absolute',
                        transform: `translate(${x}px, ${y}px)`,
                        width: '35px', height: '35px', borderRadius: '50%',
                        backgroundColor: guestAtSeat ? (isChild ? '#ffb6c1' : 'var(--rose-vibrant)') : '#eee',
                        border: guestAtSeat ? 'none' : '2px solid #ddd',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10, transition: 'all 0.2s ease',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                      title={guestAtSeat ? `${guestAtSeat.name}${isChild ? '-child' : ''}` : "Assign Guest"}
                    >
                      {guestAtSeat ? (
                        <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: 700 }}>{guestAtSeat.name.charAt(0)}</span>
                      ) : (
                        <span style={{ color: '#aaa', fontSize: '0.8rem' }}>+</span>
                      )}
                      
                      {guestAtSeat && (
                        <div style={{ 
                          position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)',
                          backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '2px 8px',
                          borderRadius: '4px', fontSize: '0.6rem', whiteSpace: 'nowrap', pointerEvents: 'none'
                        }}>
                          {guestAtSeat.name}{isChild ? '-child' : ''}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assignment Modal (Simple) */}
      {showAssignModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '400px', maxHeight: '500px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: 'var(--rose-dark)' }}>Assign Guest</h2>
              <button onClick={() => setShowAssignModal(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>Select an unassigned guest for {showAssignModal.tableId}:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {unassignedGuests.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>No unassigned guests available.</p>}
              {unassignedGuests.map((guest: any) => (
                <button 
                  key={guest.id}
                  onClick={() => {
                    onAssignGuest(guest.id, showAssignModal.tableId);
                    setShowAssignModal(null);
                  }}
                  style={{ 
                    padding: '12px', textAlign: 'left', borderRadius: '8px', 
                    border: '1px solid #fee6ea', backgroundColor: '#fff', cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--rose-light)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                >
                  <div style={{ fontWeight: 600 }}>{guest.name}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                    {guest.adult_count || 0} Adults, {guest.children_count || 0} Children
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: 'var(--rose-light)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500, color: 'var(--rose-dark)' }}>Don't forget to save your seating plan configuration!</p>
        <button className="btn-primary" onClick={onSave} style={{ padding: '10px 25px' }}>Save Layout Changes</button>
      </div>
    </div>
  );
};
