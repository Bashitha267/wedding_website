'use client';

import { useState, useEffect } from 'react';
import Reveal from '@/components/Reveal';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Montserrat, Playfair_Display } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'], style: ['italic', 'normal'] });

// Music Icon
const MusicIcon = ({ muted }: { muted: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
    {muted && <line x1="1" y1="1" x2="23" y2="23" />}
  </svg>
);

// Custom RSVP component for this template
const MinimalRSVP = ({ orderId, data }: { orderId?: string, data?: any }) => {
  const [formData, setFormData] = useState({ name: '', contact: '', adults: 1, children: 0, dietary: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) {
      alert("Test Mode: RSVP is disabled in preview.");
      return;
    }

    setStatus('loading');
    const { error } = await supabase.from('rsvps').insert({
      order_id: orderId,
      name: formData.name,
      contact_number: formData.contact,
      adult_count: formData.adults,
      children_count: formData.children,

    });

    if (error) {
      setStatus('error');
    } else {
      setSuccessMsg("We've received your RSVP. Thank you!");
      setStatus('success');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f9f9f9', borderRadius: '15px' }}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✨</div>
        <h3 style={{ fontFamily: 'inherit', fontSize: '1.5rem', marginBottom: '10px' }}>Thank You!</h3>
        <p style={{ color: '#666' }}>{successMsg}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6, fontWeight: 600 }}>Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            style={{ border: '1px solid #e0e0e0', padding: '12px 15px', outline: 'none', fontFamily: 'inherit', fontSize: '1rem', borderRadius: '4px', backgroundColor: '#fff', width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6, fontWeight: 600 }}>Contact Number</label>
          <input
            type="tel"
            required
            value={formData.contact}
            onChange={e => setFormData({ ...formData, contact: e.target.value })}
            style={{ border: '1px solid #e0e0e0', padding: '12px 15px', outline: 'none', fontFamily: 'inherit', fontSize: '1rem', borderRadius: '4px', backgroundColor: '#fff', width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6, fontWeight: 600 }}>Adults</label>
            <input
              type="number"
              min="1"
              value={formData.adults}
              onChange={e => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
              style={{ border: '1px solid #e0e0e0', padding: '12px 15px', outline: 'none', fontFamily: 'inherit', fontSize: '1rem', borderRadius: '4px', backgroundColor: '#fff', width: '100%', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6, fontWeight: 600 }}>Children</label>
            <input
              type="number"
              min="0"
              value={formData.children}
              onChange={e => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
              style={{ border: '1px solid #e0e0e0', padding: '12px 15px', outline: 'none', fontFamily: 'inherit', fontSize: '1rem', borderRadius: '4px', backgroundColor: '#fff', width: '100%', boxSizing: 'border-box' }}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '18px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.8rem',
            letterSpacing: '3px',
            cursor: 'pointer',
            marginTop: '10px',
            fontWeight: 600,
            transition: 'opacity 0.3s'
          }}
        >
          {status === 'loading' ? 'SUBMITTING...' : 'CONFIRM ATTENDANCE'}
        </button>
      </form>
    </div>
  );
};

// Wax Seal Component


// Custom Countdown
const MinimalCountdown = ({ data }: { data?: any }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = data?.eventDate ? new Date(data.eventDate).getTime() : new Date('September 20, 2026 15:00:00').getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) { clearInterval(timer); return; }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [data?.eventDate]);

  const items = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds }
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '25px' }}>
      {items.map(item => (
        <div key={item.label} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.2rem', fontWeight: 300, marginBottom: '5px', letterSpacing: '-1px' }}>{item.value.toString().padStart(2, '0')}</div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '2px', opacity: 0.4, fontWeight: 600 }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

// Custom Timeline
const MinimalTimeline = ({ data }: { data?: any }) => {
  const events = data?.timeline?.length > 0 ? data.timeline : [
    { time: '14:30', title: 'CEREMONY', location: 'St. Peter\'s Church' },
    { time: '16:30', title: 'COCKTAILS', location: 'The Garden' },
    { time: '18:30', title: 'DINNER', location: 'Grand Ballroom' },
    { time: '21:00', title: 'PARTY', location: 'The Lounge' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', maxWidth: '320px', margin: '0 auto', position: 'relative' }}>
      <div style={{ position: 'absolute', left: '0', top: '10px', bottom: '10px', width: '1px', backgroundColor: '#e5e5e5' }}></div>
      {events.map((event: any, i: number) => (
        <Reveal key={i} delay={i * 100}>
          <div style={{ paddingLeft: '40px', position: 'relative', textAlign: 'left' }}>
            <div style={{ position: 'absolute', left: '-4px', top: '8px', width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#1a1a1a' }}></div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '2px', opacity: 0.4, marginBottom: '6px', fontWeight: 600 }}>{event.time}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 500, letterSpacing: '1px', marginBottom: '4px' }}>{event.title}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.5, fontStyle: 'italic' }}>{event.location}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

export default function MinimalTemplate({ data, orderId }: { data: any, orderId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnsealing, setIsUnsealing] = useState(false);
  const [muted, setMuted] = useState(false);
  const [locationType, setLocationType] = useState<'ceremony' | 'reception'>('ceremony');

  const audioUrl = data?.musicUrl || "https://res.cloudinary.com/dnfbik3if/video/upload/v1775201422/krasnoshchok-wedding-romantic-love-music-409293_ikekwk.mp3";

  const initials = `${(data?.brideName?.[0] || 'S')}${(data?.groomName?.[0] || 'M')}`;

  // Dynamic image gathering from user data
  const userImages = data?.images || {};
  const galleryArray = Array.isArray(userImages.gallery) ? userImages.gallery : [];
  
  // Combine all possible user images into a single gallery list, removing duplicates/nulls
  const combinedGallery = Array.from(new Set([
    userImages.image1, 
    userImages.image2, 
    userImages.image3, 
    userImages.image4,
    ...galleryArray
  ])).filter(Boolean) as string[];

  const images = {
    hero: userImages.heroImage || '/photo_4.png',
    gallery: combinedGallery.length > 0 ? combinedGallery : ['/photo_2.png', '/photo_3.png', '/photo_4.png']
  };


  const ceremonyInfo = {
    name: data?.ceremonyLocation?.name || data?.location?.name || '',
    address: data?.ceremonyLocation?.address || data?.location?.address || '',
    time: data?.ceremonyTime || (data?.eventDate ? new Date(data.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
    mapUrl: data?.ceremonyLocation?.mapUrl || data?.location?.mapUrl || ''
  };

  const receptionInfo = {
    name: data?.receptionLocation?.name || '',
    address: data?.receptionLocation?.address || '',
    time: data?.receptionTime || '',
    mapUrl: data?.receptionLocation?.mapUrl || ''
  };

  const hasCeremony = !!ceremonyInfo.name;
  const hasReception = !!receptionInfo.name;

  // Default to what is available
  useEffect(() => {
    if (!hasCeremony && hasReception) setLocationType('reception');
  }, [hasCeremony, hasReception]);

  if (!hasCeremony && !hasReception) return null;

  const activeLocation = locationType === 'ceremony' ? ceremonyInfo : receptionInfo;

  const handleOpen = () => {
    if (isUnsealing) return;
    setIsUnsealing(true);
    
    // Play music
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) {
      audio.play().catch(e => console.log("Audio play blocked", e));
    }

    setTimeout(() => {
      setIsOpen(true);
    }, 1200);
  };

  return (
    <div className={montserrat.className} style={{ backgroundColor: '#fff', color: '#1a1a1a', minHeight: '100vh', overflowX: 'hidden' }}>
      
      <audio id="bg-music" loop muted={muted}>
        <source src={audioUrl} type="audio/mpeg" />
      </audio>

      {/* Floating Music Toggle */}
      {isOpen && (
        <button 
          onClick={() => setMuted(!muted)}
          style={{ 
            position: 'fixed', bottom: '20px', right: '20px', zIndex: 4000,
            width: '45px', height: '45px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #eee',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)', cursor: 'pointer'
          }}
        >
          <MusicIcon muted={muted} />
        </button>
      )}

      {/* Envelope Section */}
      {!isOpen && (
        <div 
          onClick={handleOpen}
          style={{ 
            position: 'fixed', inset: 0, zIndex: 3000, 
            backgroundColor: '#f9f9f9',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer', overflow: 'hidden'
          }}
        >
          <div style={{ 
            position: 'relative', width: '300px', height: '210px',
            transform: isUnsealing ? 'scale(1.1) translateY(20px)' : 'scale(1)',
            transition: 'transform 1.2s ease-in-out',
            perspective: '1000px'
          }}>
             {/* Card inside */}
             <div style={{
               position: 'absolute', inset: '10px',
               background: '#fff', zIndex: 1,
               transform: isUnsealing ? 'translateY(-80px)' : 'translateY(0)',
               transition: 'transform 1s ease-in-out 0.3s',
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
             }}>
                <div style={{ border: '1px solid #eee', width: '85%', height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <span className={playfair.className} style={{ fontSize: '1.2rem', opacity: 0.3 }}>{initials}</span>
                </div>
             </div>

             {/* Envelope Image Base */}
             <div style={{ 
               position: 'absolute', inset: 0, zIndex: 2, 
               borderRadius: '4px', boxShadow: '0 15px 45px rgba(0,0,0,0.1)',
               overflow: 'hidden'
             }}>
               <Image src="/minimal_envelope_base.png" alt="Envelope" fill style={{ objectFit: 'cover' }} />
             </div>



             {/* Wax Seal */}
             {!isUnsealing && (
               <div style={{ 
                 position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', 
                 zIndex: 5, transition: 'opacity 0.3s'
               }}>
                 <div style={{ width: '45px', height: '45px', backgroundColor: '#1a1a1a', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                    <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{initials}</span>
                 </div>
               </div>
             )}
          </div>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '6px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '10px', fontWeight: 600 }}>INVITATION</div>
            <div className={playfair.className} style={{ fontSize: '1.6rem', marginBottom: '10px', letterSpacing: '1px' }}>{data?.brideName || 'Silvia'} & {data?.groomName || 'Massimiliano'}</div>
            <div className="bounce-soft" style={{ fontSize: '0.6rem', letterSpacing: '4px', opacity: 0.4, marginTop: '10px' }}>TAP TO UNSEAL</div>
          </div>
        </div>
      )}

      <main style={{ 
        maxWidth: '480px', 
        margin: '0 auto', 
        position: 'relative', 
        backgroundColor: '#fff', 
        boxShadow: '0 20px 80px rgba(0,0,0,0.08)', 
        border: '8px solid #fdfdfd',
        borderTop: 'none',
        borderRadius: '0 0 4px 4px',
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.8s ease-in'
      }}>

        {/* Hero Section */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff', position: 'relative', paddingBottom: '40px', paddingTop: 0 }}>

          {/* Blended Floral Header */}
          <div style={{ width: '100%', height: '280px', position: 'relative', zIndex: 1, marginTop: '-10px' }}>
            <Image src="/luxe_floral_header.png" alt="Floral Design" fill style={{ objectFit: 'cover', objectPosition: 'top' }} priority />
            {/* Gradient Overlay for Blending */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '180px',
              background: 'linear-gradient(to top, #ffffff 15%, transparent 100%)',
              zIndex: 2
            }}></div>
          </div>




          <Reveal delay={500}>
            <div style={{ textAlign: 'center', padding: '0 30px' }}>
              <p style={{ fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '15px', fontWeight: 600 }}>
                YOU ARE INVITED TO THE WEDDING OF
              </p>

              <h1 className={playfair.className} style={{ fontSize: '3.5rem', margin: '0', fontWeight: 400, lineHeight: 0.9, letterSpacing: '-1px' }}>
                {data?.brideName || 'Silvia'}
              </h1>
              <div className={playfair.className} style={{ fontSize: '2rem', opacity: 0.3, margin: '10px 0' }}>&</div>
              <h1 className={playfair.className} style={{ fontSize: '3.5rem', margin: '0', fontWeight: 400, lineHeight: 0.9, letterSpacing: '-1px' }}>
                {data?.groomName || 'Massimiliano'}
              </h1>

              <div style={{ marginTop: '35px', fontSize: '1rem', fontWeight: 500, letterSpacing: '2px' }}>
                {data?.eventDate ? new Date(data.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase() : '20 SEPTEMBER 2026'}
              </div>
              <p style={{ fontSize: '0.8rem', opacity: 0.4, marginTop: '8px', letterSpacing: '1px', fontWeight: 500, marginBottom: '20px' }}>
                {data?.location?.city?.toUpperCase() || 'TERRASINI, SICILIA'}
              </p>
            </div>
          </Reveal>

          <div style={{ marginTop: '40px', opacity: 0.1 }}>
            <div style={{ width: '1px', height: '40px', backgroundColor: '#1a1a1a' }}></div>
          </div>
        </section>

        {/* Main Couple Photo */}
        <Reveal>
          <div style={{ height: '380px', width: '100%', position: 'relative', marginBottom: '20px' }}>
            <Image src={images.hero} alt="Couple" fill style={{ objectFit: 'cover' }} />
          </div>
        </Reveal>

        {/* Announcements */}
        {data?.announcements && (
          <section style={{ padding: '60px 40px', textAlign: 'center', backgroundColor: '#fcfcfc' }}>
            <Reveal>
               <div style={{ display: 'inline-block', marginBottom: '20px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1" opacity="0.4">
                    <path d="M18 8a6 6 0 0 0-12 0c0 7 3 9 3 9h6s3-2 3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
               </div>
               <h3 className={playfair.className} style={{ fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '15px', fontWeight: 400 }}>ANNOUNCEMENT</h3>
               <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.7, fontStyle: 'italic', maxWidth: '350px', margin: '0 auto' }}>
                 "{data.announcements}"
               </p>
            </Reveal>
          </section>
        )}

        {/* Countdown */}
        <section style={{ padding: '40px 20px 80px', textAlign: 'center' }}>
          <Reveal>
            <h2 style={{ fontSize: '0.7rem', letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '40px', fontWeight: 600 }}>COUNTDOWN</h2>
            <div style={{ transform: 'scale(0.9)' }}>
              <MinimalCountdown data={data} />
            </div>
          </Reveal>
        </section>



        {/* Location Toggle */}
        <section style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: '#fafafa' }}>
          <Reveal>
            <h2 style={{ fontSize: '0.7rem', letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '45px', fontWeight: 600 }}>THE LOCATION</h2>

            {hasCeremony && hasReception && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '45px' }}>
                <button
                  onClick={() => setLocationType('ceremony')}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '0',
                    border: '1px solid #1a1a1a',
                    backgroundColor: locationType === 'ceremony' ? '#1a1a1a' : 'transparent',
                    color: locationType === 'ceremony' ? 'white' : '#1a1a1a',
                    fontSize: '0.75rem',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontWeight: 600
                  }}
                >
                  CEREMONY
                </button>
                <button
                  onClick={() => setLocationType('reception')}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '0',
                    border: '1px solid #1a1a1a',
                    backgroundColor: locationType === 'reception' ? '#1a1a1a' : 'transparent',
                    color: locationType === 'reception' ? 'white' : '#1a1a1a',
                    fontSize: '0.75rem',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontWeight: 600
                  }}
                >
                  RECEPTION
                </button>
              </div>
            )}

            <div>
              <Reveal key={locationType}>
                {activeLocation.name && <h3 className={playfair.className} style={{ fontSize: '1.8rem', marginBottom: '12px', fontWeight: 400 }}>{activeLocation.name}</h3>}
                {activeLocation.address && <p style={{ fontSize: '0.9rem', opacity: 0.5, marginBottom: '25px', lineHeight: 1.6 }}>{activeLocation.address}</p>}
                {activeLocation.time && <div style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '35px', letterSpacing: '1px' }}>{activeLocation.time}</div>}

                {activeLocation.mapUrl && activeLocation.mapUrl !== '#' && activeLocation.mapUrl.includes('google.com/maps') && (
                  <>
                    <div style={{ height: '280px', width: '100%', borderRadius: '2px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '35px' }}>
                      <iframe
                        src={activeLocation.mapUrl}
                        width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                      ></iframe>
                    </div>
                    <a href={activeLocation.mapUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '12px 0', borderBottom: '1px solid #1a1a1a', color: '#1a1a1a', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '3px', fontWeight: 600 }}>
                      VIEW ON MAP
                    </a>
                  </>
                )}
              </Reveal>
            </div>
          </Reveal>
        </section>



        {/* Timeline */}
        <section style={{ padding: '100px 20px' }}>
          <Reveal>
            <h2 style={{ fontSize: '0.95rem', letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '60px', textAlign: 'center', fontWeight: 600 }}>WEDDING TIMELINE</h2>
            <MinimalTimeline data={data} />
          </Reveal>
        </section>




        {/* Dress Code */}
        {(data?.dressCode?.title || (typeof data?.dressCode === 'string' && data.dressCode)) && (
          <section style={{ padding: '80px 20px', textAlign: 'center' }}>
            <Reveal>
               <h2 style={{ fontSize: '0.7rem', letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '25px', fontWeight: 600 }}>DRESS CODE</h2>
               <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                 {data?.dressCode?.icon || data?.dressCodeEmoji || '👗'}
               </div>
               <h3 className={playfair.className} style={{ fontSize: '1.8rem', marginBottom: '10px', fontWeight: 400 }}>
                 {typeof data.dressCode === 'object' ? data.dressCode.title : data.dressCode}
               </h3>
               {(data?.dressCode?.description || data?.dressCodeDescription) && (
                 <p style={{ fontSize: '0.9rem', opacity: 0.5, maxWidth: '280px', margin: '0 auto', lineHeight: 1.6 }}>
                   {typeof data.dressCode === 'object' ? data.dressCode.description : data.dressCodeDescription}
                 </p>
               )}
            </Reveal>
          </section>
        )}

        {/* RSVP */}
        <section style={{ padding: '100px 20px', backgroundColor: '#fafafa' }}>
          <Reveal>
            <h2 style={{ fontSize: '0.95rem', letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '25px', textAlign: 'center', fontWeight: 600 }}>RSVP</h2>
            {data?.rsvpDeadline && <p style={{ textAlign: 'center', fontSize: '1rem', marginBottom: '50px', opacity: 0.5, fontStyle: 'italic' }}>Please kindly respond by {data.rsvpDeadline}</p>}
            <MinimalRSVP orderId={orderId} data={data} />
          </Reveal>
        </section>


        <section style={{ padding: '60px 10px' }}>
          <Reveal>
            <h2 style={{ fontSize: '0.7rem', letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '40px', fontWeight: 600, textAlign: 'center' }}>OUR GALLERY</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {images.gallery.map((img: string, i: number) => (
              <Reveal key={i} delay={i * 100}>
                <div style={{ height: '280px', position: 'relative', borderRadius: '2px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
                  <Image src={img} alt={`Gallery ${i}`} fill style={{ objectFit: 'cover' }} />
                </div>
              </Reveal>
            ))}
          </div>
        </section>



        {/* Calendar Button */}

        <section style={{ padding: '20px 20px 100px', textAlign: 'center' }}>
          <Reveal>
            <button
              onClick={() => {
                const title = encodeURIComponent(`${data?.brideName || 'Silvia'} & ${data?.groomName || 'Massimiliano'}'s Wedding`);
                const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}`;
                window.open(url, '_blank');
              }}
              style={{
                padding: '18px 45px',
                border: '1px solid #1a1a1a',
                backgroundColor: 'transparent',
                color: '#1a1a1a',
                fontSize: '0.8rem',
                letterSpacing: '3px',
                cursor: 'pointer',
                borderRadius: '0',
                fontWeight: 600
              }}
            >
              SAVE TO CALENDAR
            </button>
          </Reveal>
        </section>

        {/* Thank You Section */}
        <section style={{ padding: '100px 40px', textAlign: 'center' }}>
          <Reveal>
            <h2 className={playfair.className} style={{ fontSize: '2.5rem', marginBottom: '25px', fontWeight: 400 }}>Thank You</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, opacity: 0.6, maxWidth: '300px', margin: '0 auto', fontStyle: 'italic' }}>
              We look forward to celebrating our special day with all of you. Your presence is our greatest gift.
            </p>
          </Reveal>
        </section>

        {/* Footer */}

        <footer style={{ padding: '80px 20px', textAlign: 'center', borderTop: '1px solid #f0f0f0', opacity: 0.3, fontSize: '0.7rem', letterSpacing: '3px', fontWeight: 600 }}>
          {data?.brideName?.toUpperCase() || 'SILVIA'} & {data?.groomName?.toUpperCase() || 'MASSIMILIANO'} • 2026
        </footer>
      </main>
    </div>
  );
}
