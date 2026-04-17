'use client';

import { useState, useEffect } from 'react';
import Reveal from '@/components/Reveal';
import Image from 'next/image';
import ItineraryTimeline from "@/components/ItineraryTimeline";
import RSVPFooter from "@/components/RSVPFooter";
import CountdownSection from "@/components/CountdownSection";

const MUSIC_URL = "https://res.cloudinary.com/dnfbik3if/video/upload/v1775201422/krasnoshchok-wedding-romantic-love-music-409293_ikekwk.mp3";

const WashiTape = ({ color = "#a2c2e0", rotate = 0, style = {} }: { color?: string, rotate?: number, style?: React.CSSProperties }) => (
    <div style={{
        width: '100px',
        height: '30px',
        backgroundColor: color,
        opacity: 0.6,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
        position: 'absolute',
        zIndex: 5,
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        ...style
    }} />
);

const PaperClip = ({ style }: { style?: React.CSSProperties }) => (
    <svg 
        viewBox="0 0 24 24" 
        style={{ width: '40px', height: '40px', fill: 'none', stroke: '#95a5a6', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', ...style }}
    >
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
);

const Polaroid = ({ src, alt, label, rotation = 0, delay = 200, children }: { src?: string, alt?: string, label?: string, rotation?: number, delay?: number, children?: React.ReactNode }) => (
  <Reveal delay={delay}>
    <div style={{
      padding: '15px 15px 50px',
      backgroundColor: 'white',
      boxShadow: '5px 15px 35px rgba(0,0,0,0.1)',
      transform: `rotate(${rotation}deg)`,
      position: 'relative',
      margin: '40px auto',
      width: '90%',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      border: '1px solid #f0f0f0'
    }}>
      <WashiTape color="#fbc2eb" rotate={-10} style={{ top: '-10px', left: '-20px' }} />
      <div style={{ width: '100%', height: '300px', position: 'relative', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
        {src ? <Image src={src} alt={alt || ""} fill style={{ objectFit: 'cover' }} /> : children}
      </div>
      {label && (
          <div style={{ 
              fontFamily: 'var(--font-alex-brush)', 
              fontSize: '2rem', 
              textAlign: 'center', 
              color: '#4a4a4a',
              opacity: 0.8,
              marginTop: '5px'
          }}>
              {label}
          </div>
      )}
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
      <Polaroid label="Our Love Story" rotation={2}>
        <Image
          src={photos[index]}
          alt="Wedding Moment"
          fill
          style={{
            objectFit: 'cover',
            transition: 'all 1.2s ease-in-out',
          }}
          key={index}
        />
        <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 10 }}>
            {photos.map((_, i) => (
                <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: index === i ? 'white' : 'rgba(255,255,255,0.5)' }} />
            ))}
        </div>
      </Polaroid>
    );
};

const ScrapbookCalendar = ({ data }: { data: any }) => {
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
          padding: '50px 30px', 
          textAlign: 'center', 
          backgroundColor: '#fff', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)', 
          margin: '60px auto', 
          width: '95%', 
          position: 'relative', 
          border: '1px solid #eee',
          backgroundImage: 'linear-gradient(#f0f0f0 1px, transparent 1px)',
          backgroundSize: '100% 30px'
      }}>
        <PaperClip style={{ position: 'absolute', top: '-15px', right: '30px', zIndex: 10, transform: 'rotate(15deg)' }} />
        <WashiTape color="#a2c2e0" rotate={5} style={{ top: '-15px', left: '20px' }} />
        
        <div style={{ fontFamily: 'var(--font-alex-brush)', fontSize: '3.5rem', color: '#4a4a4a', marginBottom: '10px' }}>Mark the Date</div>
        <div style={{ fontSize: '1.1rem', letterSpacing: '5px', fontWeight: 800, opacity: 0.6, color: '#a2c2e0', marginBottom: '35px' }}>{monthName} {year}</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={`${d}-${i}`} style={{ fontSize: '0.8rem', fontWeight: 900, opacity: 0.4, color: '#a2c2e0' }}>{d}</div>
          ))}
          {blanks.map(b => <div key={`b-${b}`} />)}
          {days.map(d => (
            <div key={d} style={{ 
                fontSize: '1.2rem', 
                height: '40px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                position: 'relative',
                color: d === targetDay ? '#ff6b6b' : '#4a4a4a',
                fontWeight: d === targetDay ? 900 : 400
            }}>
                {d === targetDay && (
                    <div style={{ 
                        position: 'absolute', 
                        fontSize: '3rem', color: '#ff6b6b', zIndex: 0, opacity: 0.2
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

const DrawnHeart = ({ style, color = "currentColor" }: { style?: React.CSSProperties, color?: string }) => (
    <svg viewBox="0 0 100 100" style={{ width: '40px', height: '40px', fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round', ...style }}>
        <path d="M50 85 C10 65 -5 35 15 15 C35 -5 45 20 50 25 C55 20 65 -5 85 15 C105 35 90 65 50 85" />
    </svg>
);

const DrawnStar = ({ style, color = "currentColor" }: { style?: React.CSSProperties, color?: string }) => (
    <svg viewBox="0 0 100 100" style={{ width: '30px', height: '30px', fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round', ...style }}>
        <path d="M50 5 L63 35 L95 40 L70 65 L76 95 L50 80 L24 95 L30 65 L5 40 L37 35 Z" />
    </svg>
);

const DrawnFloral = ({ style, color = "currentColor" }: { style?: React.CSSProperties, color?: string }) => (
    <svg viewBox="0 0 100 100" style={{ width: '50px', height: '50px', fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round', ...style }}>
        <path d="M50 50 Q60 20 50 5 Q40 20 50 50 M50 50 Q80 40 95 50 Q80 60 50 50 M50 50 Q60 80 50 95 Q40 80 50 50 M50 50 Q20 40 5 50 Q20 60 50 50" />
        <circle cx="50" cy="50" r="3" />
    </svg>
);

export default function ScrapbookTemplate({ data, orderId }: { data: any, orderId?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div style={{ minHeight: '100vh', backgroundColor: '#f5f8fa' }} />;

    const handleOpen = () => {
        setIsOpen(true);
        const audio = document.getElementById('bg-music') as HTMLAudioElement;
        if (audio) { audio.play().catch(e => console.log("Audio play blocked", e)); }
    };

    const toggleMusic = () => {
        const audio = document.getElementById('bg-music') as HTMLAudioElement;
        if (audio) {
            audio.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div style={{ backgroundColor: '#eef2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <main className="invitation-container scrapbook-theme" style={{ 
                position: 'relative', 
                backgroundColor: '#ffffff', 
                boxShadow: '0 0 50px rgba(0,0,0,0.1)',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
                maxWidth: '500px',
                width: '100%',
                overflow: 'hidden'
            }}>
                <style jsx global>{`
                    .scrapbook-theme { font-family: 'Handlee', cursive, sans-serif; }
                    .scrapbook-theme .subheading { color: #a2c2e0 !important; font-weight: 800 !important; letter-spacing: 5px !important; text-transform: uppercase !important; }
                    .scrapbook-theme .btn-primary { 
                        background-color: #a2c2e0 !important; 
                        border-radius: 0px !important; 
                        padding: 15px 40px !important;
                        font-weight: 700 !important;
                        box-shadow: 4px 4px 0px #7b9ebc !important;
                        color: white !important;
                        text-decoration: none;
                        display: inline-block;
                        transition: all 0.2s;
                    }
                    .scrapbook-theme .btn-primary:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px #7b9ebc !important; }
                `}</style>

                <audio id="bg-music" loop>
                   <source src={data?.musicUrl || MUSIC_URL} type="audio/mpeg" />
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
                            border: `2px solid #a2c2e0`,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}
                    >
                        {isMuted ? '🔇' : '🎵'}
                    </button>
                )}

                <div 
                    onClick={handleOpen} 
                    style={{ 
                        width: '100%', 
                        height: '100vh', 
                        backgroundColor: '#fffcf7', 
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
                        transition: 'transform 1.2s cubic-bezier(0.87, 0, 0.13, 1)',
                        transform: isOpen ? 'translateY(-100%)' : 'translateY(0)',
                        overflow: 'hidden',
                        backgroundImage: 'url("https://www.transparenttextures.com/patterns/notebook.png")'
                    }}
                >
                    {/* Decorative Elements on Welcome Screen */}
                    <DrawnHeart style={{ position: 'absolute', top: '15%', left: '15%', transform: 'rotate(-15deg)', opacity: 0.2 }} color="#ff6b6b" />
                    <DrawnStar style={{ position: 'absolute', top: '20%', right: '20%', transform: 'rotate(20deg)', opacity: 0.2 }} color="#a2c2e0" />
                    <DrawnFloral style={{ position: 'absolute', bottom: '25%', left: '20%', transform: 'rotate(-10deg)', opacity: 0.15 }} color="#7fb069" />
                    <DrawnHeart style={{ position: 'absolute', bottom: '15%', right: '15%', transform: 'rotate(10deg)', opacity: 0.2 }} color="#ff6b6b" />
                    
                    <WashiTape color="#fbc2eb" rotate={-5} style={{ top: '10%', right: '-30px', width: '150px' }} />
                    <WashiTape color="#a2c2e0" rotate={10} style={{ bottom: '15%', left: '-30px', width: '180px' }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <Reveal>
                            <div style={{ padding: '40px', backgroundColor: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eee', position: 'relative' }}>
                                <PaperClip style={{ position: 'absolute', top: '-15px', right: '10px' }} />
                                <div style={{ fontSize: '0.8rem', letterSpacing: '8px', color: '#a2c2e0', marginBottom: '20px', fontWeight: 800 }}>OUR SAVED MOMENTS</div>
                                <h1 style={{ 
                                    fontFamily: 'var(--font-alex-brush)', 
                                    fontSize: '4.5rem', 
                                    color: '#4a4a4a',
                                    marginBottom: '10px',
                                    lineHeight: 1.1
                                }}>
                                    {data?.brideName || 'Sarah'} & {data?.groomName || 'Mark'}
                                </h1>
                                <div style={{ height: '1px', width: '60px', backgroundColor: '#eee', margin: '20px auto' }}></div>
                                <div style={{ 
                                    fontSize: '0.9rem', 
                                    letterSpacing: '5px', 
                                    color: '#4a4a4a', 
                                    opacity: 0.6,
                                    textTransform: 'uppercase',
                                    fontWeight: 700
                                }}>Wedding Invitation</div>
                            </div>
                        </Reveal>
                    </div>

                    <div style={{ position: 'absolute', bottom: '60px', left: 0, right: 0 }}>
                        <Reveal delay={800}>
                            <div className="bounce-soft" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                <DrawnHeart style={{ width: '25px', height: '25px', opacity: 0.5 }} color="#ff6b6b" />
                                <p style={{ letterSpacing: '8px', opacity: 0.6, fontSize: '0.8rem', fontWeight: 800, color: '#4a4a4a' }}>TAP TO OPEN</p>
                            </div>
                        </Reveal>
                    </div>
                </div>
                    <div style={{ width: '100%', padding: '20px' }}>
                        {/* Hero Polaroid */}
                        <Polaroid 
                            src={data?.images?.heroImage || '/home_hero_bg.png'} 
                            alt="Couple" 
                            label={`${data?.brideName || 'Sarah'} & ${data?.groomName || 'Mark'}`}
                            rotation={-3}
                        />

                        <div style={{ padding: '40px 0' }}>
                           <Reveal>
                                <div style={{ textAlign: 'center', padding: '0 20px', color: '#4a4a4a', marginBottom: '40px' }}>
                                    <div style={{ fontFamily: 'var(--font-alex-brush)', fontSize: '2.5rem', marginBottom: '15px' }}>Adventure Begins</div>
                                    <p style={{ fontSize: '1.1rem', lineHeight: 1.8, opacity: 0.8 }}>
                                        "Life is a beautiful journey, and we want you to be part of our favorite chapter yet."
                                    </p>
                                </div>
                            </Reveal>

                            <Reveal delay={200}>
                                <div style={{
                                    padding: '50px 20px',
                                    textAlign: 'center',
                                    backgroundColor: '#fff',
                                    margin: '40px 0',
                                    position: 'relative',
                                    border: '1px dashed #ccc'
                                }}>
                                    <div style={{ fontSize: '0.9rem', letterSpacing: '4px', textTransform: 'uppercase', color: '#a2c2e0', fontWeight: 800, marginBottom: '25px' }}>
                                        INVITATION FOR
                                    </div>
                                    <h2 style={{ fontFamily: 'var(--font-alex-brush)', fontSize: '4.5rem', color: '#4a4a4a', margin: '10px 0' }}>Mr. Guest</h2>
                                    <p style={{ marginTop: '20px', fontSize: '1.1rem', color: '#a2c2e0', fontWeight: 600 }}>
                                        Join us for a day of joy and memories!
                                    </p>
                                </div>
                            </Reveal>

                            <CountdownSection data={data} />

                            <div style={{ margin: '60px 0' }}>
                                <ItineraryTimeline data={data} />
                            </div>

                            <ScrapbookCalendar data={data} />

                            <Polaroid 
                                src={data?.images?.image1 || "/photo_2.png"} 
                                alt="Memory" 
                                label="Sweet Moments"
                                rotation={3}
                            />

                            <section style={{ padding: '60px 10px', textAlign: 'center', position: 'relative' }}>
                                <WashiTape color="#ffcc33" rotate={-5} style={{ top: '0', right: '10%' }} />
                                <Reveal>
                                    <div style={{ fontSize: '0.8rem', letterSpacing: '6px', color: '#a2c2e0', marginBottom: '15px', fontWeight: 800 }}>THE DESTINATION</div>
                                    <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-alex-brush)', color: '#4a4a4a', marginBottom: '15px' }}>{data?.location?.name || 'The Rose Garden Estates'}</h2>
                                    <p style={{ marginBottom: '40px', opacity: 0.8, fontSize: '1rem', color: '#4a4a4a' }}>{data?.location?.address || '123 Romance Lane, Loving Valley'}</p>
                                    
                                    <div style={{ height: '350px', borderRadius: '15px', overflow: 'hidden', border: '8px solid white', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.084897042588!2d80.635832!3d7.290572!2m3!1f0!2f0!3f0!3m2!i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3662c95333f21%3A0x6a0a09e072f9602f!2sThe%20Grand%20Kandyan!5e0!3m2!1sen!2slk!4v1620000000000!5m2!1sen!2slk"
                                            width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                                        ></iframe>
                                    </div>

                                    <a href="#" target="_blank" className="btn-primary">OPEN IN MAPS</a>
                                </Reveal>
                            </section>

                            <PhotoCarousel data={data} />

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', padding: '60px 0', opacity: 0.2 }}>
                                <DrawnStar color="#ffcc33" />
                                <DrawnFloral color="#7fb069" />
                                <DrawnStar color="#ffcc33" />
                            </div>

                            <RSVPFooter orderId={orderId} data={data} />
                        </div>
                    </div>
            </main>
        </div>
    );
}
