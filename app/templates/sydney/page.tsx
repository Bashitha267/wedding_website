'use client';

import { useState } from 'react';
import Hero from "@/components/Hero";
import CountdownSection from "@/components/CountdownSection";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import RSVPFooter from "@/components/RSVPFooter";
import Reveal from '@/components/Reveal';
import Image from 'next/image';

const SYDNEY_NAVY = "#001f3f";
const SYDNEY_GOLD = "#c5a059";
const SYDNEY_WHITE = "#ffffff";

const WeddingCalendar = ({ onAdd, data }: { onAdd: () => void, data?: any }) => {
  const eventDate = data?.eventDate ? new Date(data.eventDate) : new Date(2026, 8, 5);
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
        backgroundColor: SYDNEY_NAVY,
        color: 'white',
        borderRadius: '0px',
        margin: '40px 0',
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decor line */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', backgroundColor: SYDNEY_GOLD }} />
        
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: SYDNEY_GOLD, marginBottom: '10px' }}>
          Urban Sophistication
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(255,255,255,0.6)', marginBottom: '20px', letterSpacing: '5px' }}>
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
            <div key={`${d}-${i}`} style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.3 }}>{d}</div>
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
              color: d === targetDay ? SYDNEY_NAVY : 'white',
              zIndex: 1,
              fontWeight: d === targetDay ? 900 : 300
            }}>
              {d === targetDay ? (
                <>
                  <div style={{
                    position: 'absolute',
                    width: '35px',
                    height: '35px',
                    backgroundColor: SYDNEY_GOLD,
                    zIndex: -1,
                    top: '50.5%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
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
            color: SYDNEY_GOLD,
            border: `1px solid ${SYDNEY_GOLD}`,
            padding: '12px 30px',
            fontSize: '0.9rem',
            fontWeight: 400,
            cursor: 'pointer',
            letterSpacing: '3px',
            textTransform: 'uppercase'
          }}
        >
          Add to Calendar
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
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: SYDNEY_NAVY, marginBottom: '30px' }}>
          Modern Love
        </h3>
        
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '10px',
            padding: '0 10px'
        }}>
            <div style={{ height: '300px', position: 'relative', overflow: 'hidden' }}>
                <Image src={photos[0]} alt="Collage 1" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px', height: '150px' }}>
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <Image src={photos[1]} alt="Collage 2" fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <Image src={photos[2]} alt="Collage 3" fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <Image src={photos[3]} alt="Collage 4" fill style={{ objectFit: 'cover' }} />
                </div>
            </div>
        </div>
      </div>
    </Reveal>
  );
};

export default function SydneyTemplate({ data, orderId }: { data: any, orderId?: string }) {
  const addToCalendar = () => {
    const title = encodeURIComponent(`${data?.brideName || 'Bride'} & ${data?.groomName || 'Groom'}'s Wedding`);
    const dateStr = data?.eventDate ? new Date(data.eventDate).toISOString().replace(/-|:|\.\d\d\d/g, "") : "20260905T150000Z";
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <main className="invitation-container" style={{ 
          position: 'relative', 
          backgroundColor: SYDNEY_WHITE,
          border: `1px solid #f0f0f0`
      }}>
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Reveal>
                <div style={{ fontSize: '0.9rem', letterSpacing: '8px', color: SYDNEY_GOLD, marginBottom: '20px' }}>TOGETHER WITH THEIR FAMILIES</div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4.5rem', color: SYDNEY_NAVY, margin: '10px 0' }}>
                    {data?.brideName} <br /> & <br /> {data?.groomName}
                </h1>
                <div style={{ height: '2px', width: '50px', backgroundColor: SYDNEY_GOLD, margin: '30px auto' }}></div>
                <p style={{ fontSize: '1.2rem', fontWeight: 300, color: SYDNEY_NAVY }}>Invite you to celebrate their wedding</p>
            </Reveal>
        </div>

        <div style={{ position: 'relative', height: '400px', margin: '0 20px', overflow: 'hidden' }}>
             <Image src={data?.images?.heroImage || '/home_hero_bg.png'} alt="Hero" fill style={{ objectFit: 'cover' }} />
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
