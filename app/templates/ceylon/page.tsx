'use client';

import { useState } from 'react';
import Hero from "@/components/Hero";
import CountdownSection from "@/components/CountdownSection";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import RSVPFooter from "@/components/RSVPFooter";
import Reveal from '@/components/Reveal';
import Image from 'next/image';

const TROPICAL_GREEN = "#2d5a27";
const TROPICAL_TEAL = "#0a8da0";
const TROPICAL_WHITE = "#ffffff";

const WeddingCalendar = ({ onAdd, data }: { onAdd: () => void, data?: any }) => {
  const eventDate = data?.eventDate ? new Date(data.eventDate) : new Date(2026, 6, 20);
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
        backgroundColor: '#f0fcf9',
        borderRadius: '50px 0 50px 0',
        border: `2px solid ${TROPICAL_TEAL}`,
        margin: '40px 0',
        boxShadow: '0 10px 30px rgba(10, 141, 160, 0.1)'
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: TROPICAL_GREEN, marginBottom: '10px' }}>
          Tropical Paradise
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 600, color: TROPICAL_TEAL, marginBottom: '20px', letterSpacing: '4px' }}>
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
            <div key={`${d}-${i}`} style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.5, color: TROPICAL_GREEN }}>{d}</div>
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
              color: d === targetDay ? 'white' : TROPICAL_GREEN,
              zIndex: 1,
              fontWeight: d === targetDay ? 900 : 500
            }}>
              {d === targetDay ? (
                <>
                  <div style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    backgroundColor: TROPICAL_TEAL,
                    borderRadius: '50%',
                    zIndex: -1,
                    top: '50%',
                    left: '50%',
                    marginTop: '-16px',
                    marginLeft: '-16px',
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
            backgroundColor: TROPICAL_GREEN,
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 30px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(45, 90, 39, 0.3)'
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
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: TROPICAL_GREEN, marginBottom: '30px' }}>
          By the Shore
        </h3>
        
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '15px',
            padding: '0 10px'
        }}>
            <div style={{ gridColumn: 'span 2', height: '200px', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
                <Image src={photos[0]} alt="Collage 1" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ height: '180px', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
                <Image src={photos[1]} alt="Collage 2" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ height: '180px', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
                <Image src={photos[2]} alt="Collage 3" fill style={{ objectFit: 'cover' }} />
            </div>
        </div>
      </div>
    </Reveal>
  );
};

export default function CeylonTemplate({ data, orderId }: { data: any, orderId?: string }) {
  const addToCalendar = () => {
    const title = encodeURIComponent(`${data?.brideName || 'Bride'} & ${data?.groomName || 'Groom'}'s Wedding`);
    const dateStr = data?.eventDate ? new Date(data.eventDate).toISOString().replace(/-|:|\.\d\d\d/g, "") : "20260720T150000Z";
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#eaf4f1', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <main className="invitation-container" style={{ 
          position: 'relative', 
          backgroundColor: TROPICAL_WHITE,
          boxShadow: '0 0 40px rgba(0,0,0,0.05)',
      }}>
        <div style={{
            height: '100vh',
            width: '100%',
            position: 'relative',
        }}>
            <Image 
                src={data?.images?.heroImage || '/home_hero_bg.png'} 
                alt="Tropical Hero" 
                fill 
                style={{ objectFit: 'cover' }}
            />
            <div style={{ 
                position: 'absolute', 
                inset: 0, 
                backgroundColor: 'rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center'
            }}>
                <Reveal>
                    <div style={{ fontSize: '1rem', letterSpacing: '5px' }}>ALOHA & AYUBOWAN</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', margin: '20px 0' }}>{data?.brideName} & {data?.groomName}</h1>
                    <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>We're getting married!</div>
                </Reveal>
            </div>
        </div>

        <div style={{ padding: '40px 20px' }}>
          <Reveal delay={100}>
             <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 5C30 5 35 15 45 15C55 15 55 25 55 30C55 45 40 55 30 55C20 55 5 45 5 30C5 25 5 15 15 15C25 15 30 5 30 5Z" stroke={TROPICAL_GREEN} strokeWidth="2" />
                </svg>
                <p style={{ marginTop: '20px', color: TROPICAL_GREEN, lineHeight: 1.6 }}>
                    Join us for a day of sun, sand, and tropical bliss as we celebrate our love in the beautiful island of Sri Lanka.
                </p>
             </div>
          </Reveal>

          <CountdownSection data={data} />

          <WeddingCalendar onAdd={addToCalendar} data={data} />

          <PhotoCollage data={data} />

          <ItineraryTimeline data={data} />

          <RSVPFooter orderId={orderId} data={data} />
        </div>
      </main>
    </div>
  );
}
