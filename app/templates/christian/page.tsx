'use client';

import { useState, useEffect, useRef } from 'react';
import Reveal from '@/components/Reveal';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Cinzel, Montserrat, Playfair_Display } from 'next/font/google';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700', '900'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });
const playfair = Playfair_Display({ subsets: ['latin'], style: ['italic', 'normal'], weight: ['400', '700', '900'] });

const THEME = {
  primary: '#FFFFFF',
  secondary: '#0F2A4A', 
  accent: '#4A5568', 
  dark: '#0A1A2F',
  glassBg: 'rgba(255, 255, 255, 0.92)', 
  glassBorder: 'rgba(15, 42, 74, 0.1)',
  fontDisplay: cinzel.className,
  fontBody: montserrat.className,
  fontAccent: playfair.className,
};

const MUSIC_URL = "https://res.cloudinary.com/dnfbik3if/video/upload/v1775201422/krasnoshchok-wedding-romantic-love-music-409293_ikekwk.mp3";
const DEFAULT_IMAGES = ['/christianweddingimg.jpg', '/photo_2.png', '/photo_3.png', '/photo_4.png', '/photo_5.png'];

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

const CrossIcon = ({ size = 24, color = THEME.secondary }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2V22"></path>
    <path d="M8 7H16"></path>
  </svg>
);

const HeartIcon = ({ size = 24, color = THEME.secondary }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const BlendingImage = ({ src, size = '100%', align = 'center' }: { src: string, size?: string, align?: 'left' | 'right' | 'center' }) => (
  <div style={{
    display: 'flex',
    justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
    width: '100%',
    margin: '35px 0'
  }}>
    <div style={{
      position: 'relative',
      width: size,
      aspectRatio: '1/1',
      maskImage: 'radial-gradient(circle, black 45%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(circle, black 45%, transparent 100%)',
      overflow: 'hidden',
      borderRadius: '50%',
      border: `3px solid ${THEME.secondary}`,
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
    }}>
      <Image src={src} alt="Moment" fill style={{ objectFit: 'cover' }} unoptimized={src.startsWith('http')} />
    </div>
  </div>
);

const ChristianCountdown = ({ data }: { data?: any }) => {
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
    <div style={{ padding: '45px 20px', background: THEME.glassBg, backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', borderRadius: '35px', border: `1px solid ${THEME.glassBorder}`, margin: '45px 0', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}>
      <div className={THEME.fontDisplay} style={{ fontSize: '0.85rem', letterSpacing: '5px', color: THEME.secondary, marginBottom: '30px', fontWeight: 900 }}>THE BIG DAY IN</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hrs', value: timeLeft.hours },
          { label: 'Min', value: timeLeft.minutes },
          { label: 'Sec', value: timeLeft.seconds }
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '65px' }}>
            <div className={THEME.fontDisplay} style={{ fontSize: '2.2rem', fontWeight: 900, color: THEME.secondary, borderBottom: `3px solid ${THEME.secondary}`, paddingBottom: '8px', width: '100%' }}>{item.value.toString().padStart(2, '0')}</div>
            <span className={THEME.fontBody} style={{ fontSize: '0.7rem', letterSpacing: '2px', marginTop: '12px', color: THEME.secondary, fontWeight: 900 }}>{item.label.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChristianItinerary = ({ data }: { data?: any }) => {
  const events = data?.timeline?.length > 0 ? data.timeline : [
    { time: '10:00 AM', title: 'THE VOWS', location: 'Saint Mary\'s Church' },
    { time: '12:00 PM', title: 'RECEPTION', location: 'Grand Ballroom' },
    { time: '2:00 PM', title: 'LUNCHEON', location: 'Garden Terrace' },
    { time: '4:00 PM', title: 'SEND OFF', location: 'Church Plaza' }
  ];
  return (
    <div style={{ position: 'relative', padding: '15px 0' }}>
      <div style={{ position: 'absolute', left: '20px', top: '0', bottom: '0', width: '2px', background: `linear-gradient(to bottom, transparent, ${THEME.secondary}, transparent)` }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '45px', paddingLeft: '50px' }}>
        {events.map((event: any, i: number) => (
          <Reveal key={i} delay={i * 100}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-40px', marginBottom: '12px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: THEME.secondary, boxShadow: `0 0 20px rgba(15, 42, 74, 0.4)`, border: '2px solid white' }}></div>
                <div className={THEME.fontBody} style={{ fontSize: '0.9rem', fontWeight: 900, color: THEME.secondary, marginLeft: '22px', letterSpacing: '2px' }}>{event.time}</div>
              </div>
              <div className={THEME.fontDisplay} style={{ fontSize: '1.75rem', color: THEME.secondary, marginBottom: '6px', letterSpacing: '1px', fontWeight: 900 }}>{event.title}</div>
              <div className={THEME.fontBody} style={{ fontSize: '1rem', color: THEME.secondary, opacity: 0.9, fontWeight: 600 }}>{event.location}</div>
            </div>
          </Reveal>
        ))}
      </div>
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
      <div style={{ padding: '35px 25px', textAlign: 'center', background: THEME.glassBg, backdropFilter: 'blur(45px)', WebkitBackdropFilter: 'blur(45px)', borderRadius: '35px', border: `1px solid ${THEME.glassBorder}`, margin: '45px 0', boxShadow: '0 25px 60px rgba(0,0,0,0.1)' }}>
        <div className={THEME.fontDisplay} style={{ fontSize: '2.8rem', color: THEME.secondary, marginBottom: '12px', fontWeight: 900 }}>Save our Date</div>
        <div className={THEME.fontBody} style={{ fontSize: '1.3rem', fontWeight: 900, color: THEME.secondary, marginBottom: '25px', letterSpacing: '4px' }}>{monthName} {year}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', maxWidth: '320px', margin: '0 auto 35px' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className={THEME.fontBody} style={{ fontSize: '0.85rem', fontWeight: 900, color: THEME.secondary }}>{d}</div>)}
          {blanksArr.map(b => <div key={`b-${b}`} />)}
          {daysArr.map(d => (
            <div key={d} className={THEME.fontBody} style={{ position: 'relative', fontSize: '1.2rem', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, fontWeight: d === targetDay ? 900 : 700, color: THEME.secondary }}>
              {d === targetDay ? (
                <>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: -1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HeartIcon size={52} color={THEME.secondary} />
                  </div>
                  <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 900 }}>{d}</span>
                </>
              ) : d}
            </div>
          ))}
        </div>
        <button onClick={onAdd} className={THEME.fontBody} style={{ background: THEME.secondary, color: '#fff', border: 'none', borderRadius: '40px', padding: '18px 45px', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 12px 30px rgba(15, 42, 74, 0.4)' }}>ADD TO CALENDAR</button>
      </div>
    </Reveal>
  );
};

const GlassSection = ({ children, padding = '45px 30px' }: { children: React.ReactNode, padding?: string }) => (
  <Reveal delay={100}>
    <div style={{ padding, background: 'rgba(255, 255, 255, 0.88)', backdropFilter: 'blur(50px)', WebkitBackdropFilter: 'blur(50px)', borderRadius: '35px', border: `1px solid ${THEME.glassBorder}`, margin: '35px 0', textAlign: 'center', color: THEME.secondary, boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}>
      {children}
    </div>
  </Reveal>
);

const ChristianRSVP = ({ orderId, data }: { orderId?: string, data?: any }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', adults: 1, children: 0 });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setStatus('loading');
    await supabase.from('rsvps').insert({ order_id: orderId, name: formData.name, contact_number: formData.contact, adult_count: formData.adults, children_count: formData.children });
    setStatus('success');
    setFormOpen(false);
  };

  return (
    <div style={{ padding: '45px 25px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(50px)', WebkitBackdropFilter: 'blur(50px)', borderRadius: '35px', border: `1px solid ${THEME.glassBorder}`, textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}>
      <h3 className={THEME.fontDisplay} style={{ fontSize: 'clamp(2rem, 9vw, 2.5rem)', color: THEME.secondary, marginBottom: '30px', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 900 }}>RSVP To Bless Us</h3>
      {!formOpen && status !== 'success' && <button onClick={() => setFormOpen(true)} className={THEME.fontBody} style={{ background: THEME.secondary, color: '#fff', padding: '18px 45px', borderRadius: '40px', fontWeight: 900, border: 'none', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 12px 30px rgba(15, 42, 74, 0.4)' }}>I WILL BE THERE</button>}
      {formOpen && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '320px', margin: '0 auto' }}>
          <input type="text" placeholder="Your Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={THEME.fontBody} style={{ padding: '14px', borderRadius: '12px', border: `2px solid ${THEME.secondary}`, background: 'rgba(255,255,255,1)', color: '#000', fontWeight: 700, fontSize: '1rem' }} />
          <input type="tel" placeholder="Mobile Number" required value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} className={THEME.fontBody} style={{ padding: '14px', borderRadius: '12px', border: `2px solid ${THEME.secondary}`, background: 'rgba(255,255,255,1)', color: '#000', fontWeight: 700, fontSize: '1rem' }} />
          <div style={{ display: 'flex', gap: '18px' }}>
            <div style={{ flex: 1 }}>
              <label className={THEME.fontBody} style={{ fontSize: '0.8rem', display: 'block', textAlign: 'left', marginBottom: '6px', color: THEME.secondary, fontWeight: 900, letterSpacing: '1px' }}>ADULTS</label>
              <input type="number" min="1" value={formData.adults} onChange={e => setFormData({ ...formData, adults: parseInt(e.target.value) || 0 })} className={THEME.fontBody} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${THEME.secondary}`, background: 'rgba(255,255,255,1)', color: '#000', fontWeight: 700, fontSize: '1rem' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label className={THEME.fontBody} style={{ fontSize: '0.8rem', display: 'block', textAlign: 'left', marginBottom: '6px', color: THEME.secondary, fontWeight: 900, letterSpacing: '1px' }}>CHILDREN</label>
              <input type="number" min="0" value={formData.children} onChange={e => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })} className={THEME.fontBody} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${THEME.secondary}`, background: 'rgba(255,255,255,1)', color: '#000', fontWeight: 700, fontSize: '1rem' }} />
            </div>
          </div>
          <button type="submit" className={THEME.fontBody} style={{ background: THEME.secondary, color: '#fff', padding: '16px', borderRadius: '40px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 12px 30px rgba(15, 42, 74, 0.4)', letterSpacing: '1px' }}>CONFIRM RSVP</button>
        </form>
      )}
      {status === 'success' && <div className={THEME.fontBody} style={{ color: THEME.secondary, fontSize: '1.4rem', fontWeight: 900 }}>Thank you for your blessings!</div>}
    </div>
  );
};

export default function ChristianTemplate({ data, orderId }: { data: any, orderId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const gallery = (data?.images?.gallery?.length > 0 ? data.images.gallery : DEFAULT_IMAGES) as string[];
  const heroImage = data?.images?.heroImage || '/photo_2.png'; // Corrected default to couple photo
  const image1 = data?.images?.image1 || '/photo_3.png'; // Better default flow
  const image2 = data?.images?.image2 || gallery[2] || DEFAULT_IMAGES[2];
  const image3 = data?.images?.image3 || gallery[3] || DEFAULT_IMAGES[3];
  const thankYouImage = data?.images?.thankYouImage || gallery[4] || DEFAULT_IMAGES[4];

  return (
    <div style={{ 
      backgroundColor: '#f5f7f9', 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center'
    }}>
      <div className={THEME.fontBody} style={{ 
        backgroundColor: THEME.primary, 
        height: '100vh', 
        width: '100%', 
        maxWidth: '430px', 
        position: 'relative',
        overflow: 'hidden', 
        color: THEME.secondary,
        boxShadow: '0 0 100px rgba(0,0,0,0.1)'
      }}>
        {/* Layer 0: Static Background Video (Pinned) */}
        <video ref={videoRef} autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src="/christian_wedding.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 0 }}></div>
        <audio id="bg-music" loop><source src={data?.musicUrl || MUSIC_URL} type="audio/mpeg" /></audio>

        {/* Layer 1: Scrollable Content Wrapper */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto', zIndex: 1, scrollbarWidth: 'none' }}>
          
          {isOpen && (
            <button onClick={toggleMusic} style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 2000, width: '55px', height: '55px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 1)', border: `2px solid ${THEME.secondary}`, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', cursor: 'pointer', color: THEME.secondary, boxShadow: '0 12px 25px rgba(0,0,0,0.25)' }}>
              <MusicIcon muted={isMuted} />
            </button>
          )}

          {/* Cover Page */}
          <div style={{ width: '100%', height: '100vh', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, zIndex: 1000, transition: 'all 1.5s cubic-bezier(0.87, 0, 0.13, 1)', transform: isOpen ? 'translateY(-100%)' : 'translateY(0)', opacity: isOpen ? 0 : 1, cursor: 'pointer', overflow: 'hidden' }} onClick={handleOpen}>
            <Image src="/christianweddingimg.jpg" alt="Cover" fill style={{ objectFit: 'cover' }} priority />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%)', zIndex: 1 }} />
            <div style={{ position: 'relative', textAlign: 'center', width: '100%', zIndex: 2, padding: '0 20px' }}>
              <Reveal>
                <div style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.9))' }}>
                  <CrossIcon size={70} color="#fff" />
                </div>
                <h1 className={THEME.fontDisplay} style={{ fontSize: 'clamp(2.8rem, 11vw, 4.2rem)', color: '#fff', marginBottom: '25px', textShadow: '0 6px 35px rgba(0,0,0,1)', paddingTop: '25px', width: '100%', textAlign: 'center', letterSpacing: '10px', fontWeight: 900 }}>WEDDING</h1>
                <BlendingImage src={heroImage} size="240px" align="center" />
                <h2 className={THEME.fontDisplay} style={{ fontSize: 'clamp(2.2rem, 9vw, 3rem)', color: '#fff', marginBottom: '0', textShadow: '0 6px 30px rgba(0,0,0,1)', fontWeight: 700, letterSpacing: '3px' }}>{data?.groomName || 'Mark'} & {data?.brideName || 'Sarah'}</h2>
                <div className={`bounce-soft ${THEME.fontBody}`} style={{ fontSize: '0.9rem', letterSpacing: '12px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', marginTop: '65px', textShadow: '0 3px 20px rgba(0,0,0,1)' }}>TAP TO BLESS</div>
              </Reveal>
            </div>
          </div>

          {isOpen && (
            <main style={{ position: 'relative', zIndex: 1, width: '100%', padding: '0 20px' }}>
              <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                <Reveal>
                  <h1 className={THEME.fontDisplay} style={{ fontSize: 'clamp(3rem, 13vw, 4.5rem)', color: '#fff', textShadow: '0 6px 35px rgba(0,0,0,1)', marginBottom: '12px', width: '100%', letterSpacing: '8px', fontWeight: 900 }}>Divine Union</h1>
                  <BlendingImage src={image1} size="280px" align="center" />
                  <div className={THEME.fontBody} style={{ fontSize: '1rem', letterSpacing: '10px', color: THEME.secondary, margin: '25px 0', fontWeight: 900, textShadow: '0 2px 20px rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.7)', padding: '10px 15px', borderRadius: '12px', display: 'inline-block' }}>UNDER THE GRACE OF GOD</div>
                  <h2 className={THEME.fontDisplay} style={{ fontSize: 'clamp(2.6rem, 11vw, 3.8rem)', color: '#fff', textShadow: '0 6px 35px rgba(0,0,0,1)', letterSpacing: '5px', fontWeight: 700 }}>{data?.groomName || 'Mark'} & {data?.brideName || 'Sarah'}</h2>
                </Reveal>
              </section>

              <GlassSection>
                <p className={THEME.fontAccent} style={{ fontSize: '1.6rem', fontStyle: 'italic', color: THEME.secondary, lineHeight: 1.6, fontWeight: 700 }}>"Therefore what God has joined together, let no one separate."</p>
                <div style={{ height: '3px', width: '120px', background: THEME.secondary, margin: '35px auto', opacity: 0.9 }}></div>
                <p className={THEME.fontBody} style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '3px' }}>Matthew 19:6</p>
              </GlassSection>

              <div style={{ margin: '45px 0' }}>
                <Reveal delay={200}>
                  <BlendingImage src={image2} size="300px" align="left" />
                </Reveal>
                <Reveal delay={400}>
                  <BlendingImage src={image3} size="300px" align="right" />
                </Reveal>
              </div>

              <ChristianCountdown data={data} />

              <GlassSection>
                <h3 className={THEME.fontDisplay} style={{ fontSize: '3rem', color: THEME.secondary, marginBottom: '30px', fontWeight: 900 }}>The Ceremony</h3>
                <ChristianItinerary data={data} />
              </GlassSection>

              <Reveal delay={300}>
                <BlendingImage src={thankYouImage} size="280px" align="left" />
              </Reveal>

              <WeddingCalendar onAdd={() => { }} data={data} />

              <GlassSection>
                <div className={THEME.fontDisplay} style={{ fontSize: '0.9rem', letterSpacing: '6px', color: THEME.secondary, marginBottom: '20px', fontWeight: 900 }}>THE HOUSE OF GOD</div>
                <h2 className={THEME.fontDisplay} style={{ fontSize: '2.4rem', marginBottom: '20px', fontWeight: 900 }}>{data?.location?.name || 'Saint Mary\'s Cathedral'}</h2>

                {data?.location?.address && !data.location.address.startsWith('http') && (
                  <p className={THEME.fontBody} style={{ opacity: 1, color: THEME.secondary, marginBottom: '30px', fontWeight: 800, fontSize: '1.1rem' }}>
                    {data.location.address}
                  </p>
                )}

                <div style={{ height: '280px', borderRadius: '30px', overflow: 'hidden', border: `3px solid ${THEME.secondary}`, margin: '35px 0', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
                  <iframe src="https://www.google.com/maps/embed?..." width="100%" height="100%" style={{ border: 0 }}></iframe>
                </div>

                <a
                  href={data?.location?.address || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={THEME.fontBody}
                  style={{ display: 'inline-block', padding: '18px 50px', background: THEME.secondary, color: '#fff', borderRadius: '45px', fontWeight: 900, textDecoration: 'none', letterSpacing: '2px', boxShadow: '0 12px 35px rgba(15, 42, 74, 0.4)' }}
                >
                  MAP TO CHURCH
                </a>
              </GlassSection>

              <GlassSection padding="80px 25px">
                <h3 className={THEME.fontDisplay} style={{ fontSize: 'clamp(2.4rem, 11vw, 3.5rem)', color: THEME.secondary, marginBottom: '30px', fontWeight: 900 }}>With Blessings</h3>
                <p className={THEME.fontBody} style={{ fontSize: '1.35rem', opacity: 1, marginBottom: '50px', fontWeight: 800 }}>For being part of our sacred day.</p>
                <ChristianRSVP orderId={orderId} data={data} />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '70px' }}>
                  <div style={{ filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.4))' }}>
                    <CrossIcon size={55} color={THEME.secondary} />
                  </div>
                </div>
              </GlassSection>

              <div style={{ height: '140px' }}></div>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}
