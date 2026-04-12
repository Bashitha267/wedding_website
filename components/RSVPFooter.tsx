'use client';

import { useState } from 'react';
import Reveal from './Reveal';
import { supabase } from '@/lib/supabase';

const RSVPFooter = ({ orderId, data }: { orderId?: string, data?: any }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) {
      alert("Test Mode: RSVP is disabled unless viewed on a real invitation link.");
      return;
    }

    setStatus('loading');
    
    // Check if they are already registered
    const { data: existingRSVP } = await supabase
      .from('rsvps')
      .select('*')
      .eq('order_id', orderId)
      .eq('contact_number', formData.contact)
      .single();

    if (existingRSVP) {
      if (existingRSVP.table_number) {
        // Find other people at the same table
        const { data: tableMates } = await supabase
          .from('rsvps')
          .select('name')
          .eq('order_id', orderId)
          .eq('table_number', existingRSVP.table_number)
          .neq('id', existingRSVP.id);
          
        const othersNames = tableMates && tableMates.length > 0 
           ? tableMates.map(t => t.name).join(', ') 
           : '';
           
        if (othersNames) {
          setSuccessMsg(`You are confirmed at Table ${existingRSVP.table_number}! Sharing table with: ${othersNames}`);
        } else {
          setSuccessMsg(`You are confirmed at Table ${existingRSVP.table_number}!`);
        }
      } else {
        setSuccessMsg("Your RSVP is confirmed! You are not currently assigned to a table yet.");
      }
      setStatus('success');
      setFormOpen(false);
      return;
    }

    // Save completely new RSVP to Supabase
    const { error } = await supabase.from('rsvps').insert({
      order_id: orderId,
      name: formData.name,
      contact_number: formData.contact
    });

    if (error) {
      console.error(error);
      setStatus('error');
      alert("Failed to submit RSVP.");
    } else {
      setSuccessMsg("Thank you! We can't wait to see you there. 💖");
      setStatus('success');
      setFormOpen(false);
    }
  };

  return (
    <footer style={{ 
      padding: '60px 40px 100px', 
      textAlign: 'center',
      backgroundColor: 'var(--bg-cream)',
      marginTop: '40px'
    }}>
      {data?.announcements && data.announcements.trim() !== '' && (
        <Reveal delay={200}>
          <div style={{ marginBottom: '60px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📢</div>
              <div className="subheading" style={{ marginBottom: '15px' }}>ANNOUNCEMENTS</div>
              <p style={{ fontSize: '0.95rem', opacity: 0.8, maxWidth: '320px', margin: '0 auto', whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--text-main)' }}>
                  {data.announcements}
              </p>
          </div>
        </Reveal>
      )}
      
      <Reveal delay={600}>
        <div style={{ marginBottom: '60px' }}>
            <div className="subheading" style={{ marginBottom: '20px' }}>PLEASE RSVP</div>
            
            {!formOpen && status !== 'success' && (
              <button onClick={() => setFormOpen(true)} className="btn-primary" style={{ padding: '16px 48px' }}>
                RSVP HERE
              </button>
            )}

            {formOpen && status !== 'success' && (
              <form onSubmit={handleSubmit} style={{ 
                maxWidth: '300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px',
                padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}>
                <input 
                  type="text" 
                  placeholder="Your Full Name" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{
                    padding: '12px', border: '1px solid #ccc', borderRadius: '4px'
                  }}
                />
                <input 
                  type="tel" 
                  placeholder="Contact Number" 
                  required 
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  style={{
                    padding: '12px', border: '1px solid #ccc', borderRadius: '4px'
                  }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setFormOpen(false)} className="btn-outline" style={{ flex: 1, padding: '10px' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }} disabled={status === 'loading'}>
                    {status === 'loading' ? 'Saving...' : 'Confirm'}
                  </button>
                </div>
              </form>
            )}

            {status === 'success' && (
              <div style={{ color: 'var(--rose-dark)', fontWeight: 600, fontSize: '0.9rem', padding: '20px', backgroundColor: 'var(--rose-light)', borderRadius: '10px', maxWidth: '300px', margin: '0 auto', lineHeight: 1.5 }}>
                {successMsg}
              </div>
            )}
        </div>
      </Reveal>

      <Reveal delay={800}>
        <div style={{ 
          marginTop: '60px',
          position: 'relative',
          height: '500px',
          width: 'calc(100% + 80px)',
          margin: '60px -40px -100px',
          backgroundImage: `url("${data?.images?.thankYouImage || '/photo_5.png'}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
        }}>
            {/* Darker overlay for mood and contrast */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                zIndex: 1
            }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ 
                    fontSize: '5.5rem', 
                    fontFamily: 'var(--font-display)', 
                    color: '#ffeef2',
                    textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 15px rgba(217, 133, 148, 0.5)'
                }}>
                    Thank You
                </div>
                <div className="subheading" style={{ marginTop: '10px', letterSpacing: '6px', color: 'var(--rose-vibrant)', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.6)', textTransform: 'uppercase' }}>
                    {data?.brideName || 'SARAH'} & {data?.groomName || 'MARK'} • {data?.eventDate ? new Date(data.eventDate).getFullYear() : '2026'}
                </div>
            </div>
        </div>
      </Reveal>
    </footer>
  );
};

export default RSVPFooter;
