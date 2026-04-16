'use client';

import { useState, useEffect } from 'react';
import CountdownSection from "@/components/CountdownSection";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import RSVPFooter from "@/components/RSVPFooter";
import Reveal from '@/components/Reveal';
import Image from 'next/image';

const OUTBACK_SAGE = "#7ea08d";
const OUTBACK_EARTH = "#a67c52";
const OUTBACK_CREAM = "#f9f6f0";
const OUTBACK_SUNSET = "#d35400";

const WeddingCalendar = ({ onAdd, data }: { onAdd: () => void, data?: any }) => {
  const eventDate = data?.eventDate ? new Date(data.eventDate) : new Date(2026, 9, 10);
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
        backgroundColor: OUTBACK_CREAM,
        borderRadius: '0px',
        border: `3px solid ${OUTBACK_EARTH}`,
        margin: '40px 0',
        boxShadow: '0 10px 40px rgba(166, 124, 82, 0.15)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', border: `1px solid ${OUTBACK_SAGE}`, pointerEvents: 'none' }} />
        
        <div style={{ fontSize: '1.4rem', fontWeight: 600, color: OUTBACK_EARTH, marginBottom: '20px', letterSpacing: '4px' }}>
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
            <div key={`${d}-${i}`} style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.6, color: OUTBACK_SAGE }}>{d}</div>
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
              color: d === targetDay ? 'white' : OUTBACK_EARTH,
              zIndex: 1,
              fontWeight: d === targetDay ? 900 : 500
            }}>
              {d === targetDay ? (
                <>
                  <div style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    backgroundColor: OUTBACK_SAGE,
                    zIndex: -1,
                    top: '50.5%',
                    left: '50%',
                    transformOrigin: 'center',
                    transform: 'translate(-50%, -50%) rotate(45deg)',
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
            backgroundColor: OUTBACK_EARTH,
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '3px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
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
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: OUTBACK_EARTH, marginBottom: '30px' }}>
          Life in the Bush
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          padding: '0 10px'
        }}>
          {photos.slice(0, 4).map((p, i) => (
            <div key={i} style={{ 
                height: '200px', 
                position: 'relative', 
                overflow: 'hidden', 
                borderRadius: '5px', 
                border: '10px solid white', 
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                transform: `rotate(${(i % 2 === 0 ? -2 : 2) * (i + 1)}deg)`
            }}>
                <Image src={p} alt={`Outback ${i}`} fill style={{ objectFit: 'cover' }} />
            </div>
          ))}
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
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: OUTBACK_EARTH, marginBottom: '30px' }}>
          Our Journey
        </h3>

        <div style={{ position: 'relative', width: '100%', height: '400px', border: `10px solid white`, boxShadow: '0 15px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
          <Image
            src={photos[index]}
            alt="Wedding Moment"
            fill
            style={{
              objectFit: 'cover',
              transition: 'all 1.5s ease-in-out',
            }}
            key={index}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '25px' }}>
          {photos.map((_, i) => (
            <div
              key={i}
              style={{
                width: index === i ? '30px' : '10px',
                height: '4px',
                backgroundColor: index === i ? OUTBACK_EARTH : OUTBACK_SAGE,
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
};

export default function OutbackTemplate({ data, orderId }: { data: any, orderId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [floatingLeaves, setFloatingLeaves] = useState<{ top: string, left: string, rotate: string, size: string, opacity: number }[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const leaves = [...Array(15)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      rotate: `${Math.random() * 360}deg`,
      size: `${Math.random() * 20 + 15}px`,
      opacity: Math.random() * 0.2 + 0.1
    }));
    setFloatingLeaves(leaves);
  }, []);

  if (!isMounted) return <div style={{ minHeight: '100vh', backgroundColor: OUTBACK_SAGE }} />;

  const handleOpen = () => {
    setIsOpen(true);
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) {
      audio.play().catch(e => console.log("Audio play blocked:", e));
    }
  };

  const toggleMusic = () => {
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const addToCalendar = () => {
    const title = encodeURIComponent(`${data?.brideName || 'Bride'} & ${data?.groomName || 'Groom'}'s Wedding`);
    const dateStr = data?.eventDate ? new Date(data.eventDate).toISOString().replace(/-|:|\.\d\d\d/g, "") : "20261010T150000Z";
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}`, '_blank');
  };

  return (
    <div style={{
      backgroundColor: '#2c3e50',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <main className="invitation-container" style={{
        position: 'relative',
        boxShadow: '0 0 80px rgba(0,0,0,0.5)',
        backgroundColor: OUTBACK_CREAM,
        maxWidth: '500px',
        width: '100%',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
        overflow: 'hidden'
      }}>
        <audio id="bg-music" loop>
          <source src={data?.musicUrl || "https://res.cloudinary.com/dnfbik3if/video/upload/v1775201422/krasnoshchok-wedding-romantic-love-music-409293_ikekwk.mp3"} type="audio/mpeg" />
        </audio>

        {isOpen && (
          <button
            onClick={toggleMusic}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 2000,
              width: '45px',
              height: '45px',
              borderRadius: '5px',
              backgroundColor: OUTBACK_CREAM,
              border: `2px solid ${OUTBACK_EARTH}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            {isMuted ? '🔇' : '🎵'}
          </button>
        )}

        {!isOpen && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1000,
            backgroundColor: OUTBACK_EARTH,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
            color: 'white',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")'
          }}>
             <Reveal>
              <div style={{ marginBottom: '30px', fontSize: '4rem' }}>🌄</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', marginBottom: '10px' }}>Join the Adventure</h2>
              <p style={{ letterSpacing: '5px', opacity: 0.8, marginBottom: '40px' }}>{data?.brideName} & {data?.groomName}</p>
              <button
                onClick={handleOpen}
                style={{
                  backgroundColor: OUTBACK_SAGE,
                  color: 'white',
                  padding: '16px 45px',
                  border: 'none',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  letterSpacing: '3px',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                }}
              >
                HEAR THE WILD
              </button>
            </Reveal>
          </div>
        )}

        {/* Floating Eucalyptus Leaves */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {floatingLeaves.map((leaf, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: leaf.top,
              left: leaf.left,
              transform: `rotate(${leaf.rotate})`,
              fontSize: leaf.size,
              opacity: leaf.opacity,
              color: OUTBACK_SAGE
            }}>🌿</div>
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            position: 'relative',
            minHeight: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: OUTBACK_SAGE
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${data?.images?.heroImage || '/home_hero_bg.png'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />
            
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'white', padding: '0 20px' }}>
              <Reveal>
                <div style={{ fontSize: '0.9rem', letterSpacing: '8px', color: OUTBACK_CREAM, marginBottom: '20px', fontWeight: 600 }}>G'DAY FROM AUSTRALIA</div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '5rem',
                  color: 'white',
                  margin: 0,
                  textShadow: '0 5px 20px rgba(0,0,0,0.6)',
                  lineHeight: 1
                }}>
                  {data?.brideName} <br /> <span style={{ color: OUTBACK_CREAM, fontSize: '3rem' }}>&</span> <br /> {data?.groomName}
                </h1>
                <div style={{ height: '3px', width: '80px', backgroundColor: OUTBACK_CREAM, margin: '40px auto' }}></div>
                <div style={{ fontSize: '1.2rem', letterSpacing: '6px', fontWeight: 400 }}>OBERON, NSW</div>
              </Reveal>
            </div>
          </div>

          <div style={{ padding: '0 20px' }}>
            <Reveal delay={100}>
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: OUTBACK_EARTH, lineHeight: 1.8 }}>
                        "Wild hearts and wide horizons. Join us for a rustic celebration under the outback stars."
                    </p>
                </div>
            </Reveal>

            <Reveal delay={200}>
              <div style={{
                padding: '60px 30px',
                textAlign: 'center',
                backgroundColor: 'white',
                border: `10px solid ${OUTBACK_CREAM}`,
                outline: `1px solid ${OUTBACK_EARTH}`,
                margin: '20px 0 60px',
                position: 'relative',
                borderRadius: '5px'
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '4.5rem',
                  color: OUTBACK_EARTH,
                  margin: '20px 0',
                  lineHeight: 1
                }}>
                  Mr. Guest
                </h2>
                <div style={{ height: '1px', width: '50px', backgroundColor: OUTBACK_SAGE, margin: '30px auto' }}></div>
                <p style={{ fontSize: '1.2rem', color: OUTBACK_EARTH, opacity: 0.9 }}>
                  We're putting on a spread and we'd love for you to join us as we say "I do" in the heart of the bush.
                </p>
              </div>
            </Reveal>

            <CountdownSection data={data} />

            <WeddingCalendar onAdd={addToCalendar} data={data} />

            <PhotoCollage data={data} />

            <div style={{ height: '500px', position: 'relative', margin: '40px 0', borderRadius: '5px', overflow: 'hidden', border: '15px solid white', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                <Image src={data?.images?.image1 || '/photo_2.png'} alt="Outback 1" fill style={{ objectFit: 'cover' }} />
            </div>

            <ItineraryTimeline data={data} />

            <section style={{ padding: '80px 0', textAlign: 'center' }}>
              <Reveal delay={200}>
                <div style={{ fontSize: '0.9rem', letterSpacing: '5px', color: OUTBACK_SAGE, marginBottom: '20px', fontWeight: 800 }}>THE HOMESTEAD</div>
                <h2 style={{ fontSize: '2.5rem', color: OUTBACK_EARTH, fontFamily: 'var(--font-display)', marginBottom: '10px' }}>{data?.location?.name || 'Blue Range Estate'}</h2>
                <p style={{ marginBottom: '30px', color: OUTBACK_EARTH, opacity: 0.8 }}>{data?.location?.address || '123 Eucalypt Way, Oberon NSW 2787'}</p>

                <div style={{ height: '350px', borderRadius: '10px', overflow: 'hidden', border: `3px solid white`, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                  <iframe
                    src={data?.location?.mapUrl ? `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312!2d149.86!3d-33.70!2m3!1f0!2f0!3f0!3m2!i1024!2i768!4f13.1!3m3!1m2!1s0x6b119293!2sOberon%20NSW%202787!5e0!3m2!1sen!2sau!4v1650000000000` : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13247.904897042588!2d149.855832!3d-33.710572!2m3!1f0!2f0!3f0!3m2!i1024!2i768!4f13.1!3m3!1m2!1s0x6b1192395333f21%3A0x6a0a09e072f9602f!2sOberon%2C%20NSW%202787!5e0!3m2!1sen!2sau!4v1620000000000"}
                    width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                  ></iframe>
                </div>
                <a href={data?.location?.mapLink || "https://maps.app.goo.gl/yYv3s"} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-block',
                  backgroundColor: OUTBACK_EARTH,
                  color: 'white',
                  padding: '14px 40px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  textDecoration: 'none',
                  borderRadius: '5px'
                }}>MAP TO SETTLEMENT</a>
              </Reveal>
            </section>

            <PhotoCarousel data={data} />

            <div style={{ textAlign: 'center', padding: '60px 0', fontSize: '3rem' }}>🌵 🌾 🌞</div>

            <RSVPFooter orderId={orderId} data={data} />
          </div>
        </div>
      </main>
    </div>
  );
}
