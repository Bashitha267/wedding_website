'use client';

import { useState } from 'react';
import Hero from "@/components/Hero";
import CountdownSection from "@/components/CountdownSection";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import RSVPFooter from "@/components/RSVPFooter";
import Reveal from '@/components/Reveal';
import Image from 'next/image';

const FUSION_PK = "#f7d7da";
const FUSION_SG = "#d4dfd1";
const FUSION_TEXT = "#5a5a5a";

const WeddingCalendar = ({ onAdd, data }: { onAdd: () => void, data?: any }) => {
  const eventDate = data?.eventDate ? new Date(data.eventDate) : new Date(2027, 2, 12);
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
        backgroundColor: '#fff',
        borderRadius: '100px 100px 0 0',
        border: `1px solid ${FUSION_SG}`,
        margin: '40px 0',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: FUSION_TEXT, marginBottom: '10px' }}>
          When Cultures Meet
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#e0aeb4', marginBottom: '20px', letterSpacing: '2px' }}>
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
              color: d === targetDay ? 'white' : FUSION_TEXT,
              zIndex: 1,
              fontWeight: d === targetDay ? 900 : 400
            }}>
              {d === targetDay ? (
                <>
                  <div style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#e0aeb4',
                    borderRadius: '50% 50% 50% 0',
                    transform: 'rotate(-45deg)',
                    zIndex: -1,
                    top: '50%',
                    left: '50%',
                    marginTop: '-16px',
                    marginLeft: '-16px',
                  }}></div>
                  <span style={{ position: 'relative', top: '-1px' }}>{d}</span>
                </>
              ) : d}
            </div>
          ))}
        </div>

        <button
          onClick={onAdd}
          style={{
            backgroundColor: FUSION_SG,
            color: FUSION_TEXT,
            border: 'none',
            borderRadius: '0px',
            padding: '12px 28px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '2px'
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
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: '#e0aeb4', marginBottom: '30px' }}>
          Our Story
        </h3>
        
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(6, 1fr)', 
            gridAutoRows: '80px', 
            gap: '10px',
            padding: '0 10px'
        }}>
            <div style={{ gridColumn: 'span 3', gridRow: 'span 3', position: 'relative', overflow: 'hidden', borderRadius: '100px 10px 10px 10px' }}>
                <Image src={photos[0]} alt="Collage 1" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ gridColumn: 'span 3', gridRow: 'span 2', position: 'relative', overflow: 'hidden', borderRadius: '10px 100px 10px 10px' }}>
                <Image src={photos[1]} alt="Collage 2" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ gridColumn: 'span 3', gridRow: 'span 3', position: 'relative', overflow: 'hidden', borderRadius: '10px 10px 10px 100px' }}>
                <Image src={photos[2]} alt="Collage 3" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ gridColumn: 'span 3', gridRow: 'span 4', position: 'relative', overflow: 'hidden', borderRadius: '10px 10px 100px 10px' }}>
                <Image src={photos[3]} alt="Collage 4" fill style={{ objectFit: 'cover' }} />
            </div>
        </div>
      </div>
    </Reveal>
  );
};

export default function FusionTemplate({ data, orderId }: { data: any, orderId?: string }) {
  const addToCalendar = () => {
    const title = encodeURIComponent(`${data?.brideName || 'Bride'} & ${data?.groomName || 'Groom'}'s Wedding`);
    const dateStr = data?.eventDate ? new Date(data.eventDate).toISOString().replace(/-|:|\.\d\d\d/g, "") : "20270312T150000Z";
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <main className="invitation-container" style={{ 
          position: 'relative', 
          backgroundColor: '#fafafa',
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/floral-paper.png")'
      }}>
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
            <Reveal>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    <div style={{ width: '40px', height: '1px', backgroundColor: FUSION_SG }}></div>
                    <span style={{ fontSize: '0.8rem', letterSpacing: '3px', color: FUSION_TEXT }}>CULTURAL SYNERGY</span>
                    <div style={{ width: '40px', height: '1px', backgroundColor: FUSION_SG }}></div>
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', color: FUSION_TEXT, margin: 0, fontStyle: 'italic' }}>
                    {data?.brideName} & {data?.groomName}
                </h1>
                <p style={{ marginTop: '20px', fontSize: '1.2rem', color: '#e0aeb4', fontWeight: 500 }}>
                    Two worlds, one love.
                </p>
            </Reveal>
        </div>

        <div style={{ padding: '40px 20px' }}>
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
