'use client';

import Reveal from './Reveal';

const RSVPFooter = () => {
  return (
    <footer style={{ 
      padding: '60px 40px 100px', 
      textAlign: 'center',
      backgroundColor: 'var(--bg-cream)',
      marginTop: '40px'
    }}>
      <Reveal delay={200}>
        <div style={{ marginBottom: '60px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎁</div>
            <div className="subheading" style={{ marginBottom: '15px' }}>GIFT SUGGESTIONS</div>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, maxWidth: '280px', margin: '0 auto' }}>
                Your presence is our greatest gift, but should you wish to honor us with a gift, a contribution to our future together would be warmly appreciated.
            </p>
            <div style={{ marginTop: '20px', fontWeight: 600, color: 'var(--rose-dark)' }}>HONEYMOON FUND</div>
        </div>
      </Reveal>

      <Reveal delay={400}>
        <div style={{ marginBottom: '60px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏨</div>
            <div className="subheading" style={{ marginBottom: '15px' }}>WHERE TO STAY</div>
            <div style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: 600 }}>Hotel Regina Resort</div>
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.8rem', marginTop: '5px' }}>More Info</button>
            </div>
            <div>
                <div style={{ fontWeight: 600 }}>The Boutique House</div>
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.8rem', marginTop: '5px' }}>More Info</button>
            </div>
        </div>
      </Reveal>
      
      <Reveal delay={600}>
        <div style={{ marginBottom: '60px' }}>
            <div className="subheading" style={{ marginBottom: '20px' }}>PLEASE RSVP</div>
            <button className="btn-primary" style={{ padding: '16px 48px' }}>
            RSVP HERE
            </button>
        </div>
      </Reveal>

      <Reveal delay={800}>
        <div style={{ 
          marginTop: '60px',
          position: 'relative',
          height: '500px',
          width: 'calc(100% + 80px)',
          margin: '60px -40px -100px',
          backgroundImage: 'url("/photo_5.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
        }}>
            {/* Darker overlay for mood and contrast */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                zIndex: 1
            }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ 
                    fontSize: '5.5rem', 
                    fontFamily: 'var(--font-display)', 
                    color: '#ffeef2',
                    textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 15px rgba(217, 133, 148, 0.5)'
                }}>
                    Thank You
                </div>
                <div className="subheading" style={{ marginTop: '10px', letterSpacing: '6px', color: 'var(--rose-vibrant)', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
                    SARAH & MARK • 2026
                </div>
            </div>
        </div>
      </Reveal>
    </footer>
  );
};

export default RSVPFooter;
