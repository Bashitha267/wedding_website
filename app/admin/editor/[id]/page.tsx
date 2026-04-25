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
      {/* Sidebar */}
      <aside style={{ 
        width: '250px', backgroundColor: '#1c1e21', color: 'white',
        padding: '20px 0', flexShrink: 0,
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 1000,
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #333', marginBottom: '20px' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', textDecoration: 'none', fontSize: '0.8rem', marginBottom: '10px' }}>
             <ArrowLeft size={14} /> Back to Admin
          </Link>
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'white' }}>Admin Editor</h2>
          <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: 0 }}>Order: {order.customer_name}</p>
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
      <main style={{ 
        flex: 1, 
        marginLeft: isSidebarOpen ? '250px' : '0',
        padding: '40px', 
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Status indicator */}
        <div style={{ position: 'fixed', bottom: '20px', left: isSidebarOpen ? '270px' : '20px', backgroundColor: 'white', padding: '10px 20px', borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 50, transition: 'all 0.3s ease' }}>
          {saveStatus === 'saving' ? <><span className="spinner-small" /> Saving...</> : <><CheckCircle size={16} color="#28a745" /> All changes saved</>}
        </div>

        <div style={{ display: 'flex', gap: '40px' }}>
            <div style={{ flex: 1, maxWidth: '800px' }}>
                {activeTab === 'template' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginBottom: '20px' }}>Basic Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div><label>Bride</label><input type="text" value={templateDraft?.brideName || ''} onChange={e => setTemplateDraft({...templateDraft, brideName: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} /></div>
                                <div><label>Groom</label><input type="text" value={templateDraft?.groomName || ''} onChange={e => setTemplateDraft({...templateDraft, groomName: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} /></div>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            <h3>Images</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                                <div><label>Center Image</label><input type="file" onChange={e => handleFileUpload(e, 'heroImage')} style={{ display: 'block', marginTop: '5px' }} /></div>
                                <div><label>Middle Photo 1</label><input type="file" onChange={e => handleFileUpload(e, 'image1')} style={{ display: 'block', marginTop: '5px' }} /></div>
                                <div><label>Middle Photo 2</label><input type="file" onChange={e => handleFileUpload(e, 'image2')} style={{ display: 'block', marginTop: '5px' }} /></div>
                                <div><label>Middle Photo 3</label><input type="file" onChange={e => handleFileUpload(e, 'image3')} style={{ display: 'block', marginTop: '5px' }} /></div>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            <h3>Event Details</h3>
                            <div style={{ marginTop: '15px' }}>
                                <label>Location Name</label><input type="text" value={templateDraft?.location?.name || ''} onChange={e => setTemplateDraft({...templateDraft, location: {...(templateDraft.location || {}), name: e.target.value}})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                <label style={{ display: 'block', marginTop: '15px' }}>Address / Maps Link</label>
                                <textarea value={templateDraft?.location?.address || ''} onChange={e => setTemplateDraft({...templateDraft, location: {...(templateDraft.location || {}), address: e.target.value}})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                            </div>
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
            <div style={{ width: '375px', height: '700px', border: '12px solid #111', borderRadius: '40px', overflow: 'hidden', position: 'sticky', top: '20px', flexShrink: 0, backgroundColor: 'white' }}>
                <iframe key={refreshKey} src={`${window.location.origin}/${order.slug}`} style={{ width: '100%', height: '100%', border: 'none' }} />
            </div>
        </div>
      </main>
    </div>
  );
}
