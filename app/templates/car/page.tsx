'use client';

import { useState, useEffect } from 'react';
import Reveal from '@/components/Reveal';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Alex_Brush, Cormorant_Garamond, Montserrat } from 'next/font/google';
import { Calendar, Clock, MapPin, Car, Heart, Music, Camera, Disc } from 'lucide-react';

const alexBrush = Alex_Brush({ weight: '400', subsets: ['latin'] });
const cormorant = Cormorant_Garamond({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '600'] });

// Music Icon
const MusicIcon = ({ muted }: { muted: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
    {muted && <line x1="1" y1="1" x2="23" y2="23" />}
  </svg>
);

// Custom Countdown
const CarCountdown = ({ data }: { data?: any }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Default to a future date in 2026 if no date is provided
    const targetDate = data?.eventDate ? new Date(data.eventDate).getTime() : new Date('September 20, 2026 18:00:00').getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance <= 0) { 
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer); 
        return; 
      }
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
    { label: 'MINS', value: timeLeft.minutes },
    { label: 'SECS', value: timeLeft.seconds }
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
      {items.map(item => (
        <div key={item.label} style={{ textAlign: 'center', backgroundColor: '#fff', padding: '12px 8px', borderRadius: '5px', minWidth: '70px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #f8f8f8' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c14d4d', lineHeight: 1.2 }}>{item.value.toString().padStart(2, '0')}</div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '1px', opacity: 0.5, fontWeight: 800, marginTop: '2px' }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

// Custom Timeline
const CarTimeline = ({ data }: { data?: any }) => {
  const events = data?.timeline?.length > 0 ? data.timeline : [
    { time: '17:00', title: 'The Grand Entrance', icon: <Car size={16} /> },
    { time: '18:00', title: 'Wedding Vows', icon: <Heart size={16} /> },
    { time: '19:30', title: 'Dinner Reception', icon: <Music size={16} /> },
    { time: '21:00', title: 'Party Starts', icon: <Camera size={16} /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', maxWidth: '320px', margin: '0 auto', position: 'relative' }}>
      <div style={{ position: 'absolute', left: '74px', top: '10px', bottom: '10px', width: '2px', backgroundColor: '#f0f0f0' }}></div>
      {events.map((event: any, i: number) => (
        <Reveal key={i} delay={i * 100}>
          <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, opacity: 0.4, minWidth: '60px', textAlign: 'right' }}>{event.time}</div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fff', border: '2px solid #c14d4d', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#c14d4d', zIndex: 2 }}>
              {event.icon}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#222' }}>{event.title}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

// Custom RSVP component
const CarRSVP = ({ orderId, data }: { orderId?: string, data?: any }) => {
  const [formData, setFormData] = useState({ name: '', contact: '', adults: 1, children: 0 });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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

    if (error) setStatus('error');
    else setStatus('success');
  };

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <Heart size={40} color="#c14d4d" style={{ marginBottom: '15px' }} />
        <h3 className={cormorant.className} style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Thank You!</h3>
        <p style={{ opacity: 0.7 }}>We have received your RSVP.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <input
        type="text"
        placeholder="Full Name"
        required
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', outline: 'none', fontFamily: 'inherit', backgroundColor: '#fff' }}
      />
      <input
        type="tel"
        placeholder="Contact Number"
        required
        value={formData.contact}
        onChange={e => setFormData({ ...formData, contact: e.target.value })}
        style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', outline: 'none', fontFamily: 'inherit', backgroundColor: '#fff' }}
      />
      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '5px', fontWeight: 700 }}>ADULTS</label>
          <input
            type="number"
            min="1"
            value={formData.adults}
            onChange={e => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
            style={{ width: '100%', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none', fontFamily: 'inherit', backgroundColor: '#fff' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '5px', fontWeight: 700 }}>CHILDREN</label>
          <input
            type="number"
            min="0"
            value={formData.children}
            onChange={e => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
            style={{ width: '100%', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none', fontFamily: 'inherit', backgroundColor: '#fff' }}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          padding: '20px',
          backgroundColor: '#c14d4d',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          letterSpacing: '3px',
          cursor: 'pointer',
          fontWeight: 700,
          transition: 'all 0.3s',
          fontFamily: 'inherit',
          boxShadow: '0 10px 20px rgba(193, 77, 77, 0.2)'
        }}
      >
        {status === 'loading' ? 'SUBMITTING...' : 'CONFIRM ATTENDANCE'}
      </button>
    </form>
  );
};

export default function CarTemplate({ data, orderId }: { data: any, orderId?: string }) {
  const [muted, setMuted] = useState(false);
  const audioUrl = data?.musicUrl || "https://res.cloudinary.com/dnfbik3if/video/upload/v1775201422/krasnoshchok-wedding-romantic-love-music-409293_ikekwk.mp3";

  return (
    <div className={cormorant.className} style={{ 
      backgroundColor: '#f5f1ea', 
      color: '#333', 
      minHeight: '100vh', 
      overflowX: 'hidden',
      backgroundImage: 'url("/templates/car/couple-bg.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '40px 0'
    }}>
      <audio id="bg-music" loop autoPlay muted={muted}>
        <source src={audioUrl} type="audio/mpeg" />
      </audio>

      {/* Floating Music Toggle */}
      <button 
        onClick={() => {
          const audio = document.getElementById('bg-music') as HTMLAudioElement;
          if (audio && audio.paused) audio.play().catch(() => {});
          setMuted(!muted);
        }}
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
      <main style={{ 
        maxWidth: '450px', 
        margin: '0 auto', 
        backgroundColor: '#fff', 
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/parchment.png")',
        boxShadow: '0 40px 100px rgba(0,0,0,0.3)', 
        position: 'relative', 
        borderRadius: '15px', 
        overflow: 'hidden',
        border: '8px double #eee'
      }}>
        
        {/* Top Header */}
        <section style={{ 
          padding: '25px 30px 40px', 
          textAlign: 'center', 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <Reveal>
            <p style={{ fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '20px', fontWeight: 600 }}>
              TOGETHER WITH THEIR FAMILIES
            </p>
            
            {/* Names */}
            <div style={{ position: 'relative', margin: '20px 0' }}>
              <h1 className={alexBrush.className} style={{ fontSize: '3rem', margin: 0, color: '#1a1a1a', lineHeight: 0.9 }}>
                {data?.brideName || 'Naveen'}
              </h1>
              <div style={{ position: 'relative', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5px 0' }}>
                <span className={alexBrush.className} style={{ fontSize: '1.8rem', color: '#c14d4d', position: 'absolute', zIndex: 2 }}>&</span>
                <div style={{ width: '100%', height: '1px', backgroundColor: '#f0f0f0', maxWidth: '100px' }}></div>
              </div>
              <h1 className={alexBrush.className} style={{ fontSize: '3rem', margin: 0, color: '#1a1a1a', lineHeight: 0.9 }}>
                {data?.groomName || 'Tharushi'}
              </h1>
            </div>

            {/* Stamp Element */}
            <div style={{ 
              position: 'absolute', 
              top: '30px', 
              right: '15px', 
              width: '80px', 
              height: '80px', 
              border: '1.5px dashed #ccc', 
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              transform: 'rotate(15deg)',
              opacity: 0.5,
              padding: '5px',
              textAlign: 'center',
              backgroundColor: 'rgba(255,255,255,0.5)'
            }}>
              <div style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '1px', color: '#777' }}>TWO HEARTS</div>
              <Heart size={10} fill="#c14d4d" color="#c14d4d" />
              <div style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '1px', margin: '2px 0', color: '#777' }}>ONE JOURNEY</div>
              {/* Stamp wavy lines */}
              <div style={{ position: 'absolute', right: '-20px', top: '25px', width: '35px', height: '1px', backgroundColor: '#ccc', boxShadow: '0 6px 0 #ccc, 0 12px 0 #ccc' }}></div>
            </div>

            <p style={{ fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6, marginTop: '30px', fontWeight: 500 }}>
              INVITE YOU TO CELEBRATE THE BEGINNING OF THEIR
            </p>
            <h2 className={alexBrush.className} style={{ fontSize: '2.5rem', margin: '5px 0 25px', color: '#c14d4d' }}>Forever Journey</h2>
            
            <div style={{ transform: 'scale(0.9)', marginTop: '10px' }}>
              <CarCountdown data={data} />
            </div>
          </Reveal>
        </section>

        {/* Hero Image Section */}
        <Reveal>
          <div style={{ width: '100%', height: '400px', position: 'relative' }}>
            <Image 
              src={data?.images?.heroImage || '/templates/car/hero.png'} 
              alt="Wedding Hero" 
              fill 
              style={{ objectFit: 'cover' }} 
            />
            
            {/* Signpost Overlay */}
            <div style={{ position: 'absolute', bottom: '30px', right: '15px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              {[
                { text: 'WE MET', icon: <Heart size={10} fill="currentColor" /> },
                { text: 'WE TALKED', icon: <div style={{ fontSize: '10px' }}>💬</div> },
                { text: 'WE FELL IN LOVE', icon: <Heart size={10} /> },
                { text: 'FOREVER STARTS NOW...', icon: <Heart size={10} fill="currentColor" /> }
              ].map((sign, i) => (
                <div key={i} style={{ 
                  backgroundColor: 'rgba(44, 33, 21, 0.95)', 
                  color: '#fff', 
                  padding: '8px 15px', 
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.65rem',
                  letterSpacing: '1px',
                  boxShadow: '5px 5px 10px rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  minWidth: '150px',
                  justifyContent: 'space-between',
                  transform: `rotate(${i % 2 === 0 ? '-1.5deg' : '1.5deg'})`,
                  position: 'relative',
                  fontWeight: 700
                }}>
                  {sign.text}
                  {sign.icon}
                </div>
              ))}
              {/* Post vertical line */}
              <div style={{ position: 'absolute', right: '12px', top: '0', bottom: '-20px', width: '8px', backgroundColor: 'rgba(44, 33, 21, 0.95)', zIndex: -1, borderRadius: '2px' }}></div>
            </div>

          </div>
        </Reveal>

        {/* Date/Venue Block */}
        <section style={{ padding: '40px 30px 40px' }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '45px 0' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <Calendar size={24} color="#c14d4d" style={{ marginBottom: '15px' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2.5px', marginBottom: '12px', opacity: 0.8 }}>DATE</div>
                <div style={{ fontSize: '1rem', lineHeight: 1.4, fontWeight: 600 }}>
                  {data?.eventDate ? new Date(data.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '20th SEPT 2026'}
                  <br />
                  <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{data?.eventDate ? new Date(data.eventDate).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase() : 'SUNDAY'}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100px', padding: '0 20px' }}>
                <div style={{ width: '1px', flex: 1, backgroundColor: '#f0f0f0' }}></div>
                <Car size={14} color="#c14d4d" style={{ margin: '10px 0', opacity: 0.5 }} />
                <div style={{ width: '1px', flex: 1, backgroundColor: '#f0f0f0' }}></div>
              </div>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <MapPin size={24} color="#c14d4d" style={{ marginBottom: '15px' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2.5px', marginBottom: '12px', opacity: 0.8 }}>VENUE</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#c14d4d' }}>{data?.location?.name?.toUpperCase() || 'GRAND ROYAL'}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.5 }}>{data?.location?.city?.toUpperCase() || 'COLOMBO'}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '40px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#f0f0f0' }}></div>
              <Car size={20} color="#c14d4d" style={{ opacity: 0.4 }} />
              <div style={{ flex: 1, height: '1px', backgroundColor: '#f0f0f0' }}></div>
            </div>
            
            <p style={{ textAlign: 'center', fontSize: '0.85rem', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.6, marginTop: '25px', fontWeight: 600 }}>
              YOUR PRESENCE WILL MAKE OUR DAY EVEN MORE SPECIAL
            </p>
          </Reveal>
        </section>


        {/* Dynamic Image Gallery */}
        <section style={{ padding: '0 20px 80px' }}>
          <Reveal>
            <h3 style={{ fontSize: '0.9rem', letterSpacing: '5px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '40px', fontWeight: 700, textAlign: 'center' }}>OUR MOMENTS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ position: 'relative', height: '280px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                <Image src={data?.images?.image1 || '/photo_2.png'} alt="Moment 1" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ position: 'relative', height: '132px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                  <Image src={data?.images?.image2 || '/photo_3.png'} alt="Moment 2" fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'relative', height: '132px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                  <Image src={data?.images?.image3 || '/photo_4.png'} alt="Moment 3" fill style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </Reveal>
        </section>



        {/* Timeline Section */}
        <section style={{ padding: '100px 20px' }}>
          <Reveal>
            <h3 style={{ fontSize: '0.9rem', letterSpacing: '5px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '60px', fontWeight: 800, textAlign: 'center' }}>WEDDING TIMELINE</h3>
            <CarTimeline data={data} />
          </Reveal>
        </section>

        {/* Calendar Button */}
        <section style={{ padding: '40px 20px 100px', textAlign: 'center' }}>
          <Reveal>
            <button
              onClick={() => {
                const title = encodeURIComponent(`${data?.brideName || 'Naveen'} & ${data?.groomName || 'Tharushi'}'s Wedding`);
                const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}`;
                window.open(url, '_blank');
              }}
              style={{
                padding: '22px 55px',
                border: '2px solid #c14d4d',
                backgroundColor: 'transparent',
                color: '#c14d4d',
                fontSize: '0.9rem',
                letterSpacing: '4px',
                cursor: 'pointer',
                borderRadius: '50px',
                fontWeight: 800,
                fontFamily: 'inherit',
                transition: 'all 0.3s'
              }}
            >
              SAVE TO CALENDAR
            </button>
          </Reveal>
        </section>

        {/* Special Note Section */}
        <section style={{ padding: '60px 40px', textAlign: 'center' }}>
          <Reveal>
            <div style={{ marginBottom: '30px' }}>
              <Heart size={20} fill="#c14d4d" color="#c14d4d" style={{ opacity: 0.3 }} />
            </div>
            <p className={alexBrush.className} style={{ fontSize: '2.2rem', color: '#c14d4d', margin: '0 0 15px' }}>
              A Special Note
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.7, fontStyle: 'italic', maxWidth: '320px', margin: '0 auto' }}>
              "Life is a journey, and love is what makes that journey worthwhile. We can't wait to celebrate the start of our new adventure with you."
            </p>
            
            {/* Announcements */}
            {data?.announcements && (
              <div style={{ marginTop: '50px', paddingTop: '40px', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ color: '#c14d4d', marginBottom: '15px' }}>
                  <Disc size={20} />
                </div>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.7, fontStyle: 'italic', maxWidth: '320px', margin: '0 auto' }}>
                  "{data.announcements}"
                </p>
              </div>
            )}

            {/* Dress Code */}
            {(data?.dressCode?.title || (typeof data?.dressCode === 'string' && data.dressCode)) && (
              <div style={{ marginTop: '50px', paddingTop: '40px', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                  {data?.dressCode?.icon || data?.dressCodeEmoji || '🤵‍♂️  👰‍♀️'}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '4px', opacity: 0.5, marginBottom: '15px' }}>DRESS CODE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a1a', letterSpacing: '1px' }}>
                  {typeof data.dressCode === 'object' ? data.dressCode.title : data.dressCode}
                </div>
                {(data?.dressCode?.description || data?.dressCodeDescription) && (
                  <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '8px' }}>
                    {typeof data.dressCode === 'object' ? data.dressCode.description : data.dressCodeDescription}
                  </p>
                )}
              </div>
            )}
          </Reveal>
        </section>

        {/* RSVP Section */}
        <section style={{ padding: '100px 40px', backgroundColor: '#fcfaf7', borderTop: '1px solid #f0f0f0' }}>
          <Reveal>
            <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '15px', letterSpacing: '3px', color: '#1a1a1a', fontWeight: 400 }} className={alexBrush.className}>Kindly RSVP</h2>
            <p style={{ textAlign: 'center', fontSize: '1rem', opacity: 0.5, marginBottom: '50px', fontStyle: 'italic' }}>We would love to have you with us as we start our journey</p>
            <CarRSVP orderId={orderId} data={data} />
          </Reveal>
        </section>

        {/* Beautiful Thank You Note */}
        <footer style={{ padding: '80px 40px 60px', textAlign: 'center', borderTop: '1px solid #f0f0f0', backgroundColor: '#fff', position: 'relative' }}>
          <Reveal>
            <h3 className={alexBrush.className} style={{ fontSize: '2.8rem', color: '#c14d4d', margin: '0 0 10px', lineHeight: 1.2 }}>
              Thank You
            </h3>
            <p style={{ fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.5, fontWeight: 700, marginBottom: '30px' }}>
              FOR BEING PART OF OUR JOURNEY
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', opacity: 0.3 }}>
              <Heart size={14} fill="#c14d4d" color="#c14d4d" />
            </div>

            <div style={{ fontSize: '0.75rem', opacity: 0.4, letterSpacing: '4px', fontWeight: 800 }}>
              © 2026 {data?.brideName?.toUpperCase() || 'NAVEEN'} & {data?.groomName?.toUpperCase() || 'THARUSHI'}
            </div>
          </Reveal>
        </footer>
      </main>
    </div>
  );
}
