'use client';

import { useState, useEffect } from 'react';
import Hero from "@/components/Hero";
import CountdownSection from "@/components/CountdownSection";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import RSVPFooter from "@/components/RSVPFooter";
import Reveal from '@/components/Reveal';
import Image from 'next/image';

const KANDYAN_GOLD = "#d4af37";
const KANDYAN_RED = "#8a0303";

const WeddingCalendar = ({ onAdd, data }: { onAdd: () => void, data?: any }) => {
  const eventDate = data?.eventDate ? new Date(data.eventDate) : new Date(2026, 11, 15);
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
        backgroundColor: '#fffcf2',
        border: `3px double ${KANDYAN_GOLD}`,
        borderRadius: '20px',
        margin: '40px 0',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 600, color: KANDYAN_GOLD, marginBottom: '20px', letterSpacing: '3px' }}>
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
            <div key={`${d}-${i}`} style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.6, color: KANDYAN_RED }}>{d}</div>
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
              color: d === targetDay ? 'white' : KANDYAN_RED,
              zIndex: 1,
              fontWeight: d === targetDay ? 900 : 500
            }}>
              {d === targetDay ? (
                <>
                  <span style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    color: KANDYAN_GOLD,
                    zIndex: -1,
                    top: '48%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.8
                  }}>❤</span>
                  <span style={{ color: 'white' }}>{d}</span>
                </>
              ) : d}
            </div>
          ))}
        </div>

        <button
          onClick={onAdd}
          style={{
            backgroundColor: KANDYAN_RED,
            color: 'white',
            border: `1px solid ${KANDYAN_GOLD}`,
            borderRadius: '0px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '2px',
            boxShadow: 'inset 0 0 10px rgba(212, 175, 55, 0.3)'
          }}
        >
          ADD TO CALENDAR
        </button>
      </div>
    </Reveal>
  );
};



const KandyanPhotoLayout = ({ data }: { data?: any }) => {
  const images = [
    data?.images?.image1 || '/photo_2.png',
    data?.images?.gallery?.[0] || '/photo_3.png',
    data?.images?.gallery?.[1] || '/photo_4.png'
  ];

  return (
    <div style={{ position: 'relative', padding: '100px 20px', margin: '40px 0' }}>
      <Reveal>
        <div style={{ position: 'relative', width: '100%', height: '500px', overflow: 'hidden' }}>
          {/* Main Blended Photo */}
          <div style={{ 
              position: 'absolute', 
              inset: 0, 
              zIndex: 1,
              maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          }}>
            <Image src={images[0]} alt="Our Love" fill style={{ objectFit: 'cover' }} />
          </div>
          
          {/* Top Left Floating Photo */}
          <div style={{ 
              position: 'absolute', 
              top: '-40px', 
              left: '0', 
              width: '180px', 
              height: '220px', 
              zIndex: 5, 
              border: `4px solid white`,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transform: 'rotate(-5deg)',
              overflow: 'hidden',
              backgroundColor: 'white'
          }}>
            <div style={{ position: 'absolute', inset: '5px', border: `1px solid ${KANDYAN_GOLD}`, overflow: 'hidden' }}>
                <Image src={images[1]} alt="Moment 1" fill style={{ objectFit: 'cover' }} />
            </div>
          </div>

          {/* Bottom Right Floating Photo */}
          <div style={{ 
              position: 'absolute', 
              bottom: '20px', 
              right: '0', 
              width: '200px', 
              height: '200px', 
              zIndex: 5, 
              border: `4px solid white`,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transform: 'rotate(8deg)',
              overflow: 'hidden',
              backgroundColor: 'white'
          }}>
            <div style={{ position: 'absolute', inset: '5px', border: `1px solid ${KANDYAN_GOLD}`, overflow: 'hidden' }}>
                <Image src={images[2]} alt="Moment 2" fill style={{ objectFit: 'cover' }} />
            </div>
          </div>

          {/* Ornamental Background element */}
          <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '200px', height: '200px', opacity: 0.1, zIndex: 0 }}>
             <Image src="/dancing.png" alt="Dance" fill style={{ objectFit: 'contain' }} />
          </div>
        </div>
      </Reveal>
    </div>
  );
};

const KandyanCountdown = ({ data }: { data?: any }) => {
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

  const units = [
    { label: 'Days', val: timeLeft.days },
    { label: 'Hrs', val: timeLeft.hours },
    { label: 'Min', val: timeLeft.minutes },
    { label: 'Sec', val: timeLeft.seconds }
  ];

  return (
    <Reveal delay={200}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', margin: '60px 0' }}>
        {units.map(u => (
          <div key={u.label} style={{
            backgroundColor: KANDYAN_RED,
            border: `2px solid ${KANDYAN_GOLD}`,
            boxShadow: `4px 4px 0px ${KANDYAN_GOLD}`,
            width: '80px',
            padding: '15px 5px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1, fontFamily: 'serif' }}>{u.val.toString().padStart(2, '0')}</div>
            <div style={{ fontSize: '0.65rem', color: KANDYAN_GOLD, fontWeight: 700, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>{u.label}</div>
          </div>
        ))}
      </div>
    </Reveal>
  );
};


export default function KandyanTemplate({ data, orderId }: { data: any, orderId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dancingPositions, setDancingPositions] = useState<{ top: string, left: string, width: string, height: string, rotate: string }[]>([]);

  useEffect(() => {
    setIsMounted(true);
    // Generate positions only on client-side to avoid hydration mismatch
    const positions = [...Array(24)].map((_, i) => ({
      top: `${(i * 4) + (Math.random() * 4)}%`,
      left: `${(i % 2 === 0 ? -5 : 75) + (Math.random() * 15)}%`,
      width: `${150 + Math.random() * 100}px`,
      height: `${180 + Math.random() * 120}px`,
      rotate: `${Math.random() * 40 - 20}deg`,
    }));
    setDancingPositions(positions);
  }, []);

  if (!isMounted) return <div style={{ minHeight: '100vh', backgroundColor: '#fffcf2' }} />;

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
    const startStr = data?.eventDate
      ? new Date(data.eventDate).toISOString().replace(/-|:|\.\d\d\d/g, "")
      : "20261215T150000Z";
    const dates = `${startStr}/${startStr}`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#111',
      display: 'flex',
      justifyContent: 'center',
      overflowX: 'hidden'
    }}>
      {/* Blurred Background for Desktop */}
      <div 
        className="desktop-only"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${data?.images?.heroImage || '/home_hero_bg.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(30px) brightness(0.3)',
          transform: 'scale(1.1)',
          zIndex: 0
        }} 
      />

      <main className="invitation-container" style={{
        position: 'relative',
        zIndex: 1,
        backgroundColor: '#fffcf2',
        boxShadow: '0 0 100px rgba(0,0,0,0.6)',
        width: '100%',
        maxWidth: '450px',
        minHeight: '100vh',
        borderLeft: `2px solid ${KANDYAN_GOLD}`,
        borderRight: `2px solid ${KANDYAN_GOLD}`,
        overflow: 'hidden'
      }}>
        <style jsx global>{`
          @media (min-width: 600px) {
            .desktop-only { display: block !important; }
          }
          @media (max-width: 600px) {
            .desktop-only { display: none !important; }
            .invitation-container { border-left: none !important; border-right: none !important; max-width: 100% !important; }
          }
          .font-display { font-family: var(--font-alex-brush) !important; }
        `}</style>
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
              backgroundColor: 'white',
              border: `2px solid ${KANDYAN_GOLD}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1.2rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
          >
            {isMuted ? '🔇' : '🎵'}
          </button>
        )}

        {/* Welcome Screen / Cover */}
        <div 
          onClick={handleOpen} 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: '#fffcf2',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px',
            cursor: 'pointer',
            overflow: 'hidden',
            transition: 'transform 1.5s cubic-bezier(0.87, 0, 0.13, 1)',
            transform: isOpen ? 'translateY(100%)' : 'translateY(0)',
            pointerEvents: isOpen ? 'none' : 'auto'
          }}
        >
           {/* Decorative Background for Welcome Screen */}
           <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none', zIndex: 0 }}>
              <div style={{ position: 'absolute', top: '10%', left: '5%', width: '150px', height: '200px' }}>
                <Image src="/dancing.png" alt="Dance" fill style={{ objectFit: 'contain' }} />
              </div>
              <div style={{ position: 'absolute', top: '15%', right: '5%', width: '120px', height: '180px', transform: 'scaleX(-1)' }}>
                <Image src="/dancing.png" alt="Dance" fill style={{ objectFit: 'contain' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '20%', left: '10%', width: '130px', height: '190px', transform: 'rotate(10deg)' }}>
                <Image src="/dancing.png" alt="Dance" fill style={{ objectFit: 'contain' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '25%', right: '10%', width: '140px', height: '210px', transform: 'rotate(-10deg) scaleX(-1)' }}>
                <Image src="/dancing.png" alt="Dance" fill style={{ objectFit: 'contain' }} />
              </div>
           </div>

           <div style={{ position: 'relative', zIndex: 1 }}>
            <Reveal>
                <div style={{ fontSize: '1rem', letterSpacing: '8px', color: KANDYAN_GOLD, marginBottom: '20px', fontWeight: 600 }}>THE ROYAL WEDDING OF</div>
                <h1 style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: '5rem', 
                    color: KANDYAN_RED, 
                    marginBottom: '10px',
                    lineHeight: 1.1
                }}>
                    {data?.brideName || 'Sarah'} & {data?.groomName || 'Mark'}
                </h1>
                <div style={{ height: '2px', width: '80px', backgroundColor: KANDYAN_GOLD, margin: '20px auto' }}></div>
                <div style={{ fontSize: '0.9rem', letterSpacing: '4px', textTransform: 'uppercase', color: KANDYAN_GOLD, fontWeight: 700 }}>
                    You are invited to witness our love
                </div>
            </Reveal>
           </div>

            <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0, zIndex: 2 }}>
              <Reveal delay={800}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', position: 'relative', opacity: 0.6 }} className="bounce-soft">
                        <Image src="/dancing.png" alt="Icon" fill style={{ objectFit: 'contain' }} />
                    </div>
                    <button
                        onClick={handleOpen}
                        style={{
                            backgroundColor: KANDYAN_RED,
                            color: 'white',
                            padding: '16px 45px',
                            border: `2px solid ${KANDYAN_GOLD}`,
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            letterSpacing: '3px',
                            boxShadow: '0 10px 25px rgba(138, 3, 3, 0.3)',
                            textTransform: 'uppercase'
                        }}
                    >
                        TAP TO OPEN
                    </button>
                </div>
              </Reveal>
            </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, padding: '20px' }}>
          {/* Hero Section with Full Screen Background */}
          <div style={{
            position: 'relative',
            height: '100vh',
            margin: '-20px -20px 40px -20px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000'
          }}>
            {/* Main Photo Background - Original Colors, High Impact */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${data?.images?.heroImage || '/home_hero_bg.png'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />

            {/* Gradient Overlay for Text Visibility */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.6) 100%)',
              zIndex: 2
            }} />

            {/* Hero Content */}
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'white', padding: '0 20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '6.5rem',
                  color: 'white',
                  margin: 0,
                  textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                  lineHeight: 1.2,
                  padding: '10px 0'
                }}>
                  {data?.brideName || 'Sarah'}
                </h1>

                <span style={{
                  fontFamily: 'serif',
                  fontSize: '6rem',
                  color: KANDYAN_GOLD,
                  margin: '-10px 0',
                  opacity: 0.9,
                  fontStyle: 'italic',
                  textShadow: '0 0 20px rgba(212, 175, 55, 0.5)'
                }}>&</span>

                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '6.5rem',
                  color: 'white',
                  margin: 0,
                  textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                  lineHeight: 1.2,
                  padding: '10px 0'
                }}>
                  {data?.groomName || 'Mark'}
                </h1>

                <div style={{ height: '3px', width: '150px', backgroundColor: KANDYAN_GOLD, margin: '30px auto', boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }}></div>

                <p style={{
                  fontSize: '1.4rem',
                  letterSpacing: '10px',
                  fontWeight: 300,
                  opacity: 1,
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                  textTransform: 'uppercase'
                }}>
                  The Royal Wedding
                </p>
              </div>
            </div>



          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Random Appearing Dancing Images in Body Sections */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
              {dancingPositions.map((pos, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  top: pos.top,
                  left: pos.left,
                  width: pos.width,
                  height: pos.height,
                  opacity: 0.2,
                  transform: `rotate(${pos.rotate})`,
                }}>
                  <Image src="/dancing.png" alt="Dancing" fill style={{ objectFit: 'contain' }} />
                </div>
              ))}
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <Reveal delay={100}>
                <div style={{ textAlign: 'center', padding: '40px 10px', fontStyle: 'italic', color: KANDYAN_GOLD, marginBottom: '30px', fontSize: '1.2rem' }}>
                  "Two souls with but a single thought, two hearts that beat as one."
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div style={{
                  padding: '60px 40px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(212, 175, 55, 0.05)',
                  borderRadius: '50px',
                  margin: '40px 0',
                  position: 'relative',
                  overflow: 'hidden',
                  border: `1px solid ${KANDYAN_GOLD}`,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 1, color: KANDYAN_RED, marginBottom: '20px', fontWeight: 500 }}>
                      With hearts full of love and happiness, we are delighted to announce our wedding!
                    </p>
                    <div style={{ fontSize: '1rem', letterSpacing: '3px', textTransform: 'uppercase', opacity: 1, marginBottom: '20px', color: KANDYAN_GOLD, fontWeight: 700 }}>
                      We would be honoured to have
                    </div>

                    <h2 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '4.8rem',
                      color: KANDYAN_RED,
                      margin: '15px 0',
                      lineHeight: 0.9,
                      textShadow: '1px 1px 0px rgba(212, 175, 55, 0.3)'
                    }}>
                      Mr. Guest
                    </h2>

                    <p style={{ fontSize: '1.1rem', marginTop: '20px', color: KANDYAN_RED, opacity: 1, fontWeight: 500 }}>
                      join us as we celebrate this precious milestone.
                    </p>

                    <div style={{ height: '2px', width: '60px', backgroundColor: KANDYAN_GOLD, margin: '30px auto' }}></div>

                    <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: KANDYAN_RED, maxWidth: '300px', margin: '0 auto', opacity: 1, fontWeight: 500 }}>
                      Please save the date for a day filled with joy, laughter, and everlasting memories. Your presence will make our day truly complete.
                    </p>
                  </div>
                </div>
              </Reveal>

              <KandyanPhotoLayout data={data} />

              <Reveal delay={200}>
                <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '60px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: KANDYAN_RED, marginBottom: '5px' }}>Counting Every Second</h3>
                  <p style={{ fontSize: '0.9rem', letterSpacing: '6px', color: KANDYAN_GOLD, fontWeight: 700, textTransform: 'uppercase' }}>Until We Say I Do</p>
                  <div style={{ height: '1px', width: '50px', backgroundColor: KANDYAN_GOLD, margin: '15px auto 0' }}></div>
                </div>
              </Reveal>

              <KandyanCountdown data={data} />

              <WeddingCalendar onAdd={addToCalendar} data={data} />

              <ItineraryTimeline data={data} />

              {/* Location Section */}
              <section style={{ padding: '40px 0', textAlign: 'center' }}>
                  <Reveal delay={200}>
                    <div style={{ fontSize: '1rem', letterSpacing: '4px', color: KANDYAN_GOLD, marginBottom: '15px', fontWeight: 700 }}>LOCATION</div>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '10px', color: KANDYAN_RED, fontFamily: 'var(--font-display)' }}>{data?.location?.name || 'Grand Kandyan Hotel'}</h2>
                    <p style={{ marginBottom: '25px', color: KANDYAN_RED, opacity: 0.8, fontSize: '1rem' }}>{data?.location?.address || 'Kandy, Sri Lanka'}</p>

                    <div style={{ height: '300px', borderRadius: '20px', overflow: 'hidden', border: `2px solid ${KANDYAN_GOLD}`, boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.084897042588!2d80.635832!3d7.290572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3662c95333f21%3A0x6a0a09e072f9602f!2sThe%20Grand%20Kandyan!5e0!3m2!1sen!2slk!4v1620000000000!5m2!1sen!2slk"
                        width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                      ></iframe>
                    </div>
                    <a href="https://maps.app.goo.gl/v3Y3v6kAn9ZqXpGMA" target="_blank" rel="noopener noreferrer" style={{ 
                        display: 'inline-block',
                        backgroundColor: KANDYAN_RED, 
                        color: 'white', 
                        padding: '12px 35px', 
                        fontSize: '1rem', 
                        fontWeight: 700, 
                        letterSpacing: '2px',
                        border: `1px solid ${KANDYAN_GOLD}`,
                        textDecoration: 'none'
                    }}>VIEW ON MAP</a>
                  </Reveal>
              </section>

              <PhotoCarousel data={data} />

              <RSVPFooter orderId={orderId} data={data} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

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
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: KANDYAN_RED, marginBottom: '30px' }}>
          Our Love Story
        </h3>

        <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '25px', overflow: 'hidden', border: `3px solid ${KANDYAN_GOLD}`, boxShadow: '0 15px 40px rgba(0,0,0,0.15)' }}>
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
                backgroundColor: index === i ? KANDYAN_RED : KANDYAN_GOLD,
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
