'use client';

import { useState, useEffect } from 'react';
import RSVPFooter from "@/components/RSVPFooter";
import CountdownSection from "@/components/CountdownSection";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import Reveal from '@/components/Reveal';
import Image from 'next/image';

const THEME = {
    primary: "#c06c52", // Terracotta
    secondary: "#6b705c", // Olive
    accent: "#b8915e", // Gold
    bg: "#fdf8f5", // Warm Cream
    text: "#4a3b2b",
    sand: "#e2d1c3"
};

const FloatingSparkles = ({ count = 30 }) => {
    const [sparkles, setSparkles] = useState<{ top: string, left: string, size: string, opacity: number, delay: string }[]>([]);
    
    useEffect(() => {
        setSparkles([...Array(count)].map((_, i) => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * 4 + 2}px`,
            opacity: Math.random() * 0.5 + 0.2,
            delay: `${Math.random() * 5}s`
        })));
    }, [count]);

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
            {sparkles.map((s, i) => (
                <div key={`sparkle-${i}`} style={{
                    position: 'absolute',
                    top: s.top,
                    left: s.left,
                    width: s.size,
                    height: s.size,
                    backgroundColor: THEME.accent,
                    borderRadius: '50%',
                    opacity: s.opacity,
                    transition: 'all 2s ease-in-out'
                }} />
            ))}
        </div>
    );
};

const CustomCountdown = ({ data }: { data?: any }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = data?.eventDate ? new Date(data.eventDate).getTime() : new Date('August 24, 2026 15:00:00').getTime();
        if (isNaN(targetDate)) return;

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

    const items = [
        { label: 'Days', val: timeLeft.days },
        { label: 'Hours', val: timeLeft.hours },
        { label: 'Mins', val: timeLeft.minutes },
        { label: 'Secs', val: timeLeft.seconds }
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '40px 0' }}>
            {items.map(item => (
                <div key={item.label} style={{
                    backgroundColor: 'white',
                    padding: '15px 5px',
                    width: '75px',
                    textAlign: 'center',
                    borderBottom: `4px solid ${THEME.primary}`,
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: THEME.primary }}>{item.val.toString().padStart(2, '0')}</div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: THEME.secondary }}>{item.label}</div>
                </div>
            ))}
        </div>
    );
};

const DesertPhotoLayout = ({ data }: { data?: any }) => {
    const images = [
        data?.images?.image1 || '/photo_2.png',
        data?.images?.gallery?.[0] || '/photo_3.png'
    ];

    return (
        <div style={{ margin: '60px 0', position: 'relative' }}>
            <Reveal>
                <div style={{ position: 'relative', height: '500px', width: '100%' }}>
                    <div style={{ 
                        position: 'absolute', 
                        inset: '0 20px', 
                        borderRadius: '200px 200px 0 0', 
                        overflow: 'hidden', 
                        border: `2px solid ${THEME.accent}`,
                        zIndex: 1
                    }}>
                        <Image src={images[0]} alt="Hero Image" fill style={{ objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(253,248,245,0.9))' }} />
                    </div>
                    
                    <div style={{ 
                        position: 'absolute', 
                        bottom: '-30px', 
                        left: '0', 
                        width: '180px', 
                        height: '240px', 
                        zIndex: 2,
                        backgroundColor: 'white',
                        padding: '10px',
                        boxShadow: '10px 10px 30px rgba(0,0,0,0.1)',
                        transform: 'rotate(-3deg)'
                    }}>
                        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                           <Image src={images[1]} alt="Detail Image" fill style={{ objectFit: 'cover' }} />
                        </div>
                    </div>
                    
                    <div style={{ position: 'absolute', top: '10%', right: '0', fontSize: '5rem', opacity: 0.1, zIndex: 0 }}>☀️</div>
                </div>
            </Reveal>
        </div>
    );
};

const WeddingCalendar = ({ data }: { data?: any }) => {
    const eventDate = data?.eventDate ? new Date(data.eventDate) : new Date(2026, 7, 24);
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
                backgroundColor: 'white',
                border: `1px solid ${THEME.sand}`,
                margin: '40px 0',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                position: 'relative'
            }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: THEME.primary, marginBottom: '20px', letterSpacing: '4px' }}>
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
                        <div key={`${d}-${i}`} style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.4, color: THEME.text }}>{d}</div>
                    ))}
                    {blanks.map(b => <div key={`b-${b}`} />)}
                    {days.map(d => (
                        <div key={d} style={{
                            position: 'relative',
                            fontSize: '0.95rem',
                            height: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: d === targetDay ? 'white' : THEME.text,
                            zIndex: 1,
                            fontWeight: d === targetDay ? 800 : 400
                        }}>
                            {d === targetDay ? (
                                <>
                                    <div style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: THEME.primary,
                                        borderRadius: '50%',
                                        zIndex: -1,
                                        transform: 'scale(0.8)'
                                    }}></div>
                                    <span>{d}</span>
                                </>
                            ) : d}
                        </div>
                    ))}
                </div>
                
                <p style={{ color: THEME.secondary, fontSize: '0.85rem', letterSpacing: '1px', fontWeight: 600 }}>THE ADVENTURE BEGINS</p>
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
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: THEME.primary, marginBottom: '30px' }}>
                    Captured Moments
                </h3>
                <div style={{ position: 'relative', width: '100%', height: '400px', border: `10px solid white`, boxShadow: '0 15px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <Image
                        src={photos[index]}
                        alt={`Wedding Moment ${index}`}
                        fill
                        style={{ objectFit: 'cover', transition: 'all 1.5s ease-in-out' }}
                        key={`carousel-${index}`}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '25px' }}>
                    {photos.map((_, i) => (
                        <div key={`dot-${i}`} style={{
                            width: index === i ? '30px' : '10px',
                            height: '4px',
                            backgroundColor: index === i ? THEME.primary : THEME.sand,
                            transition: 'all 0.3s ease'
                        }} />
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

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div style={{ minHeight: '100vh', backgroundColor: THEME.bg }} />;

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
        <div style={{ 
            position: 'relative', 
            minHeight: '100vh', 
            width: '100%', 
            backgroundColor: '#1a1410', 
            display: 'flex', 
            justifyContent: 'center',
            overflowX: 'hidden'
        }}>
             <audio id="bg-music" loop>
                <source src={data?.musicUrl || "https://res.cloudinary.com/dnfbik3if/video/upload/v1775201422/krasnoshchok-wedding-romantic-love-music-409293_ikekwk.mp3"} type="audio/mpeg" />
            </audio>

            {/* Blurred Backdrop for Desktop */}
            <div 
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${data?.images?.heroImage || '/home_hero_bg.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(40px) brightness(0.2)',
                    transform: 'scale(1.1)',
                    zIndex: 0
                }} 
            />

            <main className="invitation-container" style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '450px',
                backgroundColor: THEME.bg,
                boxShadow: '0 0 100px rgba(0,0,0,0.8)',
                minHeight: '100vh',
                overflow: 'hidden'
            }}>
                {isOpen && (
                    <button
                        onClick={toggleMusic}
                        style={{
                            position: 'fixed', bottom: '20px', right: '20px', zIndex: 2000,
                            width: '45px', height: '45px', borderRadius: '50%',
                            backgroundColor: 'white', border: `1px solid ${THEME.accent}`,
                            display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}
                    >
                        {isMuted ? '🔇' : '🎵'}
                    </button>
                )}

                {/* Welcome Screen */}
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    backgroundColor: THEME.primary,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center', padding: '40px', cursor: 'pointer',
                    transition: 'transform 1.2s cubic-bezier(0.87, 0, 0.13, 1)',
                    transform: isOpen ? 'translateY(-100%)' : 'translateY(0)',
                }} onClick={handleOpen}>
                    <FloatingSparkles count={50} />
                    <Reveal>
                        <div style={{ fontSize: '0.8rem', letterSpacing: '6px', color: THEME.sand, marginBottom: '20px', fontWeight: 600 }}>OUR JOURNEY BEGINS</div>
                        <h1 style={{ 
                            fontFamily: 'var(--font-display)', fontSize: '5.5rem', 
                            color: THEME.bg, marginBottom: '10px', lineHeight: 1
                        }}>
                            {data?.brideName || 'Sarah'} <br /> & <br /> {data?.groomName || 'Mark'}
                        </h1>
                        <div style={{ height: '2px', width: '60px', backgroundColor: THEME.accent, margin: '30px auto' }}></div>
                        <p style={{ color: THEME.sand, letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.9rem' }}>The Wedding Invitation</p>
                    </Reveal>

                    <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0 }}>
                        <Reveal delay={800}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                <div style={{ fontSize: '1.2rem', color: THEME.accent }}>✦</div>
                                <div style={{ 
                                    backgroundColor: 'transparent', border: `1px solid ${THEME.accent}`,
                                    color: THEME.bg, padding: '12px 40px', fontWeight: 800,
                                    letterSpacing: '5px', fontSize: '0.8rem'
                                }}>TAP TO ENTER</div>
                            </div>
                        </Reveal>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ position: 'relative', padding: '0px' }}>
                    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
                        <Image src={data?.images?.heroImage || '/home_hero_bg.png'} alt="Hero Background" fill style={{ objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #fdf8f5 95%)' }} />
                        <div style={{ position: 'absolute', bottom: '40px', left: 0, right: 0, textAlign: 'center', padding: '0 20px' }}>
                            <Reveal>
                                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: THEME.primary, marginBottom: '10px' }}>
                                    {data?.brideName} & {data?.groomName}
                                </h1>
                                <div style={{ color: THEME.secondary, letterSpacing: '8px', fontSize: '0.9rem', fontWeight: 700 }}>SOULS ENTWINED</div>
                            </Reveal>
                        </div>
                    </div>

                    <div style={{ padding: '40px 20px' }}>
                        <Reveal>
                            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                                <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: THEME.text, opacity: 0.8, fontStyle: 'italic' }}>
                                    "Love is a journey that starts with a single step and continues forever into the golden horizon."
                                </p>
                            </div>
                        </Reveal>

                        <Reveal delay={200}>
                            <div style={{ 
                                textAlign: 'center', padding: '60px 20px', 
                                border: `2px solid ${THEME.sand}`, 
                                backgroundColor: 'white',
                                position: 'relative'
                            }}>
                                <div style={{ fontSize: '0.8rem', letterSpacing: '4px', color: THEME.accent, marginBottom: '20px', fontWeight: 800 }}>JOIN US FOR</div>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '4.5rem', color: THEME.primary, marginBottom: '20px', lineHeight: 1 }}>Mr. Guest</h2>
                                <p style={{ color: THEME.secondary, fontWeight: 500 }}>To celebrate the beginning of our forever.</p>
                            </div>
                        </Reveal>

                        <DesertPhotoLayout data={data} />

                        <WeddingCalendar data={data} />

                        <CustomCountdown data={data} />

                        <ItineraryTimeline data={data} />

                        <PhotoCarousel data={data} />

                        <section style={{ padding: '60px 0', textAlign: 'center' }}>
                            <Reveal delay={200}>
                                <div style={{ fontSize: '0.8rem', letterSpacing: '4px', color: THEME.accent, marginBottom: '15px', fontWeight: 800 }}>THE VENUE</div>
                                <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: THEME.primary, marginBottom: '10px' }}>{data?.location?.name}</h2>
                                <p style={{ color: THEME.secondary, marginBottom: '30px', fontSize: '0.9rem' }}>{data?.location?.address}</p>
                                
                                <div style={{ height: '350px', borderRadius: '40px 40px 0 0', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.084897042588!2d80.635832!3d7.290572!2m3!1f0!2f0!3f0!3m2!i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3662c95333f21%3A0x6a0a09e072f9602f!2sThe%20Grand%20Kandyan!5e0!3m2!1sen!2slk!4v1620000000000"
                                        width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                                    ></iframe>
                                </div>

                                <a href="#" target="_blank" style={{ 
                                    display: 'inline-block', backgroundColor: THEME.primary, 
                                    color: 'white', padding: '14px 45px', fontSize: '0.9rem', 
                                    fontWeight: 800, letterSpacing: '3px', textDecoration: 'none',
                                    boxShadow: '0 10px 20px rgba(192, 108, 82, 0.3)'
                                }}>GET DIRECTIONS</a>
                            </Reveal>
                        </section>

                        <RSVPFooter orderId={orderId} data={data} />
                    </div>
                </div>
            </main>
        </div>
    );
}

