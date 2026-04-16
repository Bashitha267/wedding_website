'use client';

import { useState, useEffect } from 'react';
import Hero from "@/components/Hero";
import CountdownSection from "@/components/CountdownSection";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import RSVPFooter from "@/components/RSVPFooter";
import Reveal from '@/components/Reveal';
import Image from 'next/image';

const SYDNEY_NAVY = "#001f3f";
const SYDNEY_GOLD = "#c5a059";
const SYDNEY_WHITE = "#ffffff";

const WeddingCalendar = ({ onAdd, data }: { onAdd: () => void, data?: any }) => {
  const eventDate = data?.eventDate ? new Date(data.eventDate) : new Date(2026, 8, 5);
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
        backgroundColor: SYDNEY_NAVY,
        color: 'white',
        borderRadius: '20px',
        margin: '40px 0',
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${SYDNEY_GOLD}`
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', backgroundColor: SYDNEY_GOLD }} />
        
        <div style={{ fontSize: '1.4rem', fontWeight: 600, color: SYDNEY_GOLD, marginBottom: '20px', letterSpacing: '3px' }}>
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
            <div key={`${d}-${i}`} style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.5, color: SYDNEY_GOLD }}>{d}</div>
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
              color: 'white',
              zIndex: 1,
              fontWeight: d === targetDay ? 900 : 300
            }}>
              {d === targetDay ? (
                <>
                  <div style={{
                    position: 'absolute',
                    width: '35px',
                    height: '35px',
                    backgroundColor: SYDNEY_GOLD,
                    borderRadius: '5px',
                    zIndex: -1,
                    top: '50.5%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                  }}></div>
                  <span style={{ color: SYDNEY_NAVY }}>{d}</span>
                </>
              ) : d}
            </div>
          ))}
        </div>

        <button
          onClick={onAdd}
          style={{
            backgroundColor: 'transparent',
            color: SYDNEY_GOLD,
            border: `1px solid ${SYDNEY_GOLD}`,
            borderRadius: '0px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
        >
          ADD TO CALENDAR
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
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: SYDNEY_NAVY, marginBottom: '30px' }}>
          Modern Moments
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: '150px',
          gap: '10px',
          padding: '0 10px'
        }}>
          <div style={{ gridColumn: 'span 2', gridRow: 'span 2', position: 'relative', overflow: 'hidden', borderRadius: '15px', border: `1px solid #eee` }}>
            <Image src={photos[0]} alt="Collage 1" fill style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ gridColumn: 'span 2', gridRow: 'span 1', position: 'relative', overflow: 'hidden', borderRadius: '15px', border: `1px solid #eee` }}>
            <Image src={photos[1]} alt="Collage 2" fill style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ gridColumn: 'span 1', gridRow: 'span 1', position: 'relative', overflow: 'hidden', borderRadius: '15px', border: `1px solid #eee` }}>
            <Image src={photos[2]} alt="Collage 3" fill style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ gridColumn: 'span 1', gridRow: 'span 1', position: 'relative', overflow: 'hidden', borderRadius: '15px', border: `1px solid #eee` }}>
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
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: SYDNEY_NAVY, marginBottom: '30px' }}>
          Our Love Story
        </h3>

        <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '25px', overflow: 'hidden', border: `1px solid ${SYDNEY_GOLD}`, boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }}>
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
                borderRadius: '5px',
                backgroundColor: index === i ? SYDNEY_GOLD : '#ccc',
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

export default function SydneyTemplate({ data, orderId }: { data: any, orderId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [floatingDots, setFloatingDots] = useState<{ top: string, left: string, size: string }[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const dots = [...Array(15)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 10 + 5}px`
    }));
    setFloatingDots(dots);
  }, []);

  if (!isMounted) return <div style={{ minHeight: '100vh', backgroundColor: SYDNEY_WHITE }} />;

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
    const dateStr = data?.eventDate ? new Date(data.eventDate).toISOString().replace(/-|:|\.\d\d\d/g, "") : "20260905T150000Z";
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}`, '_blank');
  };

  return (
    <div style={{
      backgroundColor: '#000814',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <main className="invitation-container" style={{
        position: 'relative',
        boxShadow: '0 0 100px rgba(0,0,0,0.8)',
        backgroundColor: SYDNEY_WHITE,
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
              backgroundColor: SYDNEY_WHITE,
              border: `2px solid ${SYDNEY_GOLD}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
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
            backgroundImage: `linear-gradient(rgba(0,31,63,0.9), rgba(0,31,63,0.9)), url(${data?.images?.gallery?.[0] || '/home_hero_bg.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px',
            color: 'white'
          }}>
             <Reveal>
              <div style={{ fontSize: '0.9rem', letterSpacing: '8px', color: SYDNEY_GOLD, marginBottom: '20px' }}>YOU ARE INVITED TO THE WEDDING OF</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', marginBottom: '40px' }}>
                {data?.brideName} & {data?.groomName}
              </h2>
              <button
                onClick={handleOpen}
                style={{
                  backgroundColor: SYDNEY_GOLD,
                  color: SYDNEY_NAVY,
                  padding: '15px 45px',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  letterSpacing: '3px',
                  borderRadius: '0px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
              >
                VIEW INVITATION
              </button>
            </Reveal>
          </div>
        )}

        {/* Floating Decorative Dots */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.1 }}>
          {floatingDots.map((dot, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              backgroundColor: SYDNEY_GOLD,
              borderRadius: '50%',
              boxShadow: `0 0 10px ${SYDNEY_GOLD}`
            }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* High Impact Hero Section */}
          <div style={{
            position: 'relative',
            minHeight: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: SYDNEY_NAVY
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(rgba(0,31,63,0.3), rgba(0,31,63,0.6)), url(${data?.images?.heroImage || '/home_hero_bg.png'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />
            
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'white', padding: '0 20px' }}>
              <Reveal>
                <div style={{ fontSize: '0.9rem', letterSpacing: '10px', color: SYDNEY_GOLD, marginBottom: '20px', fontWeight: 600 }}>TOGETHER WITH THEIR FAMILIES</div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '5.5rem',
                  color: 'white',
                  margin: 0,
                  textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  lineHeight: 1
                }}>
                  {data?.brideName}
                </h1>
                <div style={{ fontSize: '3rem', color: SYDNEY_GOLD, margin: '10px 0', fontStyle: 'italic' }}>&</div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '5.5rem',
                  color: 'white',
                  margin: 0,
                  textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  lineHeight: 1
                }}>
                  {data?.groomName}
                </h1>
                <div style={{ height: '1px', width: '100px', backgroundColor: SYDNEY_GOLD, margin: '40px auto' }}></div>
                <div style={{ fontSize: '1.2rem', letterSpacing: '5px', fontWeight: 300, opacity: 0.9 }}>SEPTEMBER 05, 2026</div>
              </Reveal>
            </div>
          </div>

          <div style={{ padding: '0 20px' }}>
            <Reveal delay={100}>
              <div style={{ textAlign: 'center', padding: '60px 20px', fontStyle: 'italic', color: SYDNEY_NAVY, fontSize: '1.2rem', opacity: 0.8 }}>
                "Love is written in the stars, but anchored in the soul."
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div style={{
                padding: '60px 30px',
                textAlign: 'center',
                backgroundColor: 'rgba(0, 31, 63, 0.02)',
                border: `1px solid #f0f0f0`,
                margin: '20px 0 60px',
                position: 'relative',
                borderRadius: '15px'
              }}>
                <div style={{ fontSize: '0.9rem', letterSpacing: '5px', textTransform: 'uppercase', color: SYDNEY_GOLD, fontWeight: 700, marginBottom: '30px' }}>
                  The Pleasure of your company
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '4.5rem',
                  color: SYDNEY_NAVY,
                  margin: '20px 0',
                  lineHeight: 1
                }}>
                  Mr. Guest
                </h2>
                <div style={{ height: '1px', width: '50px', backgroundColor: SYDNEY_GOLD, margin: '30px auto' }}></div>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: SYDNEY_NAVY, opacity: 0.8 }}>
                  Is requested at the marriage of our beloved children. <br />
                  Join us for an evening of elegance and celebration.
                </p>
              </div>
            </Reveal>

            <div style={{ display: 'flex', gap: '15px', margin: '40px 0' }}>
               <div style={{ flex: 1, height: '350px', position: 'relative', borderRadius: '10px', overflow: 'hidden' }}>
                  <Image src={data?.images?.image1 || '/photo_2.png'} alt="Sydney 1" fill style={{ objectFit: 'cover' }} />
               </div>
               <div style={{ flex: 1, height: '350px', position: 'relative', borderRadius: '10px', overflow: 'hidden', marginTop: '40px' }}>
                  <Image src={data?.images?.image2 || '/photo_3.png'} alt="Sydney 2" fill style={{ objectFit: 'cover' }} />
               </div>
            </div>

            <CountdownSection data={data} />

            <WeddingCalendar onAdd={addToCalendar} data={data} />

            <PhotoCollage data={data} />

            <ItineraryTimeline data={data} />

            <section style={{ padding: '80px 0', textAlign: 'center' }}>
              <Reveal delay={200}>
                <div style={{ fontSize: '0.9rem', letterSpacing: '5px', color: SYDNEY_GOLD, marginBottom: '20px', fontWeight: 700 }}>THE VENUE</div>
                <h2 style={{ fontSize: '2.5rem', color: SYDNEY_NAVY, fontFamily: 'var(--font-display)', marginBottom: '10px' }}>{data?.location?.name || 'The Harbor Grand'}</h2>
                <p style={{ marginBottom: '30px', color: SYDNEY_NAVY, opacity: 0.7 }}>{data?.location?.address || 'Circular Quay, Sydney NSW 2000'}</p>

                <div style={{ height: '350px', borderRadius: '15px', overflow: 'hidden', border: `1px solid #eee`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.084897042588!2d80.635832!3d7.290572!2m3!1f0!2f0!3f0!3m2!i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3662c95333f21%3A0x6a0a09e072f9602f!2sThe%20Grand%20Kandyan!5e0!3m2!1sen!2slk!4v1620000000000!5m2!1sen!2slk"
                    width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                  ></iframe>
                </div>
                <a href="#" target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-block',
                  backgroundColor: SYDNEY_NAVY,
                  color: 'white',
                  padding: '14px 40px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '3px',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  borderRadius: '5px'
                }}>NAVIGATE TO VENUE</a>
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
