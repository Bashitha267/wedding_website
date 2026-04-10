'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: '10px 0',
      transition: 'all 0.3s ease',
      backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
      borderBottom: scrolled ? '1px solid #eee' : '1px solid rgba(255,255,255,0.1)',
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link href="/" style={{ 
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
        }}>
          <div style={{ position: 'relative', width: '120px', height: '60px' }}>
            <Image 
              src="/LOGO.png" 
              alt="KNOT STORY Logo" 
              fill 
              style={{ objectFit: 'contain' }}
            />
          </div>
        </Link>

        <div style={{ display: 'flex', gap: '30px' }}>
          <Link href="/" style={{ color: 'var(--bw-black)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '1px', fontWeight: 500 }}>HOME</Link>
          <Link href="/contact" style={{ color: 'var(--bw-black)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '1px', fontWeight: 500 }}>CONTACT</Link>
        </div>
      </div>
    </nav>
  );
}
