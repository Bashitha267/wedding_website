'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <div style={{ position: 'relative', width: '180px', height: '60px' }}>
            <Image 
              src="/logo.png" 
              alt="KNOT STORY Logo" 
              fill 
              style={{ objectFit: 'contain' }}
            />
          </div>
        </Link>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {/* Desktop Links */}
          <div className="desktop-links" style={{ gap: '30px', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'var(--bw-black)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '2px', fontWeight: 500 }}>HOME</Link>
            <Link href="/contact" style={{ color: 'var(--bw-black)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '2px', fontWeight: 500 }}>CONTACT</Link>
          </div>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-cart', { detail: null }))}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--bw-black)'
            }}
          >
            <ShoppingCart size={20} />
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--bw-black)'
            }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          backgroundColor: 'white', borderBottom: '1px solid #eee',
          padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--bw-black)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, letterSpacing: '2px' }}>HOME</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--bw-black)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, letterSpacing: '2px' }}>CONTACT</Link>
        </div>
      )}

      <style jsx>{`
        .desktop-links { display: flex; }
        .mobile-toggle { display: none; }
        
        @media (max-width: 768px) {
          .desktop-links { display: none; }
          .mobile-toggle { display: flex; }
        }

        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </nav>
  );
}
