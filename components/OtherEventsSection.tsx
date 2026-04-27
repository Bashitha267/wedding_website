'use client';

import React from 'react';
import { 
  Cake, 
  Church, 
  Heart, 
  Baby, 
  Briefcase, 
  Sparkles, 
  CalendarHeart, 
  CloudSun, 
  HandHeart, 
  Trophy, 
  Rocket 
} from 'lucide-react';
import Reveal from './Reveal';

const eventTypes = [
  { name: 'Birthday events', icon: <Cake size={24} /> },
  { name: 'Holy communion', icon: <Church size={24} /> },
  { name: 'Engagements', icon: <Heart size={24} /> },
  { name: 'Baby showers', icon: <Baby size={24} /> },
  { name: 'Corporate events', icon: <Briefcase size={24} /> },
  { name: 'Religious or cultural events', icon: <Sparkles size={24} /> },
  { name: 'Anniversary celebrations', icon: <CalendarHeart size={24} /> },
  { name: 'Seasonal celebrations', icon: <CloudSun size={24} /> },
  { name: 'Fundraising / charity events', icon: <HandHeart size={24} /> },
  { name: 'Award ceremonies', icon: <Trophy size={24} /> },
  { name: 'Product launches / brand events', icon: <Rocket size={24} /> },
];

const OtherEventsSection = () => {
  return (
    <section id="other-events" style={{ padding: '120px 0', backgroundColor: 'var(--bw-gray-light)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative floral element */}
      <div style={{ 
        position: 'absolute', 
        top: '-100px', 
        right: '-100px', 
        width: '400px', 
        height: '400px', 
        opacity: 0.1,
        pointerEvents: 'none',
        transform: 'rotate(15deg)'
      }}>
        <img src="/botanical_baby_breath.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      
      <div style={{ 
        position: 'absolute', 
        bottom: '-100px', 
        left: '-100px', 
        width: '400px', 
        height: '400px', 
        opacity: 0.1,
        pointerEvents: 'none',
        transform: 'scaleX(-1) rotate(15deg)'
      }}>
        <img src="/botanical_baby_breath.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <Reveal>
            <h4 style={{ 
              letterSpacing: '4px', 
              color: 'var(--bw-gray-medium)', 
              marginBottom: '15px', 
              textTransform: 'uppercase', 
              fontSize: '0.9rem' 
            }}>
              Beyond Weddings
            </h4>
            <h2 className="font-romantic" style={{ 
              fontSize: '4rem', 
              color: 'var(--bw-black)', 
              marginBottom: '25px', 
              lineHeight: '1.1' 
            }}>
              Celebrating Every Milestone
            </h2>
            <p style={{ 
              fontSize: '1.2rem', 
              color: 'var(--bw-gray-dark)', 
              maxWidth: '700px', 
              margin: '0 auto',
              lineHeight: '1.8' 
            }}>
              Our elegant digital solutions aren't just for weddings. From intimate birthdays to grand corporate launches, 
              we bring the same touch of class to every event you host.
            </p>
          </Reveal>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '30px' 
        }}>
          {eventTypes.map((event, index) => (
            <Reveal key={index} delay={index * 50}>
              <div className="event-card" style={{
                padding: '40px 30px',
                backgroundColor: 'var(--bw-white)',
                borderRadius: '15px',
                textAlign: 'center',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                border: '1px solid transparent',
                boxShadow: '0 5px 15px rgba(0,0,0,0.02)',
                cursor: 'default'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bw-gray-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--bw-black)',
                  boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }} className="icon-wrapper">
                  {event.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  color: 'var(--bw-black)', 
                  fontWeight: '500',
                  margin: 0
                }}>
                  {event.name}
                </h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style jsx>{`
        .event-card:hover {
          transform: translateY(-10px);
          border-color: #eee;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .event-card:hover .icon-wrapper {
          background-color: var(--bw-black);
          color: var(--bw-white);
          transform: scale(1.1);
        }
        @media (max-width: 768px) {
          h2 {
            font-size: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default OtherEventsSection;
