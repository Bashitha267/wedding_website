'use client';

import Reveal from './Reveal';
import Image from 'next/image';

export default function AboutSection() {
  return (
    <section style={{ backgroundColor: 'var(--bw-white)' }}>
      <div className="container">
        <div className="grid grid-2" style={{ alignItems: 'center' }}>
          <Reveal>
            <div style={{ position: 'relative', height: '500px', borderRadius: '8px', overflow: 'hidden' }}>
              <Image 
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" 
                alt="About Us" 
                fill 
                style={{ objectFit: 'cover' }}
              />
            </div>
          </Reveal>
          
          <div style={{ padding: '0 40px' }}>
            <Reveal delay={200}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', textTransform: 'uppercase' }}>Our Pure Intention</h2>
            </Reveal>
            <Reveal delay={400}>
              <p style={{ fontSize: '1.2rem', color: 'var(--bw-gray-dark)', marginBottom: '20px' }}>
                At KNOT STORY, we believe that your wedding invitation is more than just a piece of paper or a digital link – it's the first glimpse your guests get into the beautiful journey you're about to embark on.
              </p>
              <p style={{ fontSize: '1.2rem', color: 'var(--bw-gray-dark)', marginBottom: '30px' }}>
                We specialize in creating elegant, modern, and deeply romantic invitations that capture the unique essence of your love story. Our designs are crafted with meticulous attention to detail, ensuring every element reflects the magic of your special day.
              </p>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700 }}>500+</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--bw-gray-medium)' }}>WEDDINGS</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700 }}>10+</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--bw-gray-medium)' }}>TEMPLATES</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700 }}>100%</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--bw-gray-medium)' }}>HAPPINESS</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
