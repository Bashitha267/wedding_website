'use client';

import { useState, useEffect } from 'react';
import Reveal from '@/components/Reveal';
import Image from 'next/image';
import ItineraryTimeline from "@/components/ItineraryTimeline";
import RSVPFooter from "@/components/RSVPFooter";

const MUSIC_URL = "https://res.cloudinary.com/dnfbik3if/video/upload/v1775201422/krasnoshchok-wedding-romantic-love-music-409293_ikekwk.mp3";

const TORN_PATH_BOTTOM = 'polygon(0% 100%, 100% 100%, 100% 0%, 98% 12%, 95% 5%, 92% 15%, 88% 8%, 85% 18%, 82% 10%, 78% 20%, 75% 12%, 72% 18%, 68% 10%, 65% 20%, 62% 12%, 58% 22%, 55% 15%, 52% 25%, 48% 15%, 45% 22%, 42% 12%, 38% 22%, 35% 15%, 32% 22%, 28% 12%, 25% 22%, 22% 15%, 18% 22%, 15% 12%, 12% 22%, 8% 15%, 5% 22%, 2% 12%, 0% 25%)';
const TORN_PATH_TOP = 'polygon(0% 0%, 100% 0%, 100% 100%, 98% 88%, 95% 95%, 92% 85%, 88% 92%, 85% 82%, 82% 90%, 78% 80%, 75% 88%, 72% 82%, 68% 90%, 65% 80%, 62% 88%, 58% 78%, 55% 85%, 52% 75%, 48% 85%, 45% 78%, 42% 88%, 38% 78%, 35% 85%, 32% 78%, 28% 88%, 25% 78%, 22% 85%, 18% 78%, 15% 88%, 12% 78%, 8% 85%, 5% 78%, 2% 88%, 0% 75%)';

const FloatingHearts = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
    {[...Array(25)].map((_, i) => (
      <div key={i} className="pulse" style={{
        position: 'absolute',
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        fontSize: `${Math.random() * 1.5 + 0.5}rem`,
        opacity: 0.08,
        color: 'black',
        animationDelay: `${i * 0.3}s`
      }}>
        ❤
      </div>
    ))}
  </div>
);

const MonochromeEnvelope = ({ onOpen, isOpen }: { onOpen: () => void, isOpen: boolean }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'black',
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
        border: '20px solid #111'
      }}
      onClick={onOpen}
    >
      <div style={{
        textAlign: 'center',
        width: '100%',
        color: 'white',
        zIndex: 2
      }}>
        <div style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '5rem', 
            marginBottom: '15px'
        }}>
          Invitation
        </div>
        <div className="bounce-soft" style={{
          fontSize: '0.8rem',
          letterSpacing: '8px',
          opacity: 0.6,
          fontWeight: 300,
          textTransform: 'uppercase'
        }}>
          Tap to open
        </div>
      </div>
    </div>
  );
};

const SectionImage = ({ src, alt, height = "400px", delay = 200, tornTop = false, tornBottom = false }: { src: string, alt: string, height?: string, delay?: number, tornTop?: boolean, tornBottom?: boolean }) => (
  <Reveal delay={delay}>
    <div style={{
      height,
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      margin: '40px 0',
      backgroundColor: 'white'
    }}>
      <Image src={src} alt={alt} fill style={{ objectFit: 'cover', filter: 'grayscale(1) contrast(1.1)' }} />
      {tornBottom && (
          <div style={{
            position: 'absolute',
            bottom: '-1px',
            left: 0,
            width: '100%',
            height: '60px',
            backgroundColor: 'white',
            clipPath: TORN_PATH_BOTTOM
          }} />
      )}
      {tornTop && (
          <div style={{
            position: 'absolute',
            top: '-1px',
            left: 0,
            width: '100%',
            height: '60px',
            backgroundColor: 'white',
            clipPath: TORN_PATH_TOP
          }} />
      )}
    </div>
  </Reveal>
);

const MonochromeHero = ({ data }: { data: any }) => (
  <section style={{ 
    height: '90vh',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'white'
  }}>
    <Image 
        src={data?.images?.heroImage || '/home_hero_bg.png'} 
        alt="Couple" 
        fill 
        priority
        style={{ objectFit: 'cover', filter: 'grayscale(1) contrast(1.1)' }} 
    />
    
    <div style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1
    }} />

    <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 20px', color: 'white' }}>
      <Reveal>
        <div style={{ fontSize: '0.9rem', letterSpacing: '10px', marginBottom: '20px', fontWeight: 600 }}>WE ARE GETTING MARRIED</div>
        <h1 style={{ 
          fontSize: '5.5rem', 
          lineHeight: 1,
          fontFamily: 'var(--font-display)',
          marginBottom: '20px'
        }}>
          {data?.brideName || 'Sarah'} & {data?.groomName || 'Mark'}
        </h1>
        <div style={{ fontSize: '1.4rem', letterSpacing: '6px', fontWeight: 700 }}>
          {data?.eventDate ? new Date(data.eventDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '24.08.2026'}
        </div>
      </Reveal>
    </div>

    <div style={{
        position: 'absolute',
        bottom: '-1px',
        left: 0,
        width: '100%',
        height: '80px',
        backgroundColor: 'white',
        clipPath: TORN_PATH_BOTTOM,
        zIndex: 4
    }} />
  </section>
);

const MonochromeCountdown = ({ data }: { data: any }) => {
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
        <section style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: 'white' }}>
            <Reveal>
                <div style={{ marginBottom: '40px', letterSpacing: '10px', fontSize: '0.8rem', fontWeight: 800 }}>COUNTDOWN</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '35px' }}>
                    {[{l: 'DAYS', v: timeLeft.days}, {l: 'HRS', v: timeLeft.hours}, {l: 'MIN', v: timeLeft.minutes}, {l: 'SEC', v: timeLeft.seconds}].map((t, i) => (
                        <div key={t.l} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 200, color: 'black' }}>
                                {t.v.toString().padStart(2, '0')}
                            </div>
                            <div style={{ fontSize: '0.6rem', marginTop: '10px', letterSpacing: '3px', opacity: 0.5 }}>{t.l}</div>
                        </div>
                    ))}
                </div>
            </Reveal>
        </section>
    );
};

const MonochromeCalendar = ({ data }: { data: any }) => {
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
          padding: '80px 30px', 
          textAlign: 'center', 
          backgroundColor: 'white', 
          border: '2px solid black', 
          margin: '60px 0',
          position: 'relative'
      }}>
        <div style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '4.5rem', 
            color: 'black', 
            marginBottom: '10px',
            lineHeight: 1
        }}>
            Save the Date
        </div>
        <div style={{ 
            fontSize: '1.1rem', 
            fontWeight: 800, 
            color: 'black', 
            marginBottom: '50px', 
            letterSpacing: '10px',
            opacity: 0.8
        }}>
            {monthName} {year}
        </div>

        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '15px', 
            maxWidth: '350px', 
            margin: '0 auto',
            borderTop: '1px solid #eee',
            paddingTop: '30px'
        }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={`${d}-${i}`} style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.3 }}>{d}</div>
          ))}
          {blanks.map(b => <div key={`b-${b}`} />)}
          {days.map(d => (
            <div key={d} style={{ 
                fontSize: '1.2rem', 
                height: '45px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                position: 'relative',
                color: d === targetDay ? 'white' : 'black',
                fontWeight: d === targetDay ? 900 : 300
            }}>
                {d === targetDay && (
                    <div style={{ 
                        position: 'absolute', 
                        top: 0, left: 0, right: 0, bottom: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '3rem', color: 'black', zIndex: 1, pointerEvents: 'none'
                    }}>
                        ❤
                    </div>
                )}
                <span style={{ position: 'relative', zIndex: 2 }}>{d}</span>
            </div>
          ))}
        </div>
        
        {/* Subtle decorative border */}
        <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            bottom: '10px',
            border: '1px solid #eee',
            pointerEvents: 'none'
        }} />
      </div>
    </Reveal>
  );
};

export default function MonochromeTemplate({ data, orderId }: { data: any, orderId?: string }) {
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
        <div style={{ backgroundColor: '#eeeeee', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <main className="invitation-container monochrome-theme" style={{ position: 'relative', backgroundColor: 'white', boxShadow: '0 0 100px rgba(0,0,0,0.1)' }}>
                <style jsx global>{`
                    .monochrome-theme .subheading { color: black !important; font-weight: 800 !important; letter-spacing: 6px !important; text-transform: uppercase !important; }
                    .monochrome-theme .itinerary-section { background-color: white !important; }
                    .monochrome-theme .btn-primary { 
                        background-color: black !important; 
                        border-radius: 0 !important; 
                        border: 1px solid black !important;
                        text-transform: uppercase !important;
                        letter-spacing: 2px !important;
                        font-weight: 700 !important;
                        padding: 15px 40px !important;
                    }
                    .monochrome-theme .btn-outline { 
                        border-radius: 0 !important; 
                        border: 1px solid black !important; 
                        color: black !important;
                        text-transform: uppercase !important;
                        letter-spacing: 2px !important;
                        padding: 15px 40px !important;
                    }
                    .monochrome-theme footer { background-color: white !important; border-top: 1px solid #ddd !important; }
                    
                    /* Itinerary Overrides */
                    .monochrome-itinerary div[style*="backgroundColor: var(--rose-light)"] { background-color: #f5f5f5 !important; }
                    .monochrome-itinerary div[style*="color: var(--rose-medium)"] { color: black !important; }
                `}</style>

                <audio id="bg-music" loop>
                   <source src={data?.musicUrl || MUSIC_URL} type="audio/mpeg" />
                </audio>

                <MonochromeEnvelope isOpen={isOpen} onOpen={handleOpen} />

                {isOpen && (
                    <div style={{ width: '100%', position: 'relative' }}>
                        <FloatingHearts />
                        
                        <button onClick={toggleMusic} style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 2000, width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                            {isMuted ? '🔇' : '🎵'}
                        </button>

                        <MonochromeHero data={data} />

                        <div style={{ padding: '40px 20px', position: 'relative', zIndex: 1 }}>
                            <Reveal>
                                <div style={{ textAlign: 'center', padding: '0 20px', fontStyle: 'italic', color: 'black', marginBottom: '40px', fontSize: '1.1rem' }}>
                                    "Two souls with but a single thought, two hearts that beat as one."
                                </div>
                            </Reveal>

                            <MonochromeCountdown data={data} />

                            <Reveal delay={200}>
                                <div style={{
                                    padding: '80px 40px',
                                    textAlign: 'center',
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '0',
                                    margin: '60px 0',
                                    position: 'relative',
                                    clipPath: TORN_PATH_TOP,
                                    border: '1px solid #eee'
                                }}>
                                    <p style={{ fontSize: '1.1rem', lineHeight: 1.8, opacity: 0.8, marginBottom: '30px', color: 'black' }}>
                                        With hearts full of love and happiness, we are delighted to announce our wedding!
                                    </p>
                                    <h2 style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '4.5rem',
                                        color: 'black',
                                        margin: '10px 0',
                                        lineHeight: 0.9
                                    }}>
                                        Mr. Guest
                                    </h2>
                                    <p style={{ fontSize: '1.1rem', marginTop: '30px', color: 'black' }}>
                                        join us as we celebrate this precious milestone.
                                    </p>
                                </div>
                            </Reveal>

                            <SectionImage src={data?.images?.image1 || "/photo_2.png"} alt="Engagement" height="450px" tornBottom />

                            <div className="monochrome-itinerary">
                                <ItineraryTimeline data={data} />
                            </div>

                            <MonochromeCalendar data={data} />

                            <SectionImage src={data?.images?.image2 || "/photo_3.png"} alt="Ceremony" height="400px" tornTop />

                            <section style={{ padding: '80px 0', textAlign: 'center' }}>
                                <Reveal delay={200}>
                                    <div style={{ fontSize: '0.8rem', letterSpacing: '8px', opacity: 0.5, marginBottom: '20px', fontWeight: 800 }}>LOCATION</div>
                                    <h2 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-display)', color: 'black', marginBottom: '15px' }}>{data?.location?.name || 'The Rose Garden Estates'}</h2>
                                    <p style={{ marginBottom: '40px', opacity: 0.7, fontSize: '1rem', color: 'black' }}>{data?.location?.address || '123 Romance Lane, Loving Valley'}</p>
                                    <div style={{ height: '300px', backgroundColor: '#eee', marginBottom: '40px', overflow: 'hidden' }}>
                                        <iframe src="https://www.google.com/maps/embed?..." width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) invert(0.9)' }} loading="lazy"></iframe>
                                    </div>
                                    <a href={data?.location?.mapUrl || "#"} target="_blank" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>VIEW LOCATION</a>
                                </Reveal>
                            </section>

                            <SectionImage src={data?.images?.gallery?.[0] || "/photo_4.png"} alt="Gallery" height="500px" tornTop tornBottom />

                            <RSVPFooter orderId={orderId} data={data} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
