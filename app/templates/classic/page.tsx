'use client';

import { useState, useEffect } from 'react';
import Hero from "@/components/Hero";
import CountdownSection from "@/components/CountdownSection";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import RSVPFooter from "@/components/RSVPFooter";
import Reveal from '@/components/Reveal';
import Image from 'next/image';

const WEDDING_DATE = new Date(2026, 7, 24); // August 24, 2026
const MUSIC_URL = "https://res.cloudinary.com/dnfbik3if/video/upload/v1775201422/krasnoshchok-wedding-romantic-love-music-409293_ikekwk.mp3"; // Placeholder dynamic link

const WeddingCalendar = ({ onAdd }: { onAdd: () => void }) => {
  const daysInMonth = 31;
  const startDay = 6; // Aug 1st 2026 is Saturday
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  return (
    <Reveal delay={200}>
      <div style={{
        padding: '30px 20px',
        textAlign: 'center',
        backgroundColor: 'var(--rose-light)',
        borderRadius: '30px',
        margin: '40px 0',
        boxShadow: '0 10px 30px rgba(217, 133, 148, 0.15)'
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--rose-dark)', marginBottom: '10px' }}>
          Save the Date
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '20px', letterSpacing: '2px' }}>
          AUGUST 2026
        </div>

        {/* Calendar Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          maxWidth: '300px',
          margin: '0 auto 30px'
        }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={`${d}-${i}`} style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.5 }}>{d}</div>
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
              color: d === 24 ? 'white' : 'inherit',
              zIndex: 1,
              fontWeight: d === 24 ? 900 : 500
            }}>
              {d === 24 ? (
                <>
                  <span style={{
                    position: 'absolute',
                    fontSize: '2.8rem',
                    color: 'var(--rose-vibrant)',
                    zIndex: -1,
                    top: '50.5%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    lineHeight: 1
                  }}>❤</span>
                  <span style={{ position: 'relative', top: '-1px' }}>{d}</span>
                </>
              ) : d}
            </div>
          ))}
        </div>

        <button
          onClick={onAdd}
          style={{
            backgroundColor: 'white',
            color: 'var(--rose-dark)',
            border: '2px solid var(--rose-vibrant)',
            borderRadius: '30px',
            padding: '14px 28px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            margin: '0 auto'
          }}
        >
          📅 ADD TO CALENDAR
        </button>
      </div>
    </Reveal>
  );
};

const PhotoCarousel = () => {
    const [index, setIndex] = useState(0);
    const photos = ['/home_hero_bg.png', '/photo_2.png', '/photo_3.png', '/photo_4.png', '/photo_5.png'];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
        }, 4000);
        return () => clearInterval(interval);
    }, [photos.length]);

    return (
    <Reveal delay={200}>
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: 'var(--rose-dark)', marginBottom: '30px' }}>
          Ever After Begins
        </h3>

        <div style={{ position: 'relative', width: '100%', height: '450px', borderRadius: '25px', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.15)' }}>
          <Image
            src={photos[index]}
            alt="Wedding Moment"
            fill
            style={{
              objectFit: 'cover',
              transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'cuteZoom 1.2s ease-out'
            }}
            key={index}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '25px' }}>
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              style={{
                width: index === i ? '24px' : '10px',
                height: '10px',
                borderRadius: '5px',
                backgroundColor: index === i ? 'var(--rose-vibrant)' : 'var(--rose-light)',
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

const InvitationEnvelope = ({ onOpen, isOpen }: { onOpen: () => void, isOpen: boolean }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'var(--bg-cream)',
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
        backgroundImage: 'url("/envelope_cover.png")',
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
        color: 'white',
        textShadow: '0 4px 10px rgba(0,0,0,0.5)',
        zIndex: 2
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '4.5rem', marginBottom: '15px' }}>
          Invitation
        </div>
        <div className="bounce-soft" style={{
          fontSize: '0.9rem',
          letterSpacing: '5px',
          opacity: 0.9,
          fontWeight: 700
        }}>
          TAP TO OPEN
        </div>
      </div>
      {/* Dark gradient for text visibility */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)',
        zIndex: 1
      }} />
    </div>
  );
};

const SectionImage = ({ src, alt, height = "250px", delay = 200 }: { src: string, alt: string, height?: string, delay?: number }) => (
  <Reveal delay={delay}>
    <div style={{
      height,
      width: '100%',
      position: 'relative',
      borderRadius: '12px',
      overflow: 'hidden',
      margin: '30px 0',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
    }}>
      <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} />
    </div>
  </Reveal>
);

const Decoration = () => (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0', opacity: 0.3 }}>
        <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M75 10c-5-5-12-5-17 0m17 0c5-5 12-5 17 0M75 10v20m0-20L60 25m15-15 15 15" stroke="var(--rose-vibrant)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="75" cy="10" r="3" fill="var(--rose-vibrant)" />
            <path d="M10 20h45M95 20h45" stroke="var(--rose-light)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
    </div>
);

const FloatingHearts = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
    {[...Array(35)].map((_, i) => {
      const colors = ['#d98594', '#ac4d5d', '#e36387', '#ffeef2'];
      return (
        <div key={i} className="pulse" style={{
          position: 'absolute',
          top: `${Math.random() * 98}%`,
          left: `${Math.random() * 90 + 5}%`,
          fontSize: `${Math.random() * 2 + 0.5}rem`,
          opacity: 0.12,
          color: colors[i % colors.length],
          animationDelay: `${i * 0.2}s`,
          animationDuration: `${2 + Math.random() * 3}s`
        }}>
          ❤
        </div>
      );
    })}
  </div>
);

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) {
      audio.play().catch(e => console.log("Audio play blocked:", e));
    }
  };

  const addToCalendar = () => {
    const title = encodeURIComponent("Sarah & Mark's Wedding");
    const dates = "20260824T150000/20260824T220000";
    const details = encodeURIComponent("Join us for our special day!");
    const location = encodeURIComponent("The Rose Garden Estates");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <main className="invitation-container" style={{ position: 'relative', boxShadow: '0 0 50px rgba(0,0,0,0.1)' }}>
        <audio id="bg-music" loop>
          <source src={MUSIC_URL} type="audio/mpeg" />
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
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid var(--rose-vibrant)',
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

        <InvitationEnvelope isOpen={isOpen} onOpen={handleOpen} />

        {isOpen && (
          <div style={{ position: 'relative' }}>
            <FloatingHearts />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Hero />

              <div style={{ padding: '40px 20px' }}>
                <Reveal delay={100}>
                  <div style={{ textAlign: 'center', padding: '0 10px', fontStyle: 'italic', color: 'var(--rose-medium)', marginBottom: '30px' }}>
                    "Two souls with but a single thought, two hearts that beat as one."
                  </div>
                </Reveal>

                <Decoration />

                <CountdownSection />

                <Reveal delay={200}>
                  <div style={{
                    padding: '60px 40px',
                    textAlign: 'center',
                    backgroundColor: 'var(--rose-light)',
                    borderRadius: '50px',
                    margin: '40px 0',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(217, 133, 148, 0.1)'
                  }}>
                    {/* Localized Floating Hearts */}
                    {[...Array(15)].map((_, i) => (
                      <div key={i} className="pulse" style={{
                        position: 'absolute',
                        top: `${Math.random() * 80 + 10}%`,
                        left: `${Math.random() * 80 + 10}%`,
                        fontSize: `${Math.random() * 1.5 + 0.5}rem`,
                        opacity: 0.15,
                        color: 'var(--rose-vibrant)',
                        zIndex: 0,
                        animationDelay: `${i * 0.2}s`
                      }}>❤</div>
                    ))}

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '4rem',
                        opacity: 0.1,
                        color: 'var(--rose-vibrant)'
                      }}>❦</div>

                      <p style={{ fontSize: '1rem', lineHeight: 1.6, opacity: 0.8, color: 'var(--text-main)', marginBottom: '20px' }}>
                        With hearts full of love and happiness, we are delighted to announce our wedding!
                      </p>
                      <div style={{ fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6, marginBottom: '20px' }}>
                        We would be honoured to have
                      </div>

                      <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '4.5rem',
                        color: 'var(--rose-dark)',
                        margin: '10px 0',
                        lineHeight: 0.9
                      }}>
                        Mr. Guest
                      </h2>

                      <p style={{ fontSize: '1rem', marginTop: '20px', color: 'var(--text-main)', opacity: 0.8 }}>
                        join us as we celebrate this precious milestone.
                      </p>

                      <div style={{ height: '1px', width: '40px', backgroundColor: 'var(--rose-medium)', margin: '30px auto' }}></div>

                      <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text-main)', maxWidth: '280px', margin: '0 auto' }}>
                        Please save the date for a day filled with joy, laughter, and everlasting memories. Your presence will make our day truly complete.
                      </p>

                      <div style={{
                        position: 'absolute',
                        bottom: '-30px',
                        left: '50%',
                        transform: 'translateX(-50%) rotate(180deg)',
                        fontSize: '4rem',
                        opacity: 0.1,
                        color: 'var(--rose-vibrant)'
                      }}>❦</div>
                    </div>
                  </div>
                </Reveal>

                <SectionImage src="/photo_2.png" alt="Couple Kiss" height="350px" delay={400} />

                <ItineraryTimeline />

                <WeddingCalendar onAdd={addToCalendar} />

                <SectionImage src="/photo_3.png" alt="Hands" height="250px" />

                <section style={{ padding: '40px 0', textAlign: 'center' }}>
                  <Reveal delay={200}>
                    <div className="subheading" style={{ marginBottom: '15px' }}>LOCATION</div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>The Rose Garden Estates</h2>
                    <p style={{ marginBottom: '25px', opacity: 0.8, fontSize: '0.9rem' }}>123 Romance Lane, Loving Valley</p>

                    <div style={{ height: '250px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.292!2d-118.243!3d34.052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDAzJzA3LjIiTiAxMTjCsDE0JzM0LjgiVw!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                        width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                      ></iframe>
                    </div>
                    <a href="https://maps.app.goo.gl/example" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '10px 30px', fontSize: '0.9rem' }}>VIEW LOCATION</a>
                  </Reveal>
                </section>

                <PhotoCarousel />

                <Decoration />

                <RSVPFooter />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
