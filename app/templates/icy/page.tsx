'use client';

import { useState, useEffect } from 'react';
import Reveal from '@/components/Reveal';
import Image from 'next/image';
import ItineraryTimeline from "@/components/ItineraryTimeline";
import RSVPFooter from "@/components/RSVPFooter";

const MUSIC_URL = "https://res.cloudinary.com/dnfbik3if/video/upload/v1775201422/krasnoshchok-wedding-romantic-love-music-409293_ikekwk.mp3";
const FLOWER_DECO = "/icy_flower.png";

const FloatingHearts = ({ count = 300 }: { count?: number }) => {
  const [hearts, setHearts] = useState<{ top: string; left: string; size: string; opacity: number; delay: string; duration: string; rotation: string; drift: string }[]>([]);

  useEffect(() => {
    const newHearts = [...Array(count)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 1.5 + 0.5}rem`,
      opacity: Math.random() * 0.15 + 0.05,
      delay: `${Math.random() * 5}s`,
      duration: `${4 + Math.random() * 8}s`,
      rotation: `${Math.random() * 360}deg`,
      drift: `${(Math.random() - 0.5) * 40}px`
    }));
    setHearts(newHearts);
  }, [count]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {hearts.map((h, i) => (
        <div key={i} className="floating-heart" style={{
          position: 'absolute',
          top: h.top,
          left: h.left,
          fontSize: h.size,
          opacity: h.opacity,
          color: 'var(--icy-accent)',
          animationDelay: h.delay,
          animationDuration: h.duration,
          ['--drift-x' as any]: h.drift,
          padding: '10px' // hit area padding
        }}>
          ❤
        </div>
      ))}
    </div>
  );
};

const FlowerDeco = ({ style }: { style: React.CSSProperties }) => (
  <div style={{ position: 'absolute', width: '180px', height: '180px', pointerEvents: 'none', zIndex: 5, ...style }}>
    <Image src={FLOWER_DECO} alt="flower" fill style={{ objectFit: 'contain' }} />
  </div>
);

const BlendedImage = ({ src, alt, height = "450px", delay = 200 }: { src: string, alt: string, height?: string, delay?: number }) => (
  <Reveal delay={delay}>
    <div style={{
      height,
      width: '100%',
      position: 'relative',
      margin: '60px 0',
      overflow: 'hidden'
    }}>
      <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} />
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, var(--icy-frost) 0%, transparent 20%, transparent 80%, var(--icy-frost) 100%), linear-gradient(to right, var(--icy-frost) 0%, transparent 15%, transparent 85%, var(--icy-frost) 100%)',
        zIndex: 1
      }} />
    </div>
  </Reveal>
);

const IcyHero = ({ data }: { data: any }) => (
  <section style={{
    height: '90vh',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'var(--icy-frost)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  }}>
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: `url("${data?.images?.heroImage || '/home_hero_bg.png'}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.85,
      filter: 'brightness(1) contrast(1.05) saturate(1)'
    }} />

    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'radial-gradient(circle at center, transparent 20%, var(--icy-frost) 95%), linear-gradient(to bottom, transparent 80%, var(--icy-frost) 100%)',
      zIndex: 1
    }} />

    <FlowerDeco style={{ top: '-40px', left: '-40px', transform: 'rotate(-15deg)' }} />
    <FlowerDeco style={{ bottom: '-40px', right: '-40px', transform: 'rotate(165deg)' }} />

    <div style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
      <Reveal delay={200}>
        <div style={{ fontSize: '1rem', letterSpacing: '8px', color: 'var(--icy-blue)', marginBottom: '20px', fontWeight: 600 }}>A WINTER TALE</div>
        <h1 style={{
          fontSize: '5rem',
          lineHeight: 1.1,
          fontFamily: 'var(--font-display)',
          color: 'var(--icy-dark)',
          marginBottom: '20px'
        }}>
          {data?.brideName || 'Sarah'} & {data?.groomName || 'Mark'}
        </h1>
      </Reveal>

      <Reveal delay={400}>
        <div style={{
          fontSize: '1.3rem',
          color: 'var(--icy-blue)',
          letterSpacing: '5px',
          fontWeight: 700,
          padding: '10px 40px',
          borderTop: '1px solid var(--icy-silver)',
          borderBottom: '1px solid var(--icy-silver)',
          display: 'inline-block'
        }}>
          {data?.eventDate ? new Date(data.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() : 'DECEMBER 12, 2026'}
        </div>
      </Reveal>
    </div>
  </section>
);

const IcyCalendar = ({ data }: { data: any }) => {
  const eventDate = data?.eventDate ? new Date(data.eventDate) : new Date(2026, 7, 24);
  const year = eventDate.getFullYear();
  const month = eventDate.getMonth();
  const targetDay = eventDate.getDate();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);
  const monthName = eventDate.toLocaleString('en-US', { month: 'long' }).toUpperCase();

  return (
    <Reveal delay={200}>
      <div style={{
        padding: '60px 30px',
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        margin: '60px 0',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: 'var(--icy-dark)', marginBottom: '10px', lineHeight: 1.2 }}>Save the Date</div>
        <div style={{ fontSize: '1.2rem', letterSpacing: '5px', color: 'var(--icy-blue)', fontWeight: 700, marginBottom: '40px' }}>{monthName} {year}</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '15px', maxWidth: '340px', margin: '0 auto' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={`${d}-${i}`} style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.4, color: 'var(--icy-blue)' }}>{d}</div>
          ))}
          {blanks.map(b => <div key={`b-${b}`} />)}
          {days.map(d => (
            <div key={d} style={{
              fontSize: '1.1rem',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              color: d === targetDay ? 'white' : 'var(--icy-dark)',
              fontWeight: d === targetDay ? 800 : 400
            }}>
              {d === targetDay && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.8rem', color: 'var(--icy-dark)', zIndex: 1, pointerEvents: 'none'
                }}>
                  ❤
                </div>
              )}
              <span style={{ position: 'relative', zIndex: 2 }}>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
};

const AnnouncementBox = ({ data }: { data: any }) => (
  <Reveal delay={200}>
    <div style={{
      padding: '80px 40px',
      textAlign: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      margin: '60px 0',
      position: 'relative',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      boxShadow: '0 10px 30px rgba(106, 123, 138, 0.05)'
    }}>
      <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--icy-blue)', fontStyle: 'italic', marginBottom: '30px' }}>
        With hearts full of love and happiness, we are delighted to announce our wedding!
      </p>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '4.5rem',
        color: 'var(--icy-dark)',
        margin: '10px 0'
      }}>
        Mr. Guest
      </h2>
      <p style={{ fontSize: '1.1rem', marginTop: '30px', color: 'var(--icy-blue)' }}>
        join us as we celebrate this precious milestone.
      </p>
    </div>
  </Reveal>
);

export default function IcyTemplate({ data, orderId }: { data: any, orderId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) { audio.play().catch(e => console.log("Audio play blocked", e)); }
  };

  return (
    <div style={{ backgroundColor: 'var(--icy-frost)', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <main className="invitation-container icy-theme" style={{ position: 'relative', backgroundColor: 'var(--icy-frost)', boxShadow: '0 0 80px rgba(106, 123, 138, 0.1)' }}>
        <style jsx global>{`
                    .icy-theme .subheading { color: var(--icy-blue) !important; font-weight: 800 !important; letter-spacing: 5px !important; text-transform: uppercase !important; }
                    .icy-theme .itinerary-section { 
                        background-color: rgba(255, 255, 255, 0.4) !important; 
                        backdrop-filter: blur(10px) !important;
                        border-radius: 20px !important; 
                        border: 1px solid rgba(255, 255, 255, 0.6) !important;
                    }
                    .icy-theme .btn-primary { 
                        background-color: var(--icy-blue) !important; 
                        border-radius: 40px !important; 
                        padding: 15px 45px !important;
                        font-weight: 700 !important;
                        box-shadow: 0 8px 25px rgba(106, 123, 138, 0.3) !important;
                    }
                    .icy-theme .btn-outline { border-radius: 40px !important; color: var(--icy-blue) !important; border-color: var(--icy-blue) !important; }
                    .icy-theme footer { 
                        background-color: rgba(255, 255, 255, 0.4) !important; 
                        backdrop-filter: blur(10px) !important;
                    }
                    .icy-theme div[style*="backgroundColor: var(--rose-light)"] { background-color: var(--icy-frost) !important; }
                    .icy-theme div[style*="color: var(--rose-medium)"] { color: var(--icy-blue) !important; }
                    
                    @keyframes floatDrift {
                        0% { transform: translateY(0) rotate(0deg); }
                        50% { transform: translateY(-100px) translateX(var(--drift-x, 20px)) rotate(180deg); opacity: 0.2; }
                        100% { transform: translateY(0) rotate(360deg); }
                    }
                    .floating-heart {
                        animation: floatDrift 15s infinite linear;
                    }
                `}</style>

        <audio id="bg-music" loop>
          <source src={data?.musicUrl || MUSIC_URL} type="audio/mpeg" />
        </audio>

        {!isOpen ? (
          <div onClick={handleOpen} style={{ width: '100%', height: '100vh', backgroundColor: 'var(--icy-frost)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', textAlign: 'center', padding: '40px', position: 'relative', overflow: 'hidden' }}>
            <FloatingHearts count={150} />
            <FlowerDeco style={{ top: '10%', right: '-50px', transform: 'rotate(15deg)' }} />
            <FlowerDeco style={{ bottom: '10%', left: '-50px', transform: 'rotate(-15deg)' }} />
            <Reveal>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '4.5rem',
                color: 'var(--icy-dark)',
                marginBottom: '5px',
                lineHeight: 1.1
              }}>
                {data?.brideName || 'Sarah'} & {data?.groomName || 'Mark'}
              </h1>
              <div style={{
                fontSize: '0.9rem',
                letterSpacing: '6px',
                color: 'var(--icy-blue)',
                fontWeight: 800,
                opacity: 0.8,
                textTransform: 'uppercase'
              }}>Wedding Invitation</div>
            </Reveal>

            <div style={{ position: 'absolute', bottom: '60px', left: 0, right: 0 }}>
              <Reveal delay={800}>
                <p className="bounce-soft" style={{ letterSpacing: '8px', opacity: 0.6, fontSize: '0.9rem', fontWeight: 800, color: 'var(--icy-blue)' }}>TAP TO OPEN</p>
              </Reveal>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', position: 'relative' }}>
            <FloatingHearts count={400} />

            <IcyHero data={data} />

            <div style={{ padding: '60px 25px' }}>
              <Reveal delay={100}>
                <div style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--icy-blue)', marginBottom: '40px', fontSize: '1.2rem', lineHeight: 1.8 }}>
                  "Two souls with but a single thought,<br />two hearts that beat as one."
                </div>
              </Reveal>

              <AnnouncementBox data={data} />

              <BlendedImage src={data?.images?.image1 || "/photo_2.png"} alt="Couple" height="500px" />

              <div style={{ margin: '60px 0' }}>
                <ItineraryTimeline data={data} />
              </div>

              <IcyCalendar data={data} />

              <BlendedImage src={data?.images?.image2 || "/photo_3.png"} alt="Ceremony" height="400px" />

              <section style={{ padding: '60px 0', textAlign: 'center' }}>
                <Reveal delay={200}>
                  <div style={{ fontSize: '0.9rem', letterSpacing: '8px', color: 'var(--icy-blue)', marginBottom: '20px', fontWeight: 800 }}>LOCATION</div>
                  <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: 'var(--icy-dark)', marginBottom: '15px' }}>{data?.location?.name || 'Frost Garden Estates'}</h2>
                  <p style={{ marginBottom: '40px', opacity: 0.8, fontSize: '1rem', color: 'var(--icy-dark)' }}>{data?.location?.address || '456 Snow Peak, Winter Valley'}</p>
                  <a href={data?.location?.mapUrl || "#"} target="_blank" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>VIEW LOCATION</a>
                </Reveal>
              </section>

              <BlendedImage src={data?.images?.gallery?.[0] || "/photo_4.png"} alt="The Couple" height="550px" />

              <RSVPFooter orderId={orderId} data={data} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
