'use client';

import { useState, useEffect, useRef } from 'react';
import Reveal from '@/components/Reveal';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const THEME = {
  gold: '#D4AF37',
  goldLight: '#F1E5AC',
  red: '#8B0000',
  redDark: '#4A0404',
  glassBg: 'rgba(30, 0, 0, 0.55)',
  glassBorder: 'rgba(212, 175, 55, 0.3)',
};

const MUSIC_URL = "https://res.cloudinary.com/dnfbik3if/video/upload/v1775201422/krasnoshchok-wedding-romantic-love-music-409293_ikekwk.mp3";
const DEFAULT_IMAGES = ['/home_hero_bg.png', '/photo_2.png', '/photo_3.png', '/photo_4.png', '/photo_5.png'];

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

const GoldMotif = ({ size = 60 }: { size?: number }) => (
  <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', opacity: 0.8 }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 20C40 20 30 25 25 35C20 45 20 55 25 65C30 75 40 80 50 80C60 80 70 75 75 65C80 55 80 45 75 35" stroke={THEME.gold} strokeWidth="3" strokeLinecap="round" />
      <path d="M30 30C40 15 60 15 70 30" stroke={THEME.gold} strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="50" r="4" fill={THEME.gold} />
    </svg>
  </div>
);

// Blending Image
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
      maskImage: 'radial-gradient(circle, black 40%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 100%)',
      overflow: 'hidden'
    }}>
      <Image src={src} alt="Moment" fill style={{ objectFit: 'cover' }} unoptimized={src.startsWith('http')} />
    </div>
  </div>
);

const HomecomingCountdown = ({ data }: { data?: any }) => {
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
      <div style={{ fontSize: '0.8rem', letterSpacing: '4px', color: THEME.gold, marginBottom: '25px', fontWeight: 700 }}>COUNTDOWN</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hrs', value: timeLeft.hours },
          { label: 'Min', value: timeLeft.minutes },
          { label: 'Sec', value: timeLeft.seconds }
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', textShadow: `0 0 10px ${THEME.gold}`, borderBottom: `1px solid ${THEME.gold}`, paddingBottom: '5px', width: '100%', fontFamily: 'serif' }}>{item.value.toString().padStart(2, '0')}</div>
            <span style={{ fontSize: '0.65rem', letterSpacing: '1px', marginTop: '10px', color: THEME.gold, fontWeight: 700 }}>{item.label.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const HomecomingItinerary = ({ data }: { data?: any }) => {
  const events = data?.timeline?.length > 0 ? data.timeline : [
    { time: '5:00 PM', title: 'WELCOME', location: 'Grand Lobby' },
    { time: '6:30 PM', title: 'COCKTAILS', location: 'Terrace' },
    { time: '8:00 PM', title: 'DINNER', location: 'Royal Hall' },
    { time: '10:00 PM', title: 'PARTY', location: 'Main Stage' }
  ];
  return (
    <div style={{ position: 'relative', padding: '10px 0' }}>
      <div style={{ position: 'absolute', left: '20px', top: '0', bottom: '0', width: '1px', background: `linear-gradient(to bottom, transparent, ${THEME.gold}, transparent)` }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', paddingLeft: '45px' }}>
        {events.map((event: any, i: number) => (
          <Reveal key={i} delay={i * 100}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-37px', marginBottom: '8px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: THEME.gold, boxShadow: `0 0 10px ${THEME.gold}`, border: '1px solid white' }}></div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: THEME.gold, marginLeft: '20px', letterSpacing: '2px' }}>{event.time}</div>
              </div>
              <div style={{ fontSize: '1.4rem', color: '#fff', fontFamily: 'var(--font-display)' }}>{event.title}</div>
              <div style={{ fontSize: '0.8rem', color: THEME.goldLight, opacity: 0.7 }}>{event.location}</div>
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
      <div style={{ padding: '30px 20px', textAlign: 'center', background: THEME.glassBg, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '30px', border: `1px solid ${THEME.glassBorder}`, margin: '40px 0' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: THEME.gold, marginBottom: '10px' }}>Save the Date</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: THEME.goldLight, marginBottom: '20px', letterSpacing: '3px' }}>{monthName} {year}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', maxWidth: '300px', margin: '0 auto 30px' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} style={{ fontSize: '0.7rem', fontWeight: 900, color: THEME.gold }}>{d}</div>)}
          {blanksArr.map(b => <div key={`b-${b}`} />)}
          {daysArr.map(d => (
            <div key={d} style={{ position: 'relative', fontSize: '1.1rem', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, fontWeight: d === targetDay ? 900 : 500 }}>
              {d === targetDay ? (
                <>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: -1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HeartIcon size={40} color={THEME.gold} />
                  </div>
                  <span style={{ color: '#000' }}>{d}</span>
                </>
              ) : d}
            </div>
          ))}
        </div>
        <button onClick={onAdd} style={{ background: THEME.gold, color: '#000', border: 'none', borderRadius: '30px', padding: '12px 25px', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1px' }}>ADD TO CALENDAR</button>
      </div>
    </Reveal>
  );
};

const GlassSection = ({ children, padding = '40px 25px' }: { children: React.ReactNode, padding?: string }) => (
  <Reveal delay={100}>
    <div style={{ padding, background: THEME.glassBg, backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', borderRadius: '30px', border: `1px solid ${THEME.glassBorder}`, margin: '30px 0', textAlign: 'center', color: '#fff' }}>
      {children}
    </div>
  </Reveal>
);

const HomecomingRSVP = ({ orderId, data }: { orderId?: string, data?: any }) => {
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
    <div style={{ padding: '40px 20px', background: THEME.glassBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '30px', border: `1px solid ${THEME.glassBorder}`, textAlign: 'center' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: THEME.gold, marginBottom: '20px' }}>Join Our Celebration</h3>
      {!formOpen && status !== 'success' && <button onClick={() => setFormOpen(true)} style={{ background: THEME.gold, color: '#000', padding: '16px 40px', borderRadius: '30px', fontWeight: 900, border: 'none', letterSpacing: '1px' }}>RSVP NOW</button>}
      {formOpen && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto' }}>
          <input type="text" placeholder="Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${THEME.gold}`, background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
          <input type="tel" placeholder="Contact" required value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${THEME.gold}`, background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.7rem', display: 'block', textAlign: 'left', marginBottom: '5px', color: THEME.gold, fontWeight: 700, letterSpacing: '1px' }}>ADULTS</label>
              <input type="number" min="1" value={formData.adults} onChange={e => setFormData({ ...formData, adults: parseInt(e.target.value) })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${THEME.gold}`, background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.7rem', display: 'block', textAlign: 'left', marginBottom: '5px', color: THEME.gold, fontWeight: 700, letterSpacing: '1px' }}>CHILDREN</label>
              <input type="number" min="0" value={formData.children} onChange={e => setFormData({ ...formData, children: parseInt(e.target.value) })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${THEME.gold}`, background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
            </div>
          </div>
          <button type="submit" style={{ background: THEME.gold, color: '#000', padding: '12px', borderRadius: '30px', fontWeight: 900 }}>CONFIRM</button>
        </form>
      )}
      {status === 'success' && <div style={{ color: THEME.gold, fontSize: '1.2rem', fontWeight: 700 }}>Thank you! See you soon.</div>}
    </div>
  );
};

export default function HomecomingTemplate({ data, orderId }: { data: any, orderId?: string }) {
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

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', width: '100%', overflowX: 'hidden', fontFamily: 'var(--font-body)', color: '#fff' }}>
      <video ref={videoRef} autoPlay loop muted playsInline style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.65 }}>
        <source src="/homecomingBg.mp4" type="video/mp4" />
      </video>
      <audio id="bg-music" loop><source src={data?.musicUrl || MUSIC_URL} type="audio/mpeg" /></audio>

      {isOpen && (
        <button onClick={toggleMusic} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 2000, width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.6)', border: `1px solid ${THEME.gold}`, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.4rem', cursor: 'pointer', color: THEME.gold }}>
          <MusicIcon muted={isMuted} />
        </button>
      )}

      {/* Cover Page */}
      <div style={{ width: '100%', height: '100vh', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, zIndex: 1000, transition: 'all 1.5s cubic-bezier(0.87, 0, 0.13, 1)', transform: isOpen ? 'translateY(-100%)' : 'translateY(0)', opacity: isOpen ? 0 : 1, cursor: 'pointer', overflow: 'hidden' }} onClick={handleOpen}>
        <Image src="/homecoming.jpg" alt="Cover" fill style={{ objectFit: 'cover', opacity: 0.9 }} priority />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', textAlign: 'center', width: '100%', zIndex: 2, padding: '0 20px' }}>
          <Reveal>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: THEME.gold, marginBottom: '20px', textShadow: '2px 2px 15px rgba(0,0,0,1)', paddingTop: '40px' }}>Homecoming</h1>
            <BlendingImage src={gallery[0]} size="240px" align="center" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: '#fff', marginBottom: '0', textShadow: '1px 1px 10px rgba(0,0,0,1)' }}>{data?.groomName || 'Mark'} & {data?.brideName || 'Sarah'}</h2>
            <div className="bounce-soft" style={{ fontSize: '0.9rem', letterSpacing: '6px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', marginTop: '40px' }}>TAP TO OPEN</div>
          </Reveal>
        </div>
      </div>

      {isOpen && (
        <main style={{ position: 'relative', zIndex: 1, maxWidth: '500px', margin: '0 auto', padding: '0 20px' }}>
          <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <Reveal>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4.5rem', color: THEME.gold, textShadow: '0 0 20px rgba(212,175,55,0.4)', marginBottom: '10px' }}>Homecoming</h1>
              <BlendingImage src={gallery[1]} size="280px" align="center" />
              <div style={{ fontSize: '1.1rem', letterSpacing: '4px', color: '#fff', margin: '15px 0' }}>CELEBRATING THE UNION OF</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: THEME.gold }}>{data?.groomName || 'Mark'} & {data?.brideName || 'Sarah'}</h2>

            </Reveal>
          </section>

          <GlassSection>
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: THEME.goldLight, lineHeight: 1.6 }}>"Every love story is beautiful, but ours is my favorite."</p>
            <div style={{ height: '1px', width: '80px', background: THEME.gold, margin: '25px auto' }}></div>
            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Join us as we step into our new life together.</p>
          </GlassSection>

          {/* Gallery Pattern: 2 rows, Left-aligned top, Right-aligned bottom */}
          <div style={{ margin: '40px 0' }}>
            <Reveal delay={200}>
              <BlendingImage src={gallery[2]} size="300px" align="left" />
            </Reveal>
            <Reveal delay={400}>
              <BlendingImage src={gallery[3]} size="300px" align="right" />
            </Reveal>
          </div>

          <HomecomingCountdown data={data} />

          <GlassSection>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: THEME.gold, marginBottom: '25px' }}>Our Schedule</h3>
            <HomecomingItinerary data={data} />
          </GlassSection>

          {/* More Gallery images if needed */}
          <Reveal delay={300}>
            <BlendingImage src={gallery[4]} size="280px" align="left" />
          </Reveal>

          <WeddingCalendar onAdd={() => { }} data={data} />

          <GlassSection>
            <div style={{ fontSize: '0.8rem', letterSpacing: '4px', color: THEME.gold, marginBottom: '15px', fontWeight: 800 }}>THE VENUE</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{data?.location?.name || 'Grand Royal Ballroom'}</h2>
            <p style={{ opacity: 0.8, color: THEME.goldLight }}>{data?.location?.address || '456 Majesty Way, Royal City'}</p>
            <div style={{ height: '250px', borderRadius: '20px', overflow: 'hidden', border: `1px solid ${THEME.gold}`, margin: '30px 0' }}>
              <iframe src="https://www.google.com/maps/embed?..." width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}></iframe>
            </div>
            <a href="#" style={{ display: 'inline-block', padding: '15px 40px', background: THEME.gold, color: '#000', borderRadius: '40px', fontWeight: 900, textDecoration: 'none' }}>GET DIRECTIONS</a>
          </GlassSection>

          <GlassSection padding="60px 25px">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: THEME.gold, marginBottom: '20px' }}>Thank You</h3>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '40px' }}>For being part of our journey.</p>
            <HomecomingRSVP orderId={orderId} data={data} />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
              <HeartIcon size={40} color={THEME.gold} />
            </div>
          </GlassSection>

          <div style={{ height: '100px' }}></div>
        </main>
      )}
    </div>
  );
}
