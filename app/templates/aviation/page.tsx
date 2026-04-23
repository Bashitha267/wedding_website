'use client';

import { useState, useEffect, useRef } from 'react';
import Reveal from '@/components/Reveal';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Cinzel, Montserrat, Playfair_Display, Alex_Brush } from 'next/font/google';
import { Plane, Calendar, Clock, MapPin, Users, Ticket, Heart, Smartphone, Music, Mail } from 'lucide-react';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700', '900'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });
const playfair = Playfair_Display({ subsets: ['latin'], style: ['italic', 'normal'], weight: ['400', '700', '900'] });
const alexBrush = Alex_Brush({ subsets: ['latin'], weight: ['400'] });

const THEME = {
  navy: '#1A2B4C',
  gold: '#C5A059',
  cream: '#FAF7F2',
  white: '#FFFFFF',
  glassBg: 'rgba(26, 43, 76, 0.75)',
  glassBorder: 'rgba(197, 160, 89, 0.4)',
  fontDisplay: cinzel.className,
  fontBody: montserrat.className,
  fontAccent: playfair.className,
  fontScript: alexBrush.className,
};

const MUSIC_URL = "https://res.cloudinary.com/dnfbik3if/video/upload/v1775201422/krasnoshchok-wedding-romantic-love-music-409293_ikekwk.mp3";
const DEFAULT_IMAGES = [
  '/wedding_hero_image_1775197041013.png',
  '/photo_2.png',
  '/photo_3.png',
  '/photo_4.png',
  '/photo_5.png'
];

// Moving Airplanes Component
const MovingAirplanes = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
    <div className="airplane-anim" style={{ position: 'absolute', top: '15%', left: '-100px', opacity: 0.4 }}>
      <Plane size={40} color={THEME.gold} style={{ transform: 'rotate(90deg)' }} />
    </div>
    <div className="airplane-anim" style={{ position: 'absolute', top: '45%', left: '-100px', opacity: 0.3, animationDelay: '8s' }}>
      <Plane size={30} color={THEME.gold} style={{ transform: 'rotate(90deg)' }} />
    </div>
    <div className="airplane-anim" style={{ position: 'absolute', top: '75%', left: '-100px', opacity: 0.5, animationDelay: '15s' }}>
      <Plane size={50} color={THEME.gold} style={{ transform: 'rotate(90deg)' }} />
    </div>
    <style jsx>{`
      @keyframes flyAcross {
        0% { transform: translateX(-100px) translateY(0); opacity: 0; }
        10% { opacity: 0.5; }
        90% { opacity: 0.5; }
        100% { transform: translateX(120vw) translateY(-50px); opacity: 0; }
      }
      .airplane-anim {
        animation: flyAcross 25s linear infinite;
      }
    `}</style>
  </div>
);

// Blending Image for Cover
const BlendingImage = ({ src, size = '100%', align = 'center' }: { src: string, size?: string, align?: 'left' | 'right' | 'center' }) => (
  <div style={{
    display: 'flex',
    justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
    width: '100%',
    margin: '30px 0'
  }}>
    <div style={{
      position: 'relative',
      width: size,
      aspectRatio: '1/1',
      maskImage: 'radial-gradient(circle, black 45%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(circle, black 45%, transparent 100%)',
      overflow: 'hidden'
    }}>
      <Image src={src} alt="Moment" fill style={{ objectFit: 'cover' }} unoptimized={src.startsWith('http')} />
    </div>
  </div>
);

// SVG Icons
const MusicIcon = ({ muted }: { muted: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {muted ? (
      <><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v10a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3c1.29 0 2.42.81 2.83 2"></path><path d="M18 13V5a2 2 0 0 0-2-2H9"></path></>
    ) : (
      <><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></>
    )}
  </svg>
);

const AviationIcon = ({ icon: Icon, label, value, sub }: { icon: any, label: string, value: string, sub?: string }) => (
  <div style={{ textAlign: 'center', flex: 1, padding: '0 5px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Icon size={24} color={THEME.gold} style={{ marginBottom: '15px' }} />
    <div className={THEME.fontDisplay} style={{ 
      fontSize: '0.65rem', 
      letterSpacing: '2px', 
      color: THEME.gold, 
      marginBottom: '10px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700
    }}>{label}</div>
    <div className={THEME.fontDisplay} style={{ 
      fontSize: '1rem', 
      color: THEME.white, 
      fontWeight: 700,
      minHeight: '45px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: '1.2'
    }}>{value}</div>
    <div className={THEME.fontBody} style={{ 
      fontSize: '0.65rem', 
      color: THEME.gold, 
      textTransform: 'uppercase', 
      marginTop: '8px', 
      fontWeight: 700,
      letterSpacing: '1px'
    }}>{sub || ' '}</div>
  </div>
);

const PlaneWindow = ({ src, size = '220px' }: { src: string, size?: string }) => {
  const imageSrc = src || DEFAULT_IMAGES[0];
  return (
    <div style={{ 
      width: size, 
      height: `calc(${size} * 1.36)`, 
      margin: '0 auto',
      position: 'relative',
      borderRadius: '110px',
      border: '10px solid #E0E0E0',
      boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 15px 40px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      backgroundColor: '#000'
    }}>
      <div style={{ position: 'absolute', inset: 0, border: '4px solid #F5F5F5', borderRadius: '100px', zIndex: 1 }}></div>
      <Image src={imageSrc} alt="Couple Photo" fill style={{ objectFit: 'cover' }} unoptimized={imageSrc.startsWith('http')} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)', zIndex: 2 }}></div>
    </div>
  );
};

const GlassSection = ({ children, padding = '40px 25px' }: { children: React.ReactNode, padding?: string }) => (
  <Reveal delay={100}>
    <div style={{ 
      padding, 
      background: THEME.glassBg, 
      backdropFilter: 'blur(20px)', 
      WebkitBackdropFilter: 'blur(20px)', 
      borderRadius: '30px', 
      border: `1px solid ${THEME.glassBorder}`, 
      margin: '30px 0', 
      textAlign: 'center', 
      color: THEME.white,
      boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
    }}>
      {children}
    </div>
  </Reveal>
);

const AviationCountdown = ({ data }: { data?: any }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const targetDate = data?.eventDate ? new Date(data.eventDate).getTime() : new Date('August 24, 2026 15:00:00').getTime();
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

  return (
    <div style={{ padding: '40px 20px', background: THEME.glassBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '30px', border: `1px solid ${THEME.glassBorder}`, margin: '40px 0', textAlign: 'center' }}>
      <div className={THEME.fontDisplay} style={{ fontSize: '0.8rem', letterSpacing: '4px', color: THEME.gold, marginBottom: '25px', fontWeight: 700 }}>FLIGHT TIME REMAINING</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hrs', value: timeLeft.hours },
          { label: 'Min', value: timeLeft.minutes },
          { label: 'Sec', value: timeLeft.seconds }
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
            <div className={THEME.fontDisplay} style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', borderBottom: `2px solid ${THEME.gold}`, paddingBottom: '5px', width: '100%', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{item.value.toString().padStart(2, '0')}</div>
            <span className={THEME.fontBody} style={{ fontSize: '0.65rem', letterSpacing: '1px', marginTop: '10px', color: THEME.gold, fontWeight: 700 }}>{item.label.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BoardingPass = ({ data, orderId }: { data: any, orderId?: string }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', adults: 1, children: 0 });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setStatus('loading');
    await supabase.from('rsvps').insert({ 
      order_id: orderId, 
      name: formData.name, 
      adult_count: formData.adults,
      children_count: formData.children 
    });
    setStatus('success');
    setFormOpen(false);
  };

  return (
    <div className="boarding-pass-container" style={{ 
      margin: '40px 0',
      background: THEME.white,
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 15px 50px rgba(0,0,0,0.4)',
      border: '1px solid #ddd',
      position: 'relative',
      color: THEME.navy
    }}>
      {/* Perforation Line */}
      <div className="perforation" style={{ position: 'absolute', left: '72%', top: 0, bottom: 0, width: '1px', borderLeft: '2px dashed #ccc', zIndex: 5 }}></div>
      
      {/* Ticket Top Branding */}
      <div style={{ background: THEME.navy, padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Plane size={20} style={{ transform: 'rotate(90deg)' }} />
          <span className={THEME.fontDisplay} style={{ fontSize: '0.8rem', letterSpacing: '3px', fontWeight: 700 }}>BOARDING PASS</span>
        </div>
        <div className={THEME.fontDisplay} style={{ fontSize: '0.7rem', letterSpacing: '2px', opacity: 0.8 }}>FIRST CLASS</div>
      </div>

      <div className="boarding-pass-flex" style={{ display: 'flex', minHeight: '320px' }}>
        {/* Left Side - Main Info & Form */}
        <div className="boarding-main" style={{ flex: '0 0 72%', padding: '30px', textAlign: 'left' }}>
          <h3 className={THEME.fontScript} style={{ fontSize: '2.8rem', color: THEME.gold, textAlign: 'center', margin: '0 0 25px' }}>We're Getting Married!</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {[
              { label: 'PASSENGERS', value: `${data?.brideName?.toUpperCase() || 'SARAH'} & ${data?.groomName?.toUpperCase() || 'MARK'}` },
              { label: 'DESTINATION', value: 'FOREVER TOGETHER' },
              { label: 'FLIGHT DATE', value: data?.eventDate || '25.08.2025' },
              { label: 'BOARDING TIME', value: data?.eventTime || '6:00 PM' }
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', borderBottom: '1px dotted #ccc', paddingBottom: '6px' }}>
                <div className={THEME.fontDisplay} style={{ width: '130px', fontSize: '0.65rem', color: THEME.gold, fontWeight: 700 }}>{item.label}</div>
                <div className={THEME.fontBody} style={{ fontSize: '0.9rem', fontWeight: 800, color: THEME.navy }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '35px', textAlign: 'center' }}>
            {!formOpen && status !== 'success' && (
              <button onClick={() => setFormOpen(true)} style={{ background: THEME.navy, color: '#fff', border: 'none', padding: '14px 40px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 900, letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(26, 43, 76, 0.3)' }}>RSVP FOR FLIGHT</button>
            )}
            {formOpen && (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '350px', margin: '0 auto' }}>
                <input type="text" placeholder="Your Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '14px', border: '2px solid #eee', borderRadius: '8px', fontSize: '1rem', color: '#000', outline: 'none' }} />
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.6rem', color: THEME.gold, fontWeight: 900, display: 'block', marginBottom: '4px' }}>ADULTS</label>
                    <input type="number" min="1" value={formData.adults} onChange={e => setFormData({...formData, adults: parseInt(e.target.value)})} style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px', fontSize: '1rem', color: '#000' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.6rem', color: THEME.gold, fontWeight: 900, display: 'block', marginBottom: '4px' }}>CHILDREN</label>
                    <input type="number" min="0" value={formData.children} onChange={e => setFormData({...formData, children: parseInt(e.target.value)})} style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px', fontSize: '1rem', color: '#000' }} />
                  </div>
                </div>

                <button type="submit" style={{ background: THEME.gold, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 900, letterSpacing: '2px', fontSize: '0.9rem', cursor: 'pointer' }}>CONFIRM FLIGHT</button>
              </form>
            )}
            {status === 'success' && <div className={THEME.fontDisplay} style={{ color: THEME.gold, fontSize: '1.2rem', fontWeight: 700 }}>WELCOME ON BOARD!</div>}
          </div>
        </div>

        {/* Right Side - Stub */}
        <div className="boarding-stub" style={{ flex: '1', padding: '25px', backgroundColor: '#fcfcfc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
          <div>
            <Heart size={28} color={THEME.navy} fill={THEME.navy} style={{ marginBottom: '10px' }} />
            <div className={THEME.fontDisplay} style={{ fontSize: '0.7rem', color: THEME.navy, fontWeight: 900, letterSpacing: '1px' }}>LOVE<br/>AIRWAYS</div>
          </div>
          
          <div style={{ width: '100%', height: '50px', background: 'linear-gradient(to right, #000 2px, transparent 2px)', backgroundSize: '8px 100%', opacity: 0.8 }}></div>
          
          <div>
            <div className={THEME.fontDisplay} style={{ fontSize: '0.6rem', color: THEME.gold, fontWeight: 700, marginBottom: '5px' }}>SEAT</div>
            <div className={THEME.fontDisplay} style={{ fontSize: '1.4rem', color: THEME.navy, fontWeight: 900, border: `2px solid ${THEME.navy}`, padding: '4px 12px', display: 'inline-block' }}>2A</div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @media (max-width: 480px) {
          .perforation { display: none; }
          .boarding-pass-flex { flex-direction: column; }
          .boarding-main { flex: 1 !important; padding: 20px !important; }
          .boarding-stub { padding: 20px !important; border-top: 2px dashed #ccc; }
        }
      `}</style>
    </div>
  );
};

const WeddingCalendar = ({ onAdd, data }: { onAdd: () => void, data?: any }) => {
  const eventDate = data?.eventDate ? new Date(data.eventDate) : new Date(2026, 7, 24);
  const year = eventDate.getFullYear();
  const month = eventDate.getMonth();
  const targetDay = eventDate.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const monthName = eventDate.toLocaleString('default', { month: 'long' }).toUpperCase();
  const daysArr = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArr = Array.from({ length: startDay }, (_, i) => i);

  return (
    <Reveal delay={200}>
      <div style={{ padding: '30px 20px', textAlign: 'center', background: THEME.glassBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '30px', border: `1px solid ${THEME.glassBorder}`, margin: '40px 0', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }}>
        <div className={THEME.fontDisplay} style={{ fontSize: '2.5rem', color: THEME.gold, marginBottom: '10px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Save the Date</div>
        <div className={THEME.fontBody} style={{ fontSize: '1.1rem', fontWeight: 900, color: THEME.white, marginBottom: '20px', letterSpacing: '3px' }}>{monthName} {year}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', maxWidth: '300px', margin: '0 auto 30px' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className={THEME.fontBody} style={{ fontSize: '0.7rem', fontWeight: 900, color: THEME.gold }}>{d}</div>)}
          {blanksArr.map(b => <div key={`b-${b}`} />)}
          {daysArr.map(d => (
            <div key={d} className={THEME.fontBody} style={{ position: 'relative', fontSize: '1.1rem', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, fontWeight: d === targetDay ? 900 : 500, color: THEME.white }}>
              {d === targetDay ? (
                <>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: -1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Heart size={40} color={THEME.gold} fill={THEME.gold} />
                  </div>
                  <span style={{ color: '#000' }}>{d}</span>
                </>
              ) : d}
            </div>
          ))}
        </div>
        <button onClick={onAdd} className={THEME.fontBody} style={{ background: THEME.gold, color: THEME.white, border: 'none', borderRadius: '30px', padding: '12px 25px', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(197, 160, 89, 0.3)' }}>ADD TO CALENDAR</button>
      </div>
    </Reveal>
  );
};

export default function AviationTheme({ data, orderId }: { data: any, orderId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const galleryRaw = data?.images?.gallery || [];
  const gallery = (galleryRaw.length > 0 ? galleryRaw : DEFAULT_IMAGES) as string[];
  const img0 = gallery[0] || DEFAULT_IMAGES[0];
  const img1 = gallery[1] || DEFAULT_IMAGES[1] || DEFAULT_IMAGES[0];
  const img2 = gallery[2] || DEFAULT_IMAGES[2] || DEFAULT_IMAGES[0];
  const img3 = gallery[3] || DEFAULT_IMAGES[3] || DEFAULT_IMAGES[0];
  const img4 = gallery[4] || DEFAULT_IMAGES[4] || DEFAULT_IMAGES[0];

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) { audio.muted = !isMuted; setIsMuted(!isMuted); }
  };

  const handleOpen = () => {
    setIsOpen(true);
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) { audio.play().catch(e => console.log("Audio play blocked:", e)); }
    if (videoRef.current) { videoRef.current.play().catch(e => console.log("Video play blocked:", e)); }
  };

  return (
    <div className={THEME.fontBody} style={{ backgroundColor: THEME.navy, minHeight: '100vh', width: '100%', overflowX: 'hidden', color: THEME.white }}>
      {/* Fixed Background - Clouds */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Image 
          src="https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2065&auto=format&fit=crop" 
          alt="Sky Background" 
          fill 
          style={{ objectFit: 'cover', opacity: 0.5 }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(26,43,76,0.8), rgba(26,43,76,0.6))' }} />
      </div>

      <MovingAirplanes />

      <audio id="bg-music" loop><source src={data?.musicUrl || MUSIC_URL} type="audio/mpeg" /></audio>

      {isOpen && (
        <button onClick={toggleMusic} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 2000, width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: `1px solid ${THEME.gold}`, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.4rem', cursor: 'pointer', color: THEME.gold, boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
          <MusicIcon muted={isMuted} />
        </button>
      )}

      {/* Cover Page / Passport Style */}
      <div style={{ width: '100%', height: '100vh', backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, zIndex: 1000, transition: 'all 1.5s cubic-bezier(0.87, 0, 0.13, 1)', transform: isOpen ? 'translateY(-100%)' : 'translateY(0)', opacity: isOpen ? 0 : 1, cursor: 'pointer', overflow: 'hidden' }} onClick={handleOpen}>
        <Image src="/wedding_hero_image_1775197041013.png" alt="Cover" fill style={{ objectFit: 'cover', opacity: 0.6 }} priority />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', textAlign: 'center', width: '100%', zIndex: 2, padding: '0 20px' }}>
          <Reveal>
            <div className={THEME.fontDisplay} style={{ fontSize: 'clamp(2.5rem, 12vw, 4rem)', color: THEME.gold, marginBottom: '20px', textShadow: '2px 2px 20px rgba(0,0,0,0.8)', letterSpacing: '4px' }}>Invitation</div>
            
            <BlendingImage src={img0} size="240px" align="center" />
            
            <h2 className={THEME.fontDisplay} style={{ fontSize: 'clamp(1.8rem, 8vw, 2.8rem)', color: THEME.white, marginBottom: '10px', textShadow: '0 4px 15px rgba(0,0,0,1)', letterSpacing: '6px', fontWeight: 700 }}>{data?.brideName || 'Sarah'} & {data?.groomName || 'Mark'}</h2>
            
            <div className={`bounce-soft ${THEME.fontBody}`} style={{ fontSize: '0.85rem', letterSpacing: '8px', fontWeight: 900, color: THEME.gold, textTransform: 'uppercase', marginTop: '40px', textShadow: '0 2px 10px rgba(0,0,0,1)' }}>TAP TO OPEN</div>
          </Reveal>
        </div>
      </div>

      {isOpen && (
        <main style={{ position: 'relative', zIndex: 1, maxWidth: '500px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Main Hero Section */}
          <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', paddingTop: '40px', paddingBottom: '80px' }}>
            <Reveal>
              <div className={THEME.fontDisplay} style={{ fontSize: '0.75rem', letterSpacing: '4px', color: THEME.gold, marginBottom: '20px', fontWeight: 700 }}>TOGETHER WITH THEIR FAMILIES</div>
              
              <h1 className={THEME.fontDisplay} style={{ fontSize: 'clamp(2.5rem, 12vw, 4rem)', color: THEME.white, lineHeight: '1.1', margin: '15px 0', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                {data?.brideName || 'Sarah'}<br />
                <span className={THEME.fontScript} style={{ fontSize: '3rem', color: THEME.gold, display: 'inline-block', margin: '10px 0' }}>&</span><br />
                {data?.groomName || 'Mark'}
              </h1>

              <div style={{ margin: '30px 0', position: 'relative' }}>
                <PlaneWindow src={img0} size="240px" />
              </div>

              <div style={{ marginTop: '20px' }}>
                <p className={THEME.fontDisplay} style={{ fontSize: '0.8rem', letterSpacing: '3px', color: THEME.gold, margin: '15px 0', fontWeight: 700 }}>INVITING YOU TO JOIN OUR</p>
                <h2 className={THEME.fontScript} style={{ fontSize: 'clamp(3.5rem, 15vw, 5rem)', color: THEME.gold, margin: '0' }}>Forever Journey</h2>
              </div>
            </Reveal>
          </section>

          {/* Intro Section */}
          <GlassSection>
            <p className={THEME.fontAccent} style={{ fontSize: '1.5rem', fontStyle: 'italic', color: THEME.gold, lineHeight: 1.6 }}>"Love is the greatest adventure of all."</p>
            <div style={{ height: '1px', width: '100px', background: THEME.gold, margin: '30px auto', opacity: 0.5 }}></div>
            <p className={THEME.fontBody} style={{ fontSize: '1.1rem', opacity: 0.95, fontWeight: 300, letterSpacing: '1px' }}>We invite you to be part of our first flight as husband and wife.</p>
          </GlassSection>

          {/* Quick Info Bar */}
          <Reveal delay={200}>
            <div style={{ display: 'flex', justifyContent: 'space-between', background: THEME.glassBg, backdropFilter: 'blur(10px)', padding: '35px 10px', borderRadius: '30px', border: `1px solid ${THEME.glassBorder}`, margin: '40px 0', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', alignItems: 'stretch' }}>
              <AviationIcon icon={Calendar} label="DATE" value={data?.eventDate || '25.08.2025'} sub="MONDAY" />
              <div style={{ width: '1px', backgroundColor: THEME.gold, opacity: 0.3, margin: '10px 0' }}></div>
              <AviationIcon icon={Clock} label="BOARDING TIME" value={data?.eventTime || '6:00 PM'} sub="ONWARDS" />
              <div style={{ width: '1px', backgroundColor: THEME.gold, opacity: 0.3, margin: '10px 0' }}></div>
              <AviationIcon icon={MapPin} label="VENUE" value={data?.location?.name || 'GRAND ROYAL'} sub={data?.location?.city || 'BALLROOM'} />
            </div>
          </Reveal>

          {/* Gallery Pattern */}
          <div style={{ margin: '50px 0' }}>
            <Reveal delay={200}>
              <PlaneWindow src={img1} size="240px" />
            </Reveal>
            <div style={{ height: '40px' }}></div>
            <Reveal delay={400}>
              <div style={{ textAlign: 'right' }}>
                <PlaneWindow src={img2} size="240px" />
              </div>
            </Reveal>
          </div>

          <AviationCountdown data={data} />

          <GlassSection>
            <h3 className={THEME.fontDisplay} style={{ fontSize: '2.5rem', color: THEME.gold, marginBottom: '30px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Flight Itinerary</h3>
            {/* Itinerary Logic similar to Homecoming but with Aviation touch */}
            <div style={{ position: 'relative', padding: '10px 0', textAlign: 'left' }}>
              <div style={{ position: 'absolute', left: '20px', top: '0', bottom: '0', width: '2px', background: `linear-gradient(to bottom, transparent, ${THEME.gold}, transparent)` }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '45px', paddingLeft: '50px' }}>
                {(data?.timeline?.length > 0 ? data.timeline : [
                  { time: '5:00 PM', title: 'CHECK-IN', location: 'Arrivals Gate' },
                  { time: '6:30 PM', title: 'DEPARTURE', location: 'Main Stage' },
                  { time: '8:30 PM', title: 'IN-FLIGHT DINING', location: 'Royal Hall' },
                  { time: '10:30 PM', title: 'CELEBRATION', location: 'Panorama Deck' }
                ]).map((event: any, i: number) => (
                  <Reveal key={i} delay={i * 100}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-42px', marginBottom: '12px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: THEME.gold, boxShadow: `0 0 15px ${THEME.gold}`, border: '2px solid white' }}></div>
                        <div className={THEME.fontBody} style={{ fontSize: '0.9rem', fontWeight: 800, color: THEME.gold, marginLeft: '25px', letterSpacing: '2px' }}>{event.time}</div>
                      </div>
                      <div className={THEME.fontDisplay} style={{ fontSize: '1.8rem', color: THEME.white, marginBottom: '5px', letterSpacing: '1px', fontWeight: 800 }}>{event.title}</div>
                      <div className={THEME.fontBody} style={{ fontSize: '0.95rem', color: THEME.white, opacity: 0.8, fontWeight: 500 }}>{event.location}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </GlassSection>

          <WeddingCalendar onAdd={() => {}} data={data} />

          <GlassSection>
             <div className={THEME.fontDisplay} style={{ fontSize: '0.85rem', letterSpacing: '5px', color: THEME.gold, marginBottom: '15px', fontWeight: 800 }}>DESTINATION</div>
             <h2 className={THEME.fontDisplay} style={{ fontSize: '2.2rem', marginBottom: '12px', color: THEME.white }}>{data?.location?.name || 'Grand Royal Ballroom'}</h2>
             <p className={THEME.fontBody} style={{ opacity: 0.9, color: THEME.white, fontWeight: 400, letterSpacing: '1px' }}>{data?.location?.address || '456 Majesty Way, Royal City'}</p>
             <div style={{ height: '280px', borderRadius: '25px', overflow: 'hidden', border: `2px solid ${THEME.gold}`, margin: '35px 0', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
               <iframe src="https://www.google.com/maps/embed?..." width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(1.2)' }}></iframe>
             </div>
             <a href="#" className={THEME.fontBody} style={{ display: 'inline-block', padding: '16px 45px', background: THEME.gold, color: THEME.white, borderRadius: '40px', fontWeight: 900, textDecoration: 'none', letterSpacing: '2px', boxShadow: '0 8px 25px rgba(197, 160, 89, 0.4)' }}>FLIGHT DIRECTIONS</a>
          </GlassSection>

          <Reveal delay={200}>
            <BoardingPass data={data} orderId={orderId} />
          </Reveal>

          <GlassSection padding="80px 25px">
            <h3 className={THEME.fontDisplay} style={{ fontSize: 'clamp(2.5rem, 12vw, 3.5rem)', color: THEME.gold, marginBottom: '20px', textShadow: '0 4px 15px rgba(0,0,0,0.4)' }}>SAFE TRAVELS</h3>
            <p className={THEME.fontBody} style={{ fontSize: '1.2rem', opacity: 0.95, marginBottom: '50px', fontWeight: 500 }}>We can't wait to see you at the gate.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', opacity: 0.8 }}>
              <Plane size={40} color={THEME.gold} />
              <Heart size={40} color={THEME.gold} fill={THEME.gold} />
            </div>
            <div style={{ marginTop: '60px', opacity: 0.6, display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '150px', height: '50px' }}>
                <Image src="/logo.png" alt="KNOT STORY" fill style={{ objectFit: 'contain' }} />
              </div>
            </div>
          </GlassSection>

          <div style={{ height: '100px' }}></div>
        </main>
      )}

      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .bounce-soft { animation: bounce 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
