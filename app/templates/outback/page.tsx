'use client';

import { useState } from 'react';
import Hero from "@/components/Hero";
import CountdownSection from "@/components/CountdownSection";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import RSVPFooter from "@/components/RSVPFooter";
import Reveal from '@/components/Reveal';
import Image from 'next/image';

const OUTBACK_SAGE = "#7ea08d";
const OUTBACK_EARTH = "#a67c52";
const OUTBACK_CREAM = "#f9f6f0";

const WeddingCalendar = ({ onAdd, data }: { onAdd: () => void, data?: any }) => {
  const eventDate = data?.eventDate ? new Date(data.eventDate) : new Date(2026, 9, 10);
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
        backgroundColor: OUTBACK_CREAM,
        borderRadius: '0px',
        border: `8px solid white`,
        outline: `1px solid ${OUTBACK_EARTH}`,
        margin: '40px 0',
        boxShadow: '0 10px 40px rgba(166, 124, 82, 0.1)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")'
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: OUTBACK_EARTH, marginBottom: '10px' }}>
          Join us Under the Stars
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 600, color: OUTBACK_SAGE, marginBottom: '20px', letterSpacing: '2px' }}>
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
            <div key={`${d}-${i}`} style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.5, color: OUTBACK_EARTH }}>{d}</div>
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
              color: d === targetDay ? 'white' : OUTBACK_EARTH,
              zIndex: 1,
              fontWeight: d === targetDay ? 900 : 500
            }}>
              {d === targetDay ? (
                <>
                  <div style={{
                    position: 'absolute',
                    width: '30px',
                    height: '30px',
                    backgroundColor: OUTBACK_SAGE,
                    transform: 'rotate(45deg)',
                    zIndex: -1,
                    top: '50%',
                    left: '50%',
                    marginTop: '-15px',
                    marginLeft: '-15px',
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
            backgroundColor: 'transparent',
            color: OUTBACK_EARTH,
            border: `2px solid ${OUTBACK_EARTH}`,
            padding: '12px 28px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = OUTBACK_EARTH; e.currentTarget.style.color = 'white'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = OUTBACK_EARTH; }}
        >
          SAVE OUR DATE
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
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: OUTBACK_EARTH, marginBottom: '30px' }}>
          Life in the Bush
        </h3>
        
        <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '20px', 
            justifyContent: 'center',
            padding: '0 10px'
        }}>
            <div style={{ width: '180px', height: '180px', position: 'relative', transform: 'rotate(-3deg)', border: '10px solid white', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                <Image src={photos[0]} alt="Collage 1" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ width: '180px', height: '180px', position: 'relative', transform: 'rotate(2deg)', border: '10px solid white', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                <Image src={photos[1]} alt="Collage 2" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ width: '180px', height: '180px', position: 'relative', transform: 'rotate(-1deg)', border: '10px solid white', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                <Image src={photos[2]} alt="Collage 3" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ width: '180px', height: '220px', position: 'relative', transform: 'rotate(4deg)', border: '10px solid white', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                <Image src={photos[3]} alt="Collage 4" fill style={{ objectFit: 'cover' }} />
            </div>
        </div>
      </div>
    </Reveal>
  );
};

export default function OutbackTemplate({ data, orderId }: { data: any, orderId?: string }) {
  const addToCalendar = () => {
    const title = encodeURIComponent(`${data?.brideName || 'Bride'} & ${data?.groomName || 'Groom'}'s Wedding`);
    const dateStr = data?.eventDate ? new Date(data.eventDate).toISOString().replace(/-|:|\.\d\d\d/g, "") : "20261010T150000Z";
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: OUTBACK_SAGE, minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <main className="invitation-container" style={{ 
          position: 'relative', 
          backgroundColor: OUTBACK_CREAM,
          borderRadius: '40px',
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ 
            height: '400px', 
            position: 'relative',
            backgroundImage: `url(${data?.images?.heroImage || '/home_hero_bg.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)' }} />
            <div style={{ position: 'absolute', bottom: '40px', left: '0', width: '100%', textAlign: 'center', color: 'white' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', margin: 0 }}>G'day from us!</h1>
                <p style={{ letterSpacing: '3px', opacity: 0.9 }}>{data?.brideName} & {data?.groomName}</p>
            </div>
        </div>

        <div style={{ padding: '40px 20px' }}>
          <Reveal delay={100}>
            <div style={{ fontStyle: 'italic', textAlign: 'center', color: OUTBACK_EARTH, marginBottom: '30px' }}>
                "Wild hearts and wide horizons. Join us for a rustic celebration in the outback."
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
