'use client';

import { useState, useEffect } from 'react';
import Reveal from '@/components/Reveal';
import Image from 'next/image';
import ItineraryTimeline from "@/components/ItineraryTimeline";
import RSVPFooter from "@/components/RSVPFooter";

const MUSIC_URL = "https://res.cloudinary.com/dnfbik3if/video/upload/v1775201422/krasnoshchok-wedding-romantic-love-music-409293_ikekwk.mp3";
const DECO_IMAGE = "/sage_leaves.png";

const FloatingDeco = ({ style }: { style: React.CSSProperties }) => (
  <div style={{ position: 'absolute', width: '130px', height: '130px', pointerEvents: 'none', zIndex: 10, opacity: 0.6, ...style }}>
    <Image src={DECO_IMAGE} alt="botanical-deco" fill style={{ objectFit: 'contain' }} />
  </div>
);

const InvitationEnvelope = ({ onOpen, isOpen }: { onOpen: () => void, isOpen: boolean }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        transition: 'all 1.5s cubic-bezier(0.87, 0, 0.13, 1)',
        transform: isOpen ? 'scale(1.2) translateY(-100%)' : 'scale(1) translateY(0)',
        opacity: isOpen ? 0 : 1,
        cursor: 'pointer',
        backgroundImage: 'url("/earthy_envelope.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      onClick={onOpen}
    >
      <div style={{
        position: 'absolute',
        bottom: '15vh',
        textAlign: 'center',
        width: '100%',
        color: 'var(--earthy-brown)',
        zIndex: 2
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '4.5rem',
          marginBottom: '15px',
          textShadow: '0 4px 20px rgba(255,255,255,0.8)'
        }}>
          Invitation
        </div>
        <div className="bounce-soft" style={{
          fontSize: '0.9rem',
          letterSpacing: '5px',
          opacity: 0.8,
          fontWeight: 700
        }}>
          TAP TO OPEN
        </div>
      </div>
      {/* Soft gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to top, rgba(255,255,255,0.4) 0%, transparent 40%)',
        zIndex: 1
      }} />
    </div>
  );
};

const Decoration = () => (
  <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0', opacity: 0.8, position: 'relative', zIndex: 11 }}>
    <Image src={DECO_IMAGE} alt="decoration" width={100} height={100} style={{ objectFit: 'contain' }} />
  </div>
);

const SectionImage = ({ src, alt, height = "250px", delay = 200 }: { src: string, alt: string, height?: string, delay?: number }) => (
  <Reveal delay={delay}>
    <div style={{
      height,
      width: '100%',
      position: 'relative',
      borderRadius: '25px',
      overflow: 'hidden',
      margin: '40px 0',
      boxShadow: '0 15px 45px rgba(0,0,0,0.06)',
      zIndex: 2
    }}>
      <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} />
    </div>
  </Reveal>
);

const EarthyHero = ({ data }: { data: any }) => (
  <section style={{
    height: '85vh',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'var(--earthy-cream)',
    backgroundImage: `url("${data?.images?.heroImage || '/home_hero_bg.png'}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  }}>
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.3)',
      zIndex: 1
    }} />

    <div style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
      <Reveal delay={200}>
        <div style={{ fontSize: '0.9rem', letterSpacing: '10px', color: 'var(--earthy-brown)', marginBottom: '30px', fontWeight: 800 }}>OUR WEDDING</div>
        <h1 style={{
          fontSize: '5.5rem',
          lineHeight: 1,
          fontFamily: 'var(--font-display)',
          color: 'var(--earthy-brown)',
          marginBottom: '30px',
          textShadow: '0 5px 20px rgba(255,255,255,0.5)'
        }}>
          {data?.brideName || 'Sarah'} & {data?.groomName || 'Mark'}
        </h1>
      </Reveal>

      <Reveal delay={400}>
        <div style={{
          fontSize: '1.4rem',
          color: 'var(--earthy-text)',
          letterSpacing: '6px',
          fontWeight: 700,
          backgroundImage: 'linear-gradient(to right, transparent, var(--earthy-tan), transparent)',
          padding: '15px 50px',
          borderRadius: '50px'
        }}>
          {data?.eventDate ? new Date(data.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() : 'AUGUST 24, 2026'}
        </div>
      </Reveal>
    </div>

    <div style={{
      position: 'absolute',
      bottom: '-1px',
      left: 0,
      width: '100%',
      height: '60px',
      zIndex: 3,
      backgroundColor: 'var(--earthy-cream)',
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 30%, 98% 45%, 95% 35%, 92% 50%, 88% 30%, 85% 45%, 82% 35%, 78% 50%, 75% 30%, 72% 45%, 68% 35%, 65% 50%, 62% 30%, 58% 45%, 55% 35%, 52% 50%, 48% 30%, 45% 45%, 42% 35%, 38% 50%, 35% 30%, 32% 45%, 28% 35%, 25% 50%, 22% 30%, 18% 45%, 15% 35%, 12% 50%, 8% 30%, 5% 45%, 2% 35%, 0% 50%)'
    }} />
  </section>
);

const EarthyCountdown = ({ data }: { data: any }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = data?.eventDate ? new Date(data.eventDate).getTime() : new Date('2026-08-24T15:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <section style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: 'var(--earthy-cream)', position: 'relative' }}>
      <FloatingDeco style={{ bottom: '20px', left: '-50px', transform: 'rotate(30deg)', opacity: 0.3 }} />
      <Reveal delay={200}>
        <div style={{ fontSize: '0.9rem', letterSpacing: '8px', color: 'var(--earthy-accent)', marginBottom: '40px', fontWeight: 800 }}>COUNTDOWN</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
          {[{ l: 'DAYS', v: timeLeft.days }, { l: 'HRS', v: timeLeft.hours }, { l: 'MIN', v: timeLeft.minutes }, { l: 'SEC', v: timeLeft.seconds }].map((t, i) => (
            <div key={t.l} style={{ width: '80px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 200, color: 'var(--earthy-brown)', position: 'relative' }}>
                {t.v.toString().padStart(2, '0')}
                <div style={{ position: 'absolute', bottom: '-5px', left: '20%', right: '20%', height: '1px', backgroundColor: 'var(--earthy-accent)', opacity: 0.4 }}></div>
              </div>
              <div style={{ fontSize: '0.7rem', marginTop: '15px', color: 'var(--earthy-accent)', letterSpacing: '3px', fontWeight: 600 }}>{t.l}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
};

const AnnouncementBox = ({ data }: { data: any }) => (
  <Reveal delay={200}>
    <div style={{
      padding: '100px 40px',
      textAlign: 'center',
      backgroundColor: 'var(--earthy-tan)',
      borderRadius: '60px',
      margin: '60px 0',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.02)',
      color: 'var(--earthy-text)',
      border: '1px solid white'
    }}>
      <FloatingDeco style={{ top: '-40px', right: '-40px', transform: 'rotate(45deg)', opacity: 0.4 }} />

      <p style={{ fontSize: '1.25rem', lineHeight: 2, opacity: 0.9, marginBottom: '40px', fontStyle: 'italic' }}>
        With hearts full of love and happiness, we are delighted to announce our wedding!
      </p>
      <div style={{ fontSize: '1rem', letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '25px', fontWeight: 600 }}>
        We would be honoured to have
      </div>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '5rem',
        color: 'var(--earthy-brown)',
        margin: '15px 0',
        lineHeight: 0.9,
        fontWeight: 400
      }}>
        Mr. Guest
      </h2>
      <p style={{ fontSize: '1.2rem', marginTop: '35px', opacity: 0.9 }}>
        join us as we celebrate this precious milestone.
      </p>
      <div style={{ height: '2px', width: '60px', backgroundColor: 'var(--earthy-accent)', margin: '50px auto', opacity: 0.3 }}></div>
      <p style={{ fontSize: '1.1rem', lineHeight: 2, opacity: 0.8, maxWidth: '340px', margin: '0 auto' }}>
        Please save the date for a day filled with joy, laughter, and everlasting memories. Your presence will make our day truly complete.
      </p>
    </div>
  </Reveal>
);

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
      <div style={{ padding: '80px 0', textAlign: 'center', position: 'relative' }}>
        <FloatingDeco style={{ bottom: '40px', left: '-50px', transform: 'rotate(-45deg)', opacity: 0.4 }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: 'var(--earthy-brown)', marginBottom: '40px', fontWeight: 400 }}>
          Ever After Begins
        </h3>
        <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
          <Image src={photos[index]} alt="Wedding Moment" fill style={{ objectFit: 'cover' }} key={index} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '35px' }}>
          {photos.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: index === i ? '35px' : '10px',
                height: '10px',
                borderRadius: '5px',
                backgroundColor: index === i ? 'var(--earthy-accent)' : '#bccca3',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                opacity: index === i ? 1 : 0.7,
                boxShadow: index === i ? '0 4px 12px rgba(138, 154, 91, 0.3)' : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
};

const EarthyCalendar = ({ data }: { data: any }) => {
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
      <div style={{ padding: '70px 30px', textAlign: 'center', backgroundColor: 'var(--earthy-tan)', borderRadius: '40px', margin: '60px 0', boxShadow: '0 20px 60px rgba(0,0,0,0.02)', position: 'relative', border: '1px solid white' }}>
        <FloatingDeco style={{ top: '-40px', right: '-40px', transform: 'rotate(20deg)', opacity: 0.5 }} />

        <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: 'var(--earthy-brown)', marginBottom: '15px', fontWeight: 400 }}>Save the Date</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--earthy-text)', marginBottom: '40px', letterSpacing: '5px' }}>{monthName} {year}</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '15px', maxWidth: '340px', margin: '0 auto 10px' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={`${d}-${i}`} style={{ fontSize: '0.8rem', fontWeight: 800, opacity: 0.4, color: 'var(--earthy-brown)' }}>{d}</div>
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
                color: d === targetDay ? 'white' : 'inherit', 
                fontWeight: d === targetDay ? 800 : 500 
            }}>
              {d === targetDay && (
                <div style={{ 
                    position: 'absolute', 
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.8rem', 
                    color: 'var(--earthy-accent)', 
                    zIndex: 1, 
                    pointerEvents: 'none',
                    lineHeight: 1
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

export default function EarthyTemplate({ data, orderId }: { data: any, orderId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) { audio.muted = !isMuted; setIsMuted(!isMuted); }
  };

  const handleOpen = () => {
    setIsOpen(true);
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) { audio.play().catch(e => console.log("Audio play blocked", e)); }
  };

  return (
    <div style={{
      backgroundColor: '#f8f9f8',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
      backgroundAttachment: 'fixed'
    }}>
      <main className="invitation-container earthy-theme" style={{ position: 'relative', backgroundColor: 'var(--earthy-cream)', boxShadow: '0 0 80px rgba(0,0,0,0.08)' }}>
        <style jsx global>{`
                    .earthy-theme .subheading { color: var(--earthy-accent) !important; font-weight: 800 !important; letter-spacing: 5px !important; }
                    .earthy-theme .itinerary-section { background-color: var(--earthy-cream) !important; }
                    .earthy-theme footer { background-color: var(--earthy-tan) !important; border-top: 1px solid white; }
                    .earthy-theme .btn-primary { 
                        background-color: var(--earthy-brown) !important; 
                        border-radius: 50px !important; 
                        font-weight: 700 !important;
                        box-shadow: 0 8px 25px rgba(62, 74, 62, 0.2) !important;
                    }
                    .earthy-theme .btn-outline { border-radius: 50px !important; border-color: var(--earthy-accent) !important; color: var(--earthy-brown) !important; }
                    .earthy-theme footer div[style*="fontFamily: var(--font-display)"] { 
                        color: white !important; 
                        text-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 0 30px rgba(138, 154, 91, 0.5) !important; 
                    }
                    .earthy-theme footer div[style*="color: var(--rose-vibrant)"] { color: var(--earthy-accent) !important; filter: brightness(1.2); }
                    .earthy-theme footer div[style*="backgroundColor: var(--rose-light)"] { background-color: var(--earthy-cream) !important; color: var(--earthy-brown) !important; border: 1px solid var(--earthy-accent); }
                `}</style>

        <audio id="bg-music" loop>
          <source src={data?.musicUrl || MUSIC_URL} type="audio/mpeg" />
        </audio>

        <InvitationEnvelope isOpen={isOpen} onOpen={handleOpen} />

        {isOpen && (
          <div style={{ width: '100%' }}>
            <button onClick={toggleMusic} style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 2000, width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid var(--earthy-accent)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.3rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
              {isMuted ? '🔇' : '🎵'}
            </button>

            <EarthyHero data={data} />

            <div style={{ padding: '60px 25px' }}>
              <Reveal delay={100}>
                <div style={{ textAlign: 'center', padding: '0 20px', fontStyle: 'italic', color: 'var(--earthy-accent)', marginBottom: '50px', fontSize: '1.2rem', lineHeight: 1.8 }}>
                  "Two souls with but a single thought,<br />two hearts that beat as one."
                </div>
              </Reveal>

              <Decoration />

              <EarthyCountdown data={data} />

              <FloatingDeco style={{ top: '150vh', right: '-30px', transform: 'rotate(15deg)', zIndex: 5 }} />

              <AnnouncementBox data={data} />

              <FloatingDeco style={{ top: '220vh', left: '-40px', transform: 'rotate(-25deg)', zIndex: 5 }} />

              <SectionImage src={data?.images?.image1 || "/photo_2.png"} alt="Engagement" height="400px" delay={400} />

              <div className="itinerary-wrapper" style={{ margin: '60px -5px' }}>
                <ItineraryTimeline data={data} />
              </div>

              <FloatingDeco style={{ top: '300vh', right: '-20px', transform: 'rotate(45deg)', zIndex: 5 }} />

              <EarthyCalendar data={data} />

              <SectionImage src={data?.images?.image2 || "/photo_3.png"} alt="Ceremony" height="300px" />

              <section style={{ padding: '60px 0', textAlign: 'center', position: 'relative' }}>
                <FloatingDeco style={{ top: '20%', left: '-50px', transform: 'rotate(-10deg)', opacity: 0.3 }} />
                <Reveal delay={200}>
                  <div style={{ fontSize: '0.9rem', letterSpacing: '8px', color: 'var(--earthy-accent)', marginBottom: '20px', fontWeight: 800 }}>LOCATION</div>
                  <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: 'var(--earthy-brown)', marginBottom: '15px', fontWeight: 400 }}>{data?.location?.name || 'The Rose Garden Estates'}</h2>
                  <p style={{ marginBottom: '40px', opacity: 0.9, fontSize: '1.1rem', color: 'var(--earthy-text)', fontStyle: 'italic' }}>{data?.location?.address || '123 Romance Lane, Loving Valley'}</p>
                  <div style={{ height: '300px', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 15px 45px rgba(0,0,0,0.08)', marginBottom: '40px', border: '1px solid var(--earthy-tan)' }}>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.292!2d-118.243!3d34.052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDAzJzA3LjIiTiAxMTjCsDE0JzM0LjgiVw!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus" width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                  </div>
                  <a href={data?.location?.mapUrl || "#"} target="_blank" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>VIEW LOCATION</a>
                </Reveal>
              </section>

              <PhotoCarousel data={data} />

              <Decoration />

              <RSVPFooter orderId={orderId} data={data} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
