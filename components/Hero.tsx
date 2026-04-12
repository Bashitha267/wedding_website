'use client';

import Reveal from './Reveal';

const Hero = ({ data }: { data?: any }) => {
  return (
    <section className="hero-section" style={{ 
      height: '85vh',
      width: '100%',
      position: 'relative',
      backgroundImage: `url("${data?.images?.heroImage || '/home_hero_bg.png'}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      {/* Dark overlay for contrast */}
      <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1
      }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
        <Reveal delay={200}>
          <h1 style={{ 
            fontSize: '5.5rem', 
            marginBottom: '20px',
            lineHeight: 1.1,
            fontFamily: 'var(--font-display)',
            color: '#ffeef2',
            textShadow: `
              0 4px 20px rgba(0,0,0,0.8),
              0 0 10px rgba(227, 99, 135, 0.4)
            `
          }}>
            {data?.brideName || 'Sarah'} & {data?.groomName || 'Mark'}
          </h1>
        </Reveal>

        <Reveal delay={400}>
          <div className="subheading" style={{ 
              marginBottom: '20px', 
              letterSpacing: '6px',
              color: 'var(--rose-vibrant)',
              fontSize: '1rem',
              fontWeight: 800,
              textShadow: '0 2px 10px rgba(0,0,0,0.6)'
          }}>
            WE ARE GETTING MARRIED!
          </div>
        </Reveal>

        <Reveal delay={600}>
          <div style={{ 
            fontSize: '1.4rem', 
            color: 'white',
            letterSpacing: '5px',
            fontWeight: 700,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}>
            {data?.eventDate ? new Date(data.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() : 'AUGUST 24, 2026'}
          </div>
        </Reveal>
      </div>

      {/* Torn Paper Effect at Bottom */}
      <div style={{
          position: 'absolute',
          bottom: '-2px',
          left: 0,
          width: '100%',
          height: '40px',
          zIndex: 3,
          backgroundColor: 'var(--bg-cream)',
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 30%, 98% 45%, 95% 35%, 92% 50%, 88% 30%, 85% 45%, 82% 35%, 78% 50%, 75% 30%, 72% 45%, 68% 35%, 65% 50%, 62% 30%, 58% 45%, 55% 35%, 52% 50%, 48% 30%, 45% 45%, 42% 35%, 38% 50%, 35% 30%, 32% 45%, 28% 35%, 25% 50%, 22% 30%, 18% 45%, 15% 35%, 12% 50%, 8% 30%, 5% 45%, 2% 35%, 0% 50%)'
      }} />
    </section>
  );
};

export default Hero;
