'use client';

import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import Image from "next/image";

export default function ContactPage() {
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
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>CALL US</h4>
                      <p style={{ color: 'var(--bw-gray-medium)' }}>+94 77 123 4567</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.5rem' }}>✉️</div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>EMAIL</h4>
                      <p style={{ color: 'var(--bw-gray-medium)' }}>hello@knotstory.com</p>
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
                  
                  <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-grid">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>NAME</label>
                        <input type="text" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="Your Name" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>EMAIL</label>
                        <input type="email" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="your@email.com" />
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>SUBJECT</label>
                      <input type="text" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="How can we help?" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>MESSAGE</label>
                      <textarea rows={5} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', resize: 'none' }} placeholder="Tell us about your dream invitation..."></textarea>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                      SEND MESSAGE
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
      <footer style={{ backgroundColor: 'var(--bw-black)', color: 'var(--bw-white)', padding: '60px 0', marginTop: '100px' }}>
        <div className="container text-center">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', width: '60px', height: '60px', filter: 'brightness(0) invert(1)' }}>
                    <Image src="/LOGO.png" alt="KNOT STORY Logo" fill style={{ objectFit: 'contain' }} />
                </div>
                <h2 className="font-romantic" style={{ fontSize: '2.5rem', margin: 0 }}>KNOT STORY</h2>
            </div>
            <p style={{ opacity: 0.6, letterSpacing: '1px' }}>© 2026 KNOT STORY WEDDING INVITATIONS. ALL RIGHTS RESERVED.</p>
            <p style={{ opacity: 0.3, fontSize: '0.7rem', marginTop: '10px', letterSpacing: '2px' }}>BY MATRIX</p>
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
