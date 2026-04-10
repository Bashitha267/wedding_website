'use client';

import Image from 'next/image';
import Reveal from './Reveal';

export default function LandingHero() {
  return (
    <section style={{
      position: 'relative',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: 0
    }}>
      <Image
        src="https://images.unsplash.com/photo-1549416878-b9ca95e26903?q=80&w=2070&auto=format&fit=crop"
        alt="Wedding Hero"
        fill
        style={{ objectFit: 'cover', opacity: 0.8 }}
        priority
      />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Reveal>
          <h1 className="font-romantic" style={{
            fontSize: 'min(5rem, 15vw)',
            color: 'var(--bw-white)',
            marginBottom: '20px',
            textShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            Eternal Memories
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p style={{
            fontSize: '1.5rem',
            color: 'var(--bw-white)',
            maxWidth: '600px',
            margin: '0 auto 40px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: 300
          }}>
            We make your dream wedding invitation a beautiful reality.
          </p>
        </Reveal>
        <Reveal delay={400}>
          <button className="btn-primary" style={{
            backgroundColor: 'var(--bw-white)',
            color: 'var(--bw-black)',
            border: 'none',
            padding: '15px 40px',
            fontSize: '0.9rem'
          }}
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          >
            VIEW OUR TEMPLATES
          </button>
        </Reveal>
      </div>
    </section>
  );
}
