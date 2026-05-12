'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    
    const text = `*New Contact Message*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Subject:* ${subject}%0A*Message:* ${message}`;
    const whatsappUrl = `https://wa.me/94769996430?text=${text}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <main>
      <Navbar />
      
      {/* Hero Header */}
      <section style={{ 
        height: '40vh', 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--bw-black)',
        color: 'var(--bw-white)',
        padding: 0
      }}>
        <div className="container text-center">
          <Reveal>
            <h1 className="font-romantic" style={{ fontSize: '4rem', marginBottom: '10px' }}>Contact Us</h1>
            <p style={{ letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.7, fontSize: '0.9rem' }}>We are here to help you</p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="grid grid-2" style={{ gap: '60px' }}>
            {/* Contact Info */}
            <div>
              <Reveal>
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '2rem', marginBottom: '20px', textTransform: 'uppercase' }}>Get In Touch</h2>
                  <p style={{ color: 'var(--bw-gray-dark)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                    Every wedding is unique, and we're here to ensure your invitations reflect that perfectly. Whether you have questions about our templates or need a custom solution, our team is ready to assist you.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.5rem' }}>📍</div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>OFFICE</h4>
                      <p style={{ color: 'var(--bw-gray-medium)' }}>Negombo, Sri Lanka</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.5rem' }}>📞</div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>WHATSAPP</h4>
                      <a href="https://wa.me/94769996430" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--bw-gray-medium)', textDecoration: 'none' }}>0769996430</a>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.5rem' }}>✉️</div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>EMAIL</h4>
                      <a href="mailto:invite.knotstory@gmail.com" style={{ color: 'var(--bw-gray-medium)', textDecoration: 'none' }}>invite.knotstory@gmail.com</a>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  marginTop: '50px', 
                  padding: '40px', 
                  backgroundColor: 'var(--bw-gray-light)', 
                  borderRadius: '8px', 
                  textAlign: 'center' 
                }}>
                  <p className="font-romantic" style={{ fontSize: '2rem', color: 'var(--bw-black)', marginBottom: '10px' }}>
                    "A blessing for your journey..."
                  </p>
                  <p style={{ fontStyle: 'italic', color: 'var(--bw-gray-dark)' }}>
                    May your life together be full of love and your love be full of life. We are honored to be a small part of your new beginning.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Contact Form */}
            <div>
              <Reveal delay={200}>
                <div className="form-container">
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '30px', textTransform: 'uppercase', textAlign: 'center' }}>Send a Message</h3>
                  
                  <form onSubmit={handleWhatsAppSend} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-grid">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>NAME</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} 
                          placeholder="Your Name" 
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>EMAIL</label>
                        <input 
                          type="email" 
                          required 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} 
                          placeholder="your@email.com" 
                        />
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>SUBJECT</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} 
                        placeholder="How can we help?" 
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>MESSAGE</label>
                      <textarea 
                        rows={5} 
                        required 
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', resize: 'none' }} 
                        placeholder="Tell us about your dream invitation..."
                      ></textarea>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                      SEND MESSAGE (WHATSAPP)
                    </button>
                    
                    <p style={{ fontSize: '0.8rem', textAlign: 'center', color: 'var(--bw-gray-medium)', marginTop: '10px' }}>
                      Your satisfaction is our priority. We typically respond within 24 hours.
                    </p>
                  </form>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Partial */}
      <footer style={{ backgroundColor: 'var(--bw-gray-light)', padding: '60px 0', borderTop: '1px solid #eee', marginTop: '100px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ position: 'relative', width: '200px', height: '80px' }}>
                <Image src="https://res.cloudinary.com/dnfbik3if/image/upload/v1776967066/logo_bfzkos.png" alt="KNOT STORY Logo" fill style={{ objectFit: 'contain', objectPosition: 'left' }} />
              </div>
            </div>
            <p style={{ color: 'var(--bw-gray-medium)', fontSize: '0.9rem' }}>
              Premium wedding invitations designed with love and elegance for your most special day.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase', color: 'var(--bw-black)' }}>Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link href="/" style={{ color: 'var(--bw-gray-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>Home</Link></li>
              <li><Link href="/#products" style={{ color: 'var(--bw-gray-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>Templates</Link></li>
              <li><Link href="/contact" style={{ color: 'var(--bw-gray-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>Contact</Link></li>
              <li><Link href="/client/login" style={{ color: 'var(--bw-gray-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>Client Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase', color: 'var(--bw-black)' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ color: 'var(--bw-gray-dark)', fontSize: '0.9rem' }}>
                <span style={{ marginRight: '8px' }}>💬</span>
                <a href="https://wa.me/94769996430" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>WhatsApp</a>
              </li>
              <li style={{ color: 'var(--bw-gray-dark)', fontSize: '0.9rem' }}>
                <span style={{ marginRight: '8px' }}>✉️</span>
                <a href="mailto:invite.knotstory@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>Email Us</a>
              </li>
              <li style={{ color: 'var(--bw-gray-dark)', fontSize: '0.9rem' }}>
                <span style={{ marginRight: '8px' }}>📍</span>
                Negombo, Sri Lanka
              </li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase', color: 'var(--bw-black)' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: '15px', color: 'var(--bw-gray-dark)' }}>
              <span style={{ cursor: 'pointer', opacity: 0.6 }}>Instagram</span>
              <span style={{ cursor: 'pointer', opacity: 0.6 }}>Pinterest</span>
              <span style={{ cursor: 'pointer', opacity: 0.6 }}>Facebook</span>
            </div>
          </div>
        </div>
        <div className="container" style={{ marginTop: '60px', paddingTop: '30px', borderTop: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ color: 'var(--bw-gray-medium)', fontSize: '0.8rem' }}>© 2026 KNOT STORY. ALL RIGHTS RESERVED.</p>
          <p style={{ color: 'var(--bw-gray-medium)', fontSize: '1.2rem', marginTop: '15px', opacity: 0.8, letterSpacing: '4px', fontWeight: 'bold' }}>BY MATRIX</p>
        </div>
      </footer>

      <style jsx>{`
        .form-container {
          padding: 50px;
          background-color: var(--bw-white);
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
          border-radius: 4px;
          border: 1px solid #eee;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 768px) {
          .form-container {
            padding: 25px;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
