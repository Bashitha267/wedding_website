'use client';

import Reveal from './Reveal';
import { Users, CheckCircle, LayoutGrid } from 'lucide-react';

export default function ReservationBanner() {
  return (
    <section style={{ 
      padding: '100px 0', 
      backgroundColor: 'var(--bw-black)', 
      color: 'var(--bw-white)',
      overflow: 'hidden'
    }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <Reveal>
            <div style={{ 
              display: 'flex', 
              gap: '20px', 
              marginBottom: '30px',
              justifyContent: 'center'
            }}>
              <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
                <Users size={32} />
              </div>
              <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
                <LayoutGrid size={32} />
              </div>
            </div>
          </Reveal>
          
          <Reveal delay={200}>
            <h2 style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', 
              marginBottom: '20px',
              fontWeight: 700,
              letterSpacing: '-1px',
              lineHeight: 1.1
            }}>
              Effortless Seating.<br/>
              <span style={{ color: '#aaa' }}>Included For Free.</span>
            </h2>
          </Reveal>
          
          <Reveal delay={400}>
            <p style={{ 
              fontSize: '1.25rem', 
              lineHeight: 1.6, 
              opacity: 0.8,
              marginBottom: '50px',
              maxWidth: '700px'
            }}>
              All our templates come with powerful participant handling tools. Manage adult and children RSVPs and organize your seating arrangements at no additional cost.
            </p>
          </Reveal>
          
          <Reveal delay={600}>
            <div style={{ 
              display: 'flex', 
              gap: '40px', 
              flexWrap: 'wrap', 
              justifyContent: 'center'
            }}>
              {[
                "Adult & Child Counts",
                "Digital RSVP Portal",
                "Seating Chart Tool",
                "Instant Dashboard Updates"
              ].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={18} color="#28a745" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>{feature}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
