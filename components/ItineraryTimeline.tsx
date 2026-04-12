'use client';

import Reveal from './Reveal';

const ItineraryTimeline = ({ data }: { data?: any }) => {
  const defaultEvents = [
    { time: '3:00 PM', name: 'CEREMONY', icon: '💍', desc: 'The Rose Garden' },
    { time: '4:30 PM', name: 'COCKTAILS', icon: '🍸', desc: 'Main Terrace' },
    { time: '6:00 PM', name: 'DINNER', icon: '🍽️', desc: 'Victoria Hall' },
    { time: '9:00 PM', name: 'PARTY', icon: '💃', desc: 'Dance Floor' },
    { time: '11:00 PM', name: 'SEND OFF', icon: '✨', desc: 'Grand Exit' }
  ];

  let events: { time: string; name: string; icon: string; desc: string }[] = [];
  if (data?.timeline && data.timeline.length > 0) {
    events = data.timeline.map((t: any) => ({
      time: t.time || '',
      name: t.title || '',
      icon: t.icon || '✨',
      desc: t.location || ''
    }));
  } else if (!data) {
    // Show defaults only on marketing preview page, not on live client sites
    events = defaultEvents;
  }

  if (events.length === 0) return null;

  return (
    <section className="itinerary-section" style={{ padding: '60px 10px', backgroundColor: 'var(--card-bg)' }}>
      <Reveal delay={200}>
        <div className="subheading" style={{ textAlign: 'center', marginBottom: '10px' }}>ITINERARY</div>
        <div style={{ height: '1px', width: '60px', backgroundColor: 'var(--rose-medium)', margin: '0 auto 40px' }}></div>
      </Reveal>

      <div style={{ position: 'relative', maxWidth: '440px', margin: '0 auto' }}>
        {/* Vertical Line */}
        <div style={{ 
          position: 'absolute', 
          left: '50%', 
          top: 20, 
          bottom: 20, 
          width: '1px', 
          backgroundColor: 'var(--rose-light)',
          transform: 'translateX(-50%)'
        }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          {events.map((event, index) => {
            const isLeft = index % 2 === 0;
            return (
              <Reveal key={index} delay={index * 150 + 400}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 60px 1fr', 
                  alignItems: 'center',
                  width: '100%'
                }}>
                  {/* Left Column */}
                  <div style={{ 
                    textAlign: 'right', 
                    paddingRight: '15px',
                    opacity: isLeft ? 1 : 0,
                    pointerEvents: isLeft ? 'auto' : 'none'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--rose-medium)' }}>{event.time}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: '2px 0' }}>{event.name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{event.desc}</div>
                  </div>

                  {/* Middle Column (Circle) */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    <div style={{ 
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-cream)',
                      border: '1px solid var(--rose-medium)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                    }}>
                      {event.icon}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div style={{ 
                    textAlign: 'left', 
                    paddingLeft: '15px',
                    opacity: !isLeft ? 1 : 0,
                    pointerEvents: !isLeft ? 'auto' : 'none'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--rose-medium)' }}>{event.time}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: '2px 0' }}>{event.name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{event.desc}</div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Only show dresscode if client entered it or if it is the preview store catalog (!data) */}
      {((data && (data?.dressCode?.title || data?.dressCode?.description)) || !data) && (
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
            <Reveal delay={1000}>
                  <div className="subheading" style={{ marginBottom: '15px' }}>DRESS CODE</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 300, marginBottom: '10px' }}>
                     {data?.dressCode?.title || (!data ? 'Formal Attire' : '')}
                  </div>
                  <div style={{ fontSize: '2.5rem' }}>
                     {data?.dressCode?.icon || (!data ? '🤵‍♂️  👰‍♀️' : '')}
                  </div>
                  <p style={{ fontSize: '0.8rem', marginTop: '10px', opacity: 0.7 }}>
                     {data?.dressCode?.description || (!data ? 'Kindly request that guests avoid wearing white.' : '')}
                  </p>
            </Reveal>
        </div>
      )}
    </section>
  );
};

export default ItineraryTimeline;
