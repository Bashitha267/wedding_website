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
  gold: '#D4AF37',
  goldLight: '#F1E5AC',
  cream: '#FAF7F2',
  dark: '#FFFFFF',
  glassBg: 'rgba(255, 255, 255, 0.2)',
  glassBorder: 'rgba(255, 255, 255, 0.4)',
  fontDisplay: cinzel.className,
  fontBody: montserrat.className,
  fontAccent: playfair.className,
};

const MUSIC_URL = "https://res.cloudinary.com/dnfbik3if/video/upload/v1775201422/krasnoshchok-wedding-romantic-love-music-409293_ikekwk.mp3";
const DEFAULT_IMAGES = [
  '/wedding_hero_image_1775197041013.png',
  '/photo_2.png',
  '/photo_3.png',
  '/photo_4.png',
  '/photo_5.png'
];

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

const HeartIcon = ({ size = 24, color = THEME.gold }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

// Blending Image
const BlendingImage = ({ src, size = '100%', align = 'center' }: { src: string, size?: string, align?: 'left' | 'right' | 'center' }) => {
  const imageSrc = src || DEFAULT_IMAGES[0];
  return (
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
        maskImage: 'radial-gradient(circle, black 65%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(circle, black 65%, transparent 100%)',
        overflow: 'hidden',
        border: `2px solid ${THEME.gold}`,
        borderRadius: '50%',
        boxShadow: '0 0 30px rgba(0,0,0,0.3)'
      }}>
        <Image src={imageSrc} alt="Moment" fill style={{ objectFit: 'cover' }} unoptimized={imageSrc.startsWith('http')} />
      </div>
    </div>
  );
};

const WeddingCountdown = ({ data }: { data?: any }) => {
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
    <div style={{ padding: '40px 20px', background: THEME.glassBg, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: '30px', border: `1px solid ${THEME.glassBorder}`, margin: '40px 0', textAlign: 'center' }}>
      <div className={THEME.fontDisplay} style={{ fontSize: '0.8rem', letterSpacing: '4px', color: THEME.gold, marginBottom: '25px', fontWeight: 700 }}>COUNTDOWN</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hrs', value: timeLeft.hours },
          { label: 'Min', value: timeLeft.minutes },
          { label: 'Sec', value: timeLeft.seconds }
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
            <div className={THEME.fontDisplay} style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', borderBottom: `2px solid ${THEME.gold}`, paddingBottom: '5px', width: '100%', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{item.value.toString().padStart(2, '0')}</div>
            <span className={THEME.fontBody} style={{ fontSize: '0.65rem', letterSpacing: '1px', marginTop: '10px', color: THEME.gold, fontWeight: 900, textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}>{item.label.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const WeddingItinerary = ({ data }: { data?: any }) => {
  const events = data?.timeline?.length > 0 ? data.timeline : [
    { time: '4:00 PM', title: 'CEREMONY', location: 'Grand Tent' },
    { time: '5:30 PM', title: 'COCKTAILS', location: 'Garden Lounge' },
    { time: '7:00 PM', title: 'DINNER', location: 'Royal Pavilion' },
    { time: '9:00 PM', title: 'CELEBRATION', location: 'Main Stage' }
  ];
  return (
    <div style={{ position: 'relative', padding: '10px 0' }}>
      <div style={{ position: 'absolute', left: '20px', top: '0', bottom: '0', width: '1px', background: `linear-gradient(to bottom, transparent, ${THEME.gold}, transparent)` }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingLeft: '45px' }}>
        {events.map((event: any, i: number) => (
          <Reveal key={i} delay={i * 100}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-37px', marginBottom: '10px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: THEME.gold, boxShadow: `0 0 15px ${THEME.gold}`, border: '1px solid white' }}></div>
                <div className={THEME.fontBody} style={{ fontSize: '0.85rem', fontWeight: 700, color: THEME.gold, marginLeft: '20px', letterSpacing: '2px' }}>{event.time}</div>
              </div>
              <div className={THEME.fontDisplay} style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '4px', letterSpacing: '1px', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{event.title}</div>
              <div className={THEME.fontBody} style={{ fontSize: '0.95rem', color: '#fff', opacity: 0.9, fontWeight: 500, textShadow: '0 1px 5px rgba(0,0,0,0.2)' }}>{event.location}</div>
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
      <div style={{ padding: '30px 20px', textAlign: 'center', background: THEME.glassBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '30px', border: `1px solid ${THEME.glassBorder}`, margin: '40px 0', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }}>
        <div className={THEME.fontDisplay} style={{ fontSize: '2.5rem', color: THEME.gold, marginBottom: '10px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Save the Date</div>
        <div className={THEME.fontBody} style={{ fontSize: '1.1rem', fontWeight: 900, color: THEME.goldLight, marginBottom: '20px', letterSpacing: '3px', textShadow: '0 1px 5px rgba(0,0,0,0.2)' }}>{monthName} {year}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', maxWidth: '300px', margin: '0 auto 30px' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className={THEME.fontBody} style={{ fontSize: '0.7rem', fontWeight: 900, color: THEME.gold }}>{d}</div>)}
          {blanksArr.map(b => <div key={`b-${b}`} />)}
          {daysArr.map(d => (
            <div key={d} className={THEME.fontBody} style={{ position: 'relative', fontSize: '1.1rem', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, fontWeight: d === targetDay ? 900 : 500, color: THEME.dark }}>
              {d === targetDay ? (
                <>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: -1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HeartIcon size={40} color={THEME.goldLight} />
                  </div>
                  <span style={{ color: '#000' }}>{d}</span>
                </>
              ) : d}
            </div>
          ))}
        </div>
        <button onClick={onAdd} className={THEME.fontBody} style={{ background: THEME.gold, color: '#fff', border: 'none', borderRadius: '30px', padding: '12px 25px', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(197, 160, 89, 0.3)' }}>ADD TO CALENDAR</button>
      </div>
    </Reveal>
  );
};

const GlassSection = ({ children, padding = '40px 25px' }: { children: React.ReactNode, padding?: string }) => (
  <Reveal delay={100}>
    <div style={{ padding, background: THEME.glassBg, backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', borderRadius: '30px', border: `1px solid ${THEME.glassBorder}`, margin: '30px 0', textAlign: 'center', color: THEME.dark }}>
      {children}
    </div>
  </Reveal>
);

const WeddingRSVP = ({ orderId, data }: { orderId?: string, data?: any }) => {
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
    <div style={{ padding: '20px 0', textAlign: 'center' }}>
      <h3 className={THEME.fontDisplay} style={{ fontSize: '2.5rem', color: THEME.gold, marginBottom: '30px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Will You Join Us?</h3>
      {!formOpen && status !== 'success' && <button onClick={() => setFormOpen(true)} className={THEME.fontBody} style={{ background: THEME.gold, color: '#fff', padding: '16px 40px', borderRadius: '30px', fontWeight: 900, border: 'none', letterSpacing: '1px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(197, 160, 89, 0.3)' }}>RSVP NOW</button>}
      {formOpen && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto' }}>
          <input type="text" placeholder="Your Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={THEME.fontBody} style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${THEME.gold}`, background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
          <input type="tel" placeholder="Contact Number" required value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} className={THEME.fontBody} style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${THEME.gold}`, background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label className={THEME.fontBody} style={{ fontSize: '0.7rem', display: 'block', textAlign: 'left', marginBottom: '5px', color: THEME.gold, fontWeight: 700, letterSpacing: '1px' }}>ADULTS</label>
              <input type="number" min="1" value={formData.adults} onChange={e => setFormData({ ...formData, adults: parseInt(e.target.value) })} className={THEME.fontBody} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${THEME.gold}`, background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label className={THEME.fontBody} style={{ fontSize: '0.7rem', display: 'block', textAlign: 'left', marginBottom: '5px', color: THEME.gold, fontWeight: 700, letterSpacing: '1px' }}>CHILDREN</label>
              <input type="number" min="0" value={formData.children} onChange={e => setFormData({ ...formData, children: parseInt(e.target.value) })} className={THEME.fontBody} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${THEME.gold}`, background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
            </div>
          </div>
          <button type="submit" className={THEME.fontBody} style={{ background: THEME.gold, color: '#fff', padding: '12px', borderRadius: '30px', fontWeight: 900, cursor: 'pointer' }}>CONFIRM</button>
        </form>
      )}
      {status === 'success' && <div className={THEME.fontBody} style={{ color: THEME.gold, fontSize: '1.2rem', fontWeight: 700 }}>We look forward to seeing you!</div>}
    </div>
  );
};

export default function WeddingWalkTemplate({ data, orderId }: { data: any, orderId?: string }) {
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

  const galleryRaw = data?.images?.gallery || [];
  const gallery = (galleryRaw.length > 0 ? galleryRaw : DEFAULT_IMAGES) as string[];
  const img0 = gallery[0] || DEFAULT_IMAGES[0];
  const img1 = gallery[1] || DEFAULT_IMAGES[1] || DEFAULT_IMAGES[0];
  const img2 = gallery[2] || DEFAULT_IMAGES[2] || DEFAULT_IMAGES[0];
  const img3 = gallery[3] || DEFAULT_IMAGES[3] || DEFAULT_IMAGES[0];
  const img4 = gallery[4] || DEFAULT_IMAGES[4] || DEFAULT_IMAGES[0];

  return (
    <div style={{ 
      backgroundColor: '#FAF7F2', 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center'
    }}>
      <div className={THEME.fontBody} style={{ 
        backgroundColor: THEME.cream, 
        height: '100vh', 
        width: '100%', 
        maxWidth: '430px', 
        position: 'relative',
        overflow: 'hidden', 
        color: THEME.dark,
        boxShadow: '0 0 100px rgba(0,0,0,0.1)'
      }}>
        {/* Layer 0: Static Background Video (Pinned) */}
        <video ref={videoRef} autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src="/weddingwalk.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 0 }}></div>
        <audio id="bg-music" loop><source src={data?.musicUrl || MUSIC_URL} type="audio/mpeg" /></audio>

        {/* Layer 1: Scrollable Content Wrapper */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto', zIndex: 1, scrollbarWidth: 'none' }}>
          
          {isOpen && (
            <button onClick={toggleMusic} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 2000, width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: `1px solid ${THEME.gold}`, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.4rem', cursor: 'pointer', color: THEME.gold, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <MusicIcon muted={isMuted} />
            </button>
          )}

          {/* Cover Page */}
          <div style={{ width: '100%', height: '100vh', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, zIndex: 1000, transition: 'all 1.5s cubic-bezier(0.87, 0, 0.13, 1)', transform: isOpen ? 'translateY(-100%)' : 'translateY(0)', opacity: isOpen ? 0 : 1, cursor: 'pointer', overflow: 'hidden' }} onClick={handleOpen}>
            <Image src="/weddingwalk.jpg" alt="Cover" fill style={{ objectFit: 'cover' }} priority />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)', zIndex: 1 }} />
            <div style={{ position: 'relative', textAlign: 'center', width: '100%', zIndex: 2, padding: '0 20px' }}>
              <Reveal>
                <h1 className={THEME.fontDisplay} style={{ fontSize: 'clamp(2.5rem, 10vw, 3.8rem)', color: '#fff', marginBottom: '20px', letterSpacing: '8px', textShadow: '0 10px 30px rgba(0,0,0,0.8)', paddingTop: '40px', width: '100%', textAlign: 'center', fontWeight: 900 }}>WEDDING</h1>
                <div style={{ transform: 'scale(1.1)', margin: '40px 0' }}>
                  <BlendingImage src={img0} size="260px" align="center" />
                </div>
                <h2 className={THEME.fontDisplay} style={{ fontSize: 'clamp(1.8rem, 8vw, 2.8rem)', color: THEME.gold, marginBottom: '0', textShadow: '0 4px 15px rgba(0,0,0,1)', letterSpacing: '6px', fontWeight: 700 }}>{data?.groomName || 'Mark'} & {data?.brideName || 'Sarah'}</h2>
                <div className={`bounce-soft ${THEME.fontBody}`} style={{ fontSize: '0.8rem', letterSpacing: '8px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', marginTop: '60px', textShadow: '0 2px 10px rgba(0,0,0,1)' }}>TAP TO OPEN</div>
              </Reveal>
            </div>
          </div>

          {isOpen && (
            <main style={{ position: 'relative', zIndex: 1, width: '100%', padding: '0 20px' }}>
              <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '40px 0' }}>
                <Reveal>
                  <div style={{ background: THEME.glassBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '50px 20px', borderRadius: '40px', border: `1px solid ${THEME.glassBorder}`, boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                    <h1 className={THEME.fontDisplay} style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', color: THEME.dark, marginBottom: '10px', textShadow: '0 4px 15px rgba(0,0,0,0.5)', letterSpacing: '6px' }}>THE WEDDING</h1>
                    <BlendingImage src={img1} size="240px" align="center" />
                    <div className={THEME.fontBody} style={{ fontSize: 'clamp(0.75rem, 3vw, 0.9rem)', letterSpacing: '6px', color: THEME.gold, margin: '20px 0', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>WE ARE GETTING MARRIED</div>
                    <h2 className={THEME.fontDisplay} style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', color: THEME.dark, textShadow: '0 4px 15px rgba(0,0,0,0.5)', letterSpacing: '4px' }}>{data?.groomName || 'Mark'} & {data?.brideName || 'Sarah'}</h2>
                  </div>
                </Reveal>
              </section>

              <GlassSection>
                <p className={THEME.fontAccent} style={{ fontSize: '1.4rem', fontStyle: 'italic', color: THEME.gold, lineHeight: 1.6 }}>"Love is composed of a single soul inhabiting two bodies."</p>
                <div style={{ height: '1px', width: '80px', background: THEME.gold, margin: '25px auto', opacity: 0.5 }}></div>
                <p className={THEME.fontBody} style={{ fontSize: '1.1rem', opacity: 0.9, fontWeight: 300 }}>We invite you to share in our joy as we begin our forever.</p>
              </GlassSection>

              <div style={{ margin: '40px 0' }}>
                <Reveal delay={200}>
                  <BlendingImage src={img2} size="300px" align="left" />
                </Reveal>
                <Reveal delay={400}>
                  <BlendingImage src={img3} size="300px" align="right" />
                </Reveal>
              </div>

              <WeddingCountdown data={data} />

              <GlassSection>
                <h3 className={THEME.fontDisplay} style={{ fontSize: '2.5rem', color: THEME.gold, marginBottom: '25px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>The Schedule</h3>
                <WeddingItinerary data={data} />
              </GlassSection>

              <Reveal delay={300}>
                <BlendingImage src={img4} size="280px" align="left" />
              </Reveal>

              <WeddingCalendar onAdd={() => { }} data={data} />

              <GlassSection>
                <div className={THEME.fontDisplay} style={{ fontSize: '0.8rem', letterSpacing: '4px', color: THEME.gold, marginBottom: '15px', fontWeight: 900, textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}>THE VENUE</div>
                <h2 className={THEME.fontDisplay} style={{ fontSize: '2rem', marginBottom: '10px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{data?.location?.name || 'Grand Pavilion'}</h2>
                <p className={THEME.fontBody} style={{ opacity: 0.95, color: '#fff', fontWeight: 500, textShadow: '0 1px 5px rgba(0,0,0,0.2)' }}>{data?.location?.address || '123 Dream Garden, Floral City'}</p>
                <div style={{ height: '250px', borderRadius: '20px', overflow: 'hidden', border: `1px solid ${THEME.goldLight}`, margin: '30px 0' }}>
                  <iframe src="https://www.google.com/maps/embed?..." width="100%" height="100%" style={{ border: 0 }}></iframe>
                </div>
                <a href="#" className={THEME.fontBody} style={{ display: 'inline-block', padding: '15px 40px', background: THEME.gold, color: '#fff', borderRadius: '40px', fontWeight: 900, textDecoration: 'none', letterSpacing: '1px', boxShadow: '0 4px 15px rgba(197, 160, 89, 0.3)' }}>GET DIRECTIONS</a>
              </GlassSection>

              <GlassSection padding="80px 25px">
                <h3 className={THEME.fontDisplay} style={{ fontSize: 'clamp(2.5rem, 12vw, 3.5rem)', color: THEME.gold, marginBottom: '20px', textShadow: '0 4px 15px rgba(0,0,0,0.4)' }}>WITH LOVE</h3>
                <p className={THEME.fontBody} style={{ fontSize: '1.2rem', opacity: 0.95, marginBottom: '50px', textShadow: '0 2px 10px rgba(0,0,0,0.3)', fontWeight: 500 }}>We can't wait to celebrate with you.</p>
                <WeddingRSVP orderId={orderId} data={data} />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
                  <div style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}>
                    <HeartIcon size={45} color={THEME.gold} />
                  </div>
                </div>
              </GlassSection>

              <div style={{ height: '100px' }}></div>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}
