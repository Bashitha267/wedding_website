'use client';

import { useState, useEffect } from 'react';
import Reveal from '@/components/Reveal';
import Image from 'next/image';
import ItineraryTimeline from "@/components/ItineraryTimeline";
import RSVPFooter from "@/components/RSVPFooter";

const MUSIC_URL = "https://res.cloudinary.com/dnfbik3if/video/upload/v1775201422/krasnoshchok-wedding-romantic-love-music-409293_ikekwk.mp3";

const PaperClip = ({ style }: { style?: React.CSSProperties }) => (
    <svg 
        viewBox="0 0 24 24" 
        style={{ width: '40px', height: '40px', fill: 'none', stroke: '#95a5a6', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', ...style }}
    >
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
);

const Polaroid = ({ src, alt, label, rotation = 0, delay = 200 }: { src: string, alt: string, label?: string, rotation?: number, delay?: number }) => (
  <Reveal delay={delay}>
    <div style={{
      padding: '15px 15px 40px',
      backgroundColor: 'white',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transform: `rotate(${rotation}deg)`,
      position: 'relative',
      margin: '40px auto',
      width: '85%',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }}>
      <PaperClip style={{ position: 'absolute', top: '-15px', right: '20px', zIndex: 10 }} />
      <div style={{ width: '100%', height: '300px', position: 'relative', overflow: 'hidden' }}>
        <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} />
      </div>
      {label && (
          <div style={{ 
              fontFamily: 'var(--font-alex-brush)', 
              fontSize: '1.8rem', 
              textAlign: 'center', 
              color: 'var(--sky-text)',
              opacity: 0.8
          }}>
              {label}
          </div>
      )}
    </div>
  </Reveal>
);

const ScrapbookHero = ({ data }: { data: any }) => (
  <section style={{ 
    padding: '80px 20px',
    textAlign: 'center',
    backgroundColor: 'var(--sky-light)',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
    
    <Reveal>
        <div style={{ fontSize: '0.9rem', letterSpacing: '8px', color: 'var(--sky-blue)', marginBottom: '30px', fontWeight: 800 }}>OUR KNOT STORY</div>
        <h1 style={{ 
          fontFamily: 'var(--font-alex-brush)', 
          fontSize: '5rem', 
          color: 'var(--sky-text)',
          marginBottom: '10px'
        }}>
          {data?.brideName || 'Sarah'}
        </h1>
        <div style={{ fontSize: '1.5rem', opacity: 0.4, margin: '10px 0' }}>+</div>
        <h1 style={{ 
          fontFamily: 'var(--font-alex-brush)', 
          fontSize: '5rem', 
          color: 'var(--sky-text)',
          marginBottom: '30px'
        }}>
          {data?.groomName || 'Mark'}
        </h1>
    </Reveal>

    <Polaroid 
        src={data?.images?.heroImage || '/home_hero_bg.png'} 
        alt="Couple" 
        label="Ever After"
        rotation={-2}
    />
  </section>
);

const Countdown = ({ data }: { data: any }) => {
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
        <section style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: 'white' }}>
            <Reveal>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                    <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--sky-blue)', opacity: 0.3 }}></div>
                    <div style={{ fontFamily: 'var(--font-alex-brush)', fontSize: '2.5rem', color: 'var(--sky-blue)' }}>Count the days</div>
                    <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--sky-blue)', opacity: 0.3 }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginTop: '40px' }}>
                    {[{l: 'Days', v: timeLeft.days}, {l: 'Hrs', v: timeLeft.hours}, {l: 'Min', v: timeLeft.minutes}, {l: 'Sec', v: timeLeft.seconds}].map((t, i) => (
                        <div key={t.l} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 300, color: 'var(--sky-text)' }}>
                                {t.v.toString().padStart(2, '0')}
                            </div>
                            <div style={{ fontSize: '0.6rem', marginTop: '5px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '2px' }}>{t.l}</div>
                        </div>
                    ))}
                </div>
            </Reveal>
        </section>
    );
};

export default function ScrapbookTemplate({ data, orderId }: { data: any, orderId?: string }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
        const audio = document.getElementById('bg-music') as HTMLAudioElement;
        if (audio) { audio.play().catch(e => console.log("Audio play blocked", e)); }
    };

    return (
        <div style={{ backgroundColor: '#f5f8fa', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <main className="invitation-container scrapbook-theme" style={{ position: 'relative', backgroundColor: 'white', boxShadow: '0 0 50px rgba(0,0,0,0.05)' }}>
                <style jsx global>{`
                    .scrapbook-theme .subheading { color: var(--sky-blue) !important; font-weight: 800 !important; letter-spacing: 5px !important; text-transform: uppercase !important; }
                    .scrapbook-theme .itinerary-section { background-color: #f9fcff !important; padding: 60px 20px !important; position: relative; }
                    .scrapbook-theme .btn-primary { 
                        background-color: var(--sky-blue) !important; 
                        border-radius: 5px !important; 
                        padding: 12px 35px !important;
                        font-weight: 700 !important;
                        box-shadow: 0 5px 15px rgba(162, 194, 224, 0.4) !important;
                    }
                    /* Custom Timeline override for wavy look */
                    .scrapbook-theme div[style*="backgroundColor: var(--rose-light)"] { background-color: #e6f0f7 !important; border-radius: 10px; }
                    .scrapbook-theme div[style*="color: var(--rose-medium)"] { color: var(--sky-blue) !important; }
                `}</style>

                <audio id="bg-music" loop>
                   <source src={data?.musicUrl || MUSIC_URL} type="audio/mpeg" />
                </audio>

                {!isOpen ? (
                    <div onClick={handleOpen} style={{ width: '100%', height: '100vh', backgroundColor: 'var(--sky-light)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', textAlign: 'center', padding: '40px' }}>
                        <Reveal>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎞️</div>
                            <h2 style={{ fontFamily: 'var(--font-alex-brush)', fontSize: '5rem', color: 'var(--sky-text)' }}>Our Gallery</h2>
                            <p className="bounce-soft" style={{ letterSpacing: '5px', opacity: 0.6, fontSize: '0.8rem', fontWeight: 800, color: 'var(--sky-blue)' }}>TAP TO UNROLL</p>
                        </Reveal>
                    </div>
                ) : (
                    <div style={{ width: '100%' }}>
                        <ScrapbookHero data={data} />

                        <div style={{ padding: '40px 0' }}>
                           <Reveal>
                                <div style={{ textAlign: 'center', padding: '0 40px', color: 'var(--sky-text)', marginBottom: '40px' }}>
                                    <div style={{ fontFamily: 'var(--font-alex-brush)', fontSize: '2rem', marginBottom: '20px' }}>The beginning of forever</div>
                                    <p style={{ fontSize: '1rem', lineHeight: 1.8, opacity: 0.7 }}>
                                        "Two souls with but a single thought, two hearts that beat as one."
                                    </p>
                                </div>
                            </Reveal>

                            <Countdown data={data} />

                            <div style={{ padding: '80px 40px', textAlign: 'center', backgroundColor: '#fdfdfd', borderTop: '1px dashed #eee', borderBottom: '1px dashed #eee', margin: '40px 0' }}>
                                <Reveal>
                                    <h2 style={{ fontFamily: 'var(--font-alex-brush)', fontSize: '4.5rem', color: 'var(--sky-text)' }}>Mr. Guest</h2>
                                    <p style={{ marginTop: '20px', fontSize: '1rem', color: 'var(--sky-blue)', fontStyle: 'italic' }}>
                                        join us as we celebrate this precious milestone.
                                    </p>
                                </Reveal>
                            </div>

                            <Polaroid 
                                src={data?.images?.image1 || "/photo_2.png"} 
                                alt="Memory" 
                                label="Sweet Moments"
                                rotation={3}
                            />

                            <div style={{ margin: '60px 0' }}>
                                <ItineraryTimeline data={data} />
                            </div>

                            <div style={{ padding: '60px 40px', textAlign: 'center', backgroundColor: 'var(--sky-light)', margin: '40px 0', border: '1px solid #e0eaf3' }}>
                                <Reveal>
                                    <div style={{ fontFamily: 'var(--font-alex-brush)', fontSize: '3.5rem', color: 'var(--sky-text)', marginBottom: '10px' }}>Save the Date</div>
                                    <div style={{ fontSize: '1.1rem', letterSpacing: '4px', fontWeight: 700, opacity: 0.6, color: 'var(--sky-blue)' }}>{data?.eventDate ? new Date(data.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() : 'AUG 24, 2026'}</div>
                                </Reveal>
                            </div>

                            <Polaroid 
                                src={data?.images?.image2 || "/photo_3.png"} 
                                alt="Ceremony" 
                                label="The Location"
                                rotation={-1}
                            />

                            <section style={{ padding: '60px 30px', textAlign: 'center' }}>
                                <Reveal>
                                    <div style={{ fontSize: '0.8rem', letterSpacing: '6px', color: 'var(--sky-blue)', marginBottom: '15px', fontWeight: 800 }}>LOCATION</div>
                                    <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-alex-brush)', color: 'var(--sky-text)', marginBottom: '15px' }}>{data?.location?.name || 'The Rose Garden Estates'}</h2>
                                    <p style={{ marginBottom: '40px', opacity: 0.7, fontSize: '0.95rem' }}>{data?.location?.address || '123 Romance Lane, Loving Valley'}</p>
                                    <a href={data?.location?.mapUrl || "#"} target="_blank" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', color: 'white' }}>View Location</a>
                                </Reveal>
                            </section>

                            <Polaroid 
                                src={data?.images?.gallery?.[0] || "/photo_4.png"} 
                                alt="Gallery" 
                                label="With Pure Love"
                                rotation={2}
                            />

                            <RSVPFooter orderId={orderId} data={data} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
