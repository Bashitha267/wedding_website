'use client';

import { templates } from '@/app/data';
import Image from 'next/image';
import Reveal from './Reveal';
import Link from 'next/link';

export default function ProductsSection() {
  return (
    <section id="products" style={{ backgroundColor: 'var(--bw-gray-light)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '60px' }}>
          <Reveal>
            <h2 style={{ fontSize: '3rem', textTransform: 'uppercase', marginBottom: '10px' }}>Exquisite Collections</h2>
            <div style={{ width: '60px', height: '2px', backgroundColor: 'var(--bw-black)', margin: '0 auto 20px' }}></div>
            <p style={{ color: 'var(--bw-gray-medium)', letterSpacing: '2px' }}>DISCOVER THE PERFECT INVITATION FOR YOUR BIG DAY</p>
          </Reveal>
        </div>

        <div className="grid grid-3">
          {templates.map((template, index) => (
            <Reveal key={template.id} delay={index * 100}>
              <div style={{ 
                backgroundColor: 'var(--bw-white)', 
                borderRadius: '4px', 
                overflow: 'hidden', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease'
              }}
              className="product-card"
              >
                <div style={{ position: 'relative', height: '350px' }}>
                  <Image 
                    src={template.image} 
                    alt={template.name} 
                    fill 
                    style={{ objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    padding: '5px 15px',
                    fontSize: '0.7rem',
                    letterSpacing: '1px',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {template.theme}
                  </div>
                </div>
                <div style={{ padding: '25px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{template.name}</h3>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 20px', fontSize: '0.8rem' }}
                      onClick={() => window.dispatchEvent(new CustomEvent('open-cart', { detail: template }))}
                    >
                      ADD TO CART
                    </button>
                    <Link href={`/templates/${template.id}`} className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.8rem', textDecoration: 'none' }}>
                      VIEW
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style jsx>{`
        .product-card:hover {
          transform: translateY(-10px);
        }
      `}</style>
    </section>
  );
}
