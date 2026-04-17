'use client';

import { useState, useEffect } from 'react';
import Hero from "@/components/Hero";
import CountdownSection from "@/components/CountdownSection";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import RSVPFooter from "@/components/RSVPFooter";
import Reveal from '@/components/Reveal';
import Image from 'next/image';

const TROPICAL_GREEN = "#2d5a27";
const TROPICAL_TEAL = "#0a8da0";
const TROPICAL_WHITE = "#ffffff";
const TROPICAL_SAND = "#fdfbf0";
const TROPICAL_GOLD = "#d4af37";

const LeafSVG = ({ style, color = TROPICAL_GREEN }: { style?: React.CSSProperties, color?: string }) => (
    <svg viewBox="0 0 24 24" style={{ width: '120px', height: '120px', fill: color, ...style }}>
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8.17,20C12.21,20 18,12.22 18,10C18,10 21,12 21,12C21,12 22,11.33 21,10C21,10 18,8 17,8M15,10C15,11.23 13.5,13.72 12.33,15.17L11.08,13.92C12.44,12.59 13.91,10 13.91,10C13.91,10 15,10 15,10M9.54,16.7L10.79,17.95C9.28,18.42 7.79,18.66 7.79,18.66C7.79,18.66 9.54,16.7 9.54,16.7Z" />
    </svg>
);

const WeddingCalendar = ({ onAdd, data }: { onAdd: () => void, data?: any }) => {
  const eventDate = data?.eventDate ? new Date(data.eventDate) : new Date(2026, 6, 20);
  const year = eventDate.getFullYear();
  const month = eventDate.getMonth();
  const targetDay = eventDate.getDate();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);
  const monthName = eventDate.toLocaleString('default', { month: 'long' }).toUpperCase();

  return (
    <Reveal delay={200}>
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        backgroundColor: TROPICAL_SAND,
        borderRadius: '30px',
        border: `1px solid ${TROPICAL_GREEN}22`,
        margin: '40px 0',
        boxShadow: '0 10px 30px rgba(45, 90, 39, 0.05)'
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: TROPICAL_GREEN, marginBottom: '10px' }}>
          Tropical Paradise
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 600, color: TROPICAL_TEAL, marginBottom: '20px', letterSpacing: '4px' }}>
          {monthName} {year}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          maxWidth: '300px',
          margin: '0 auto 30px'
        }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={`${d}-${i}`} style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.5, color: TROPICAL_GREEN }}>{d}</div>
          ))}
          {blanks.map(b => <div key={`b-${b}`} />)}
          {days.map(d => (
            <div key={d} style={{
              position: 'relative',
              fontSize: '1rem',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: d === targetDay ? 'white' : TROPICAL_GREEN,
              zIndex: 1,
              fontWeight: d === targetDay ? 900 : 500
            }}>
              {d === targetDay ? (
                <>
                  <div style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    backgroundColor: TROPICAL_TEAL,
                    borderRadius: '50%',
                    zIndex: -1,
                    top: '50%',
                    left: '50%',
                    marginTop: '-16px',
                    marginLeft: '-16px',
                  }}></div>
                  <span>{d}</span>
                </>
              ) : d}
            </div>
          ))}
        </div>

        <button
          onClick={onAdd}
          style={{
            backgroundColor: TROPICAL_GREEN,
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 30px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(45, 90, 39, 0.3)'
          }}
        >
          SAVE THE DATE
        </button>
      </div>
    </Reveal>
  );
};

const PhotoCollage = ({ data }: { data?: any }) => {
    const photos = (data?.images?.gallery?.length > 4 
      ? data.images.gallery 
      : ['/photo_2.png', '/photo_3.png', '/photo_4.png', '/photo_5.png', '/home_hero_bg.png']) as string[];

    return (
    <Reveal delay={200}>
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: TROPICAL_GREEN, marginBottom: '30px' }}>
          By the Shore
        </h3>
        
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '15px',
            padding: '0 10px'
        }}>
            <div style={{ gridColumn: 'span 2', height: '200px', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
                <Image src={photos[0]} alt="Collage 1" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ height: '180px', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
                <Image src={photos[1]} alt="Collage 2" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ height: '180px', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
                <Image src={photos[2]} alt="Collage 3" fill style={{ objectFit: 'cover' }} />
            </div>
        </div>
      </div>
    </Reveal>
  );
};

const PhotoCarousel = ({ data }: { data?: any }) => {
    const [index, setIndex] = useState(0);
    const photos = (data?.images?.gallery?.length > 0 
      ? data.images.gallery 
      : ['/home_hero_bg.png', '/photo_2.png', '/photo_3.png', '/photo_4.png', '/photo_5.png']) as string[];
  
    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
      }, 4000);
      return () => clearInterval(interval);
    }, [photos.length]);
  
    return (
      <Reveal delay={200}>
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: TROPICAL_GREEN, marginBottom: '30px' }}>
            Our Love Story
          </h3>
  
          <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '30px', overflow: 'hidden', border: `3px solid ${TROPICAL_GOLD}`, boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }}>
            <Image
              src={photos[index]}
              alt="Wedding Moment"
              fill
              style={{
                objectFit: 'cover',
                transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              key={index}
            />
          </div>
  
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '25px' }}>
            {photos.map((_, i) => (
              <button
                key={`dot-${i}`}
                onClick={() => setIndex(i)}
                style={{
                  width: index === i ? '24px' : '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: index === i ? TROPICAL_GREEN : TROPICAL_GOLD,
                  opacity: index === i ? 1 : 0.3,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </Reveal>
    );
  };

export default function CeylonTemplate({ data, orderId }: { data: any, orderId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) { audio.play().catch(e => console.log("Audio play blocked", e)); }
  };

  const toggleMusic = () => {
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) { audio.muted = !isMuted; setIsMuted(!isMuted); }
  };

  const addToCalendar = () => {
    const title = encodeURIComponent(`${data?.brideName || 'Bride'} & ${data?.groomName || 'Groom'}'s Wedding`);
    const dateStr = data?.eventDate ? new Date(data.eventDate).toISOString().replace(/-|:|\.\d\d\d/g, "") : "20260720T150000Z";
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#ddece8', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <main className="invitation-container" style={{ 
          position: 'relative', 
          backgroundColor: TROPICAL_WHITE,
          boxShadow: '0 0 60px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%',
          overflow: 'hidden',
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")'
      }}>
        <audio id="bg-music" loop>
           <source src={data?.musicUrl || "https://res.cloudinary.com/dnfbik3if/video/upload/v1775201422/krasnoshchok-wedding-romantic-love-music-409293_ikekwk.mp3"} type="audio/mpeg" />
        </audio>

        {isOpen && (
            <button onClick={toggleMusic} style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 2000, width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'white', border: `2px solid ${TROPICAL_GREEN}`, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                {isMuted ? '🔇' : '🎵'}
            </button>
        )}

        {/* Tropical Welcome Screen */}
        <div 
            onClick={handleOpen} 
            style={{ 
                width: '100%', 
                height: '100vh', 
                backgroundColor: '#f4fbf9', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                cursor: 'pointer', 
                textAlign: 'center', 
                padding: '40px', 
                position: 'fixed',
                top: 0, left: 0,
                zIndex: 1000,
                transition: 'transform 1.3s cubic-bezier(0.86, 0, 0.07, 1)',
                transform: isOpen ? 'translateY(100%)' : 'translateY(0)',
                overflow: 'hidden'
            }}
        >
            {/* Background Texture Overlay */}
            <div style={{ 
                position: 'absolute', 
                inset: 0, 
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/gray-floral.png")',
                opacity: 0.1,
                pointerEvents: 'none'
            }} />
            <LeafSVG style={{ position: 'absolute', top: '-20px', left: '-20px', opacity: 0.1, transform: 'rotate(15deg)' }} />
            <LeafSVG style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.1, transform: 'rotate(195deg)' }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
                <Reveal>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
                        <div style={{ height: '2px', width: '40px', backgroundColor: TROPICAL_GOLD }}></div>
                        <div style={{ fontSize: '1.2rem', letterSpacing: '8px', color: TROPICAL_GREEN, fontWeight: 700 }}>AYUBOWAN</div>
                        <div style={{ height: '2px', width: '40px', backgroundColor: TROPICAL_GOLD }}></div>
                    </div>
                    
                    <h1 style={{ 
                        fontFamily: 'var(--font-display)', 
                        fontSize: '5rem', 
                        color: TROPICAL_GREEN,
                        marginBottom: '10px',
                        lineHeight: 1.1 
                    }}>
                        {data?.brideName || 'Sarah'} & {data?.groomName || 'Mark'}
                    </h1>
                    
                    <div style={{ fontSize: '1rem', letterSpacing: '6px', color: TROPICAL_TEAL, fontWeight: 700, textTransform: 'uppercase', marginBottom: '40px' }}>Tropical Wedding Invitation</div>
                </Reveal>
            </div>

            <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0 }}>
                <Reveal delay={800}>
                    <div className="bounce-soft" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                        <div style={{ fontSize: '1.5rem' }}>🍃</div>
                        <p style={{ letterSpacing: '8px', opacity: 0.5, fontSize: '0.8rem', fontWeight: 800, color: TROPICAL_GREEN }}>TAP TO OPEN</p>
                    </div>
                </Reveal>
            </div>
        </div>

        {/* Content Starts Here */}
        <div style={{
            height: '100vh',
            width: '100%',
            position: 'relative',
        }}>
            <Image 
                src={data?.images?.heroImage || '/home_hero_bg.png'} 
                alt="Tropical Hero" 
                fill 
                priority
                style={{ objectFit: 'cover' }}
            />
            <div style={{ 
                position: 'absolute', 
                inset: 0, 
                backgroundColor: 'rgba(0,0,0,0.3)',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 50%, rgba(0,0,0,0.5) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center',
                padding: '20px'
            }}>
                <Reveal>
                    <div style={{ fontSize: '1rem', letterSpacing: '10px', fontWeight: 300, marginBottom: '20px' }}>ALOHA & AYUBOWAN</div>
                    <h1 style={{ 
                        fontFamily: 'var(--font-display)', 
                        fontSize: '6rem', 
                        margin: '10px 0',
                        textShadow: '0 5px 20px rgba(0,0,0,0.5)'
                    }}>
                        {data?.brideName} <span style={{ color: TROPICAL_GOLD }}>&</span> {data?.groomName}
                    </h1>
                    <div style={{ height: '2px', width: '100px', backgroundColor: TROPICAL_GOLD, margin: '30px auto' }}></div>
                    <div style={{ fontSize: '1.4rem', opacity: 0.9, letterSpacing: '5px', fontWeight: 600 }}>SEPTEMBER 05, 2026</div>
                </Reveal>
            </div>
        </div>

        <div style={{ padding: '60px 20px', position: 'relative' }}>
          {/* Subtle Background Leaves */}
          <LeafSVG style={{ position: 'absolute', top: '10%', right: '-40px', opacity: 0.05, transform: 'rotate(-15deg)' }} />
          <LeafSVG style={{ position: 'absolute', top: '40%', left: '-40px', opacity: 0.05, transform: 'rotate(15deg) scaleX(-1)' }} />
          <LeafSVG style={{ position: 'absolute', bottom: '10%', right: '-40px', opacity: 0.05, transform: 'rotate(195deg)' }} />

          <Reveal delay={100}>
             <div style={{ textAlign: 'center', padding: '60px 0', border: `1px solid ${TROPICAL_GREEN}22`, backgroundColor: TROPICAL_SAND, borderRadius: '30px', margin: '20px 0 60px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🌴</div>
                <p style={{ color: TROPICAL_GREEN, lineHeight: 1.8, fontSize: '1.1rem', padding: '0 30px', fontStyle: 'italic' }}>
                    Join us for a day of sun, sand, and tropical bliss as we celebrate our love in the beautiful island of Sri Lanka.
                </p>
             </div>
          </Reveal>

          <CountdownSection data={data} />

          <WeddingCalendar onAdd={addToCalendar} data={data} />

          <PhotoCollage data={data} />

          <PhotoCarousel data={data} />

          <ItineraryTimeline data={data} />

           <RSVPFooter orderId={orderId} data={data} />
        </div>
      </main>
    </div>
  );
}
