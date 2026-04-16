'use client';

import { useState, useEffect } from 'react';
import Hero from "@/components/Hero";
import CountdownSection from "@/components/CountdownSection";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import RSVPFooter from "@/components/RSVPFooter";
import Reveal from '@/components/Reveal';
import Image from 'next/image';

const FUSION_PK = "#f7d7da";
const FUSION_SG = "#d4dfd1";
const FUSION_TEXT = "#5a5a5a";
const FUSION_GOLD = "#d4af37";

const WeddingCalendar = ({ onAdd, data }: { onAdd: () => void, data?: any }) => {
  const eventDate = data?.eventDate ? new Date(data.eventDate) : new Date(2027, 2, 12);
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
        backgroundColor: '#ffffff',
        borderRadius: '100px 100px 20px 20px',
        border: `2px solid ${FUSION_SG}`,
        margin: '40px 0',
        boxShadow: '0 15px 40px rgba(0,0,0,0.05)',
        position: 'relative'
      }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 600, color: '#e0aeb4', marginBottom: '20px', letterSpacing: '3px' }}>
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
            <div key={`${d}-${i}`} style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.5, color: FUSION_SG }}>{d}</div>
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
              color: d === targetDay ? 'white' : FUSION_TEXT,
              zIndex: 1,
              fontWeight: d === targetDay ? 900 : 400
            }}>
              {d === targetDay ? (
                <>
                  <div style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#e0aeb4',
                    borderRadius: '50% 50% 50% 0',
                    transform: 'rotate(-45deg)',
                    zIndex: -1,
                    top: '50%',
                    left: '50%',
                    marginTop: '-16px',
                    marginLeft: '-16px',
                  }}></div>
                  <span style={{ position: 'relative', top: '-1px' }}>{d}</span>
                </>
              ) : d}
            </div>
          ))}
        </div>

        <button
          onClick={onAdd}
          style={{
            backgroundColor: FUSION_SG,
            color: FUSION_TEXT,
            border: 'none',
            borderRadius: '50px',
            padding: '12px 30px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '2px',
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
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: '#e0aeb4', marginBottom: '30px' }}>
          Shared Dreams
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridAutoRows: '100px',
          gap: '10px',
          padding: '0 10px'
        }}>
          <div style={{ gridColumn: 'span 3', gridRow: 'span 3', position: 'relative', overflow: 'hidden', borderRadius: '100px 10px 10px 10px' }}>
            <Image src={photos[0]} alt="Collage 1" fill style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ gridColumn: 'span 3', gridRow: 'span 2', position: 'relative', overflow: 'hidden', borderRadius: '10px 100px 10px 10px' }}>
            <Image src={photos[1]} alt="Collage 2" fill style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ gridColumn: 'span 3', gridRow: 'span 3', position: 'relative', overflow: 'hidden', borderRadius: '10px 10px 10px 100px' }}>
            <Image src={photos[2]} alt="Collage 3" fill style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ gridColumn: 'span 3', gridRow: 'span 4', position: 'relative', overflow: 'hidden', borderRadius: '10px 10px 100px 10px' }}>
            <Image src={photos[3]} alt="Collage 4" fill style={{ objectFit: 'cover' }} />
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
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: '#e0aeb4', marginBottom: '30px' }}>
          Endless Love
        </h3>

        <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '50% 50% 10px 10px', overflow: 'hidden', border: `2px solid ${FUSION_SG}`, boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }}>
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
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: index === i ? '#e0aeb4' : FUSION_SG,
                opacity: index === i ? 1 : 0.5,
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

export default function FusionTemplate({ data, orderId }: { data: any, orderId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [floatingLeaves, setFloatingLeaves] = useState<{ top: string, left: string, rotate: string, size: string }[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const leaves = [...Array(12)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      rotate: `${Math.random() * 360}deg`,
      size: `${Math.random() * 30 + 20}px`
    }));
    setFloatingLeaves(leaves);
  }, []);

  if (!isMounted) return <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }} />;

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
    const dateStr = data?.eventDate ? new Date(data.eventDate).toISOString().replace(/-|:|\.\d\d\d/g, "") : "20270312T150000Z";
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}`, '_blank');
  };

  return (
    <div style={{
      backgroundColor: '#f8f1f1',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <main className="invitation-container" style={{
        position: 'relative',
        boxShadow: '0 0 60px rgba(0,0,0,0.1)',
        backgroundColor: '#fafafa',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/floral-paper.png")',
        maxWidth: '500px',
        width: '100%',
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
              borderRadius: '50%',
              backgroundColor: '#fff',
              border: `2px solid ${FUSION_SG}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
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
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")'
          }}>
             <Reveal>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ width: '30px', height: '1px', backgroundColor: FUSION_SG }}></div>
                <span style={{ fontSize: '0.8rem', letterSpacing: '3px', color: FUSION_TEXT }}>A CELEBRATION OF LOVE</span>
                <div style={{ width: '30px', height: '1px', backgroundColor: FUSION_SG }}></div>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: FUSION_TEXT, marginBottom: '40px' }}>
                {data?.brideName} & {data?.groomName}
              </h2>
              <button
                onClick={handleOpen}
                style={{
                  backgroundColor: '#e0aeb4',
                  color: 'white',
                  padding: '16px 40px',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '2px',
                  borderRadius: '50px',
                  boxShadow: '0 10px 25px rgba(224, 174, 180, 0.4)'
                }}
              >
                OPEN HEART
              </button>
            </Reveal>
          </div>
        )}

        {/* Floating Leaves */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.15 }}>
          {floatingLeaves.map((leaf, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: leaf.top,
              left: leaf.left,
              transform: `rotate(${leaf.rotate})`,
              fontSize: leaf.size,
              color: FUSION_SG
            }}>🍃</div>
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
            backgroundColor: FUSION_SG
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.4)), url(${data?.images?.heroImage || '/home_hero_bg.png'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />
            
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: FUSION_TEXT, padding: '0 20px' }}>
              <Reveal>
                <div style={{ fontSize: '0.8rem', letterSpacing: '10px', color: '#e0aeb4', marginBottom: '30px', fontWeight: 800 }}>TWO WORLDS ONE LOVE</div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '4.5rem',
                  color: FUSION_TEXT,
                  margin: 0,
                  fontStyle: 'italic',
                  lineHeight: 1.1
                }}>
                  {data?.brideName} <span style={{ color: '#e0aeb4' }}>&</span> {data?.groomName}
                </h1>
                <div style={{ height: '2px', width: '60px', backgroundColor: '#e0aeb4', margin: '40px auto' }}></div>
                <div style={{ fontSize: '1.4rem', color: FUSION_TEXT, fontWeight: 300, opacity: 0.9 }}>12.03.2027</div>
              </Reveal>
            </div>
          </div>

          <div style={{ padding: '0 20px' }}>
            <Reveal delay={100}>
              <div style={{ textAlign: 'center', padding: '60px 20px', fontStyle: 'italic', color: '#e0aeb4', fontSize: '1.2rem', fontWeight: 400 }}>
                "Where two paths cross, forever begins."
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div style={{
                padding: '60px 30px',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(5px)',
                borderRadius: '100px 100px 0 0',
                border: `1px solid ${FUSION_SG}`,
                margin: '20px 0 60px',
              }}>
                <p style={{ fontSize: '1.1rem', color: FUSION_TEXT, marginBottom: '20px', lineHeight: 1.8 }}>
                  Together with our families, we invites you to witness the union of two cultures and two hearts.
                </p>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '4rem',
                  color: '#e0aeb4',
                  margin: '20px 0',
                  lineHeight: 1
                }}>
                  Mr. Guest
                </h2>
                <p style={{ fontSize: '1.1rem', marginTop: '20px', color: FUSION_TEXT }}>
                  Your presence will make our fusion of love complete.
                </p>
              </div>
            </Reveal>

            <div style={{ position: 'relative', height: '500px', margin: '40px 0', borderRadius: '250px 250px 20px 20px', overflow: 'hidden', border: `4px solid white`, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
               <Image src={data?.images?.image1 || '/photo_2.png'} alt="Fusion 1" fill style={{ objectFit: 'cover' }} />
            </div>

            <CountdownSection data={data} />

            <WeddingCalendar onAdd={addToCalendar} data={data} />

            <PhotoCollage data={data} />

            <ItineraryTimeline data={data} />

            <section style={{ padding: '80px 0', textAlign: 'center' }}>
              <Reveal delay={200}>
                <div style={{ fontSize: '0.8rem', letterSpacing: '5px', color: '#e0aeb4', marginBottom: '20px', fontWeight: 800 }}>THE SANCTUARY</div>
                <h2 style={{ fontSize: '2.5rem', color: FUSION_TEXT, fontFamily: 'var(--font-display)', marginBottom: '10px' }}>{data?.location?.name || 'Willow Garden Pavilion'}</h2>
                <p style={{ marginBottom: '30px', color: FUSION_TEXT, opacity: 0.7 }}>{data?.location?.address || '456 Serenity Lane, Harmony Valley'}</p>

                <div style={{ height: '350px', borderRadius: '50px', overflow: 'hidden', border: `2px solid ${FUSION_SG}`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.084897042588!2d80.635832!3d7.290572!2m3!1f0!2f0!3f0!3m2!i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3662c95333f21%3A0x6a0a09e072f9602f!2sThe%20Grand%20Kandyan!5e0!3m2!1sen!2slk!4v1620000000000!5m2!1sen!2slk"
                    width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                  ></iframe>
                </div>
                <a href="#" target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-block',
                  backgroundColor: '#e0aeb4',
                  color: 'white',
                  padding: '14px 40px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textDecoration: 'none',
                  borderRadius: '50px',
                  boxShadow: '0 5px 15px rgba(224, 174, 180, 0.4)'
                }}>GET DIRECTIONS</a>
              </Reveal>
            </section>

            <PhotoCarousel data={data} />

            <RSVPFooter orderId={orderId} data={data} />
          </div>
        </div>
      </main>
    </div>
  );
}
