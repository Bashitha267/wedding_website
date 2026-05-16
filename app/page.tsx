'use client';

import Navbar from "@/components/Navbar";
import LandingHero from "@/components/LandingHero";
import ProductsSection from "@/components/ProductsSection";
import FeedbackSection from "@/components/FeedbackSection";
import OtherEventsSection from "@/components/OtherEventsSection";
import ReservationBanner from "@/components/ReservationBanner";
import Reveal from "@/components/Reveal";
import CartSidebar from "@/components/CartSidebar";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
    // START: Coming soon mode (prevents rendering the main page but keeps the code intact)
    const isComingSoon = true;

    if (isComingSoon) {
        return (
            <main style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#eaeaea',
                // Simulating a soft, wavy/silky background with CSS gradients
                backgroundImage: `
                    radial-gradient(circle at 15% 50%, rgba(255,255,255,0.6) 0%, transparent 50%),
                    radial-gradient(circle at 85% 30%, rgba(255,255,255,0.7) 0%, transparent 50%),
                    linear-gradient(135deg, #e8e8e8 0%, #fdfdfd 40%, #e0e0e0 100%)
                `,
                padding: '20px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '650px',
                    aspectRatio: '1 / 1',
                    maxHeight: '90vh',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '40px',
                    border: '1.5px solid rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.08), inset 0 0 20px rgba(255,255,255,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8% 4%',
                    position: 'relative',
                    animation: 'fadeIn 1.5s ease-out'
                }}>

                    {/* Logo Section */}
                    <div style={{ position: 'relative', width: '200px', height: '60px' }}>
                        <Image
                            src="https://res.cloudinary.com/dnfbik3if/image/upload/v1776967066/logo_bfzkos.png"
                            alt="KNOT STORY Logo"
                            fill
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </div>

                    {/* Main Text Section */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        <div style={{
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontWeight: 300,
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            lineHeight: '0.9',
                            color: '#333',
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            letterSpacing: '-1px'
                        }}>
                            WE ARE
                        </div>
                        <div style={{
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontWeight: 300,
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            lineHeight: '0.9',
                            color: '#333',
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            letterSpacing: '-1px',
                            marginBottom: '5px'
                        }}>
                            LAUNCHING
                        </div>
                        <div style={{
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontWeight: 700,
                            fontSize: 'clamp(6rem, 15vw, 11rem)',
                            lineHeight: '0.85',
                            textTransform: 'uppercase',
                            letterSpacing: '-2px',
                            background: 'linear-gradient(to bottom, #888888 0%, #111111 80%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}>
                            SOON
                        </div>
                    </div>

                    {/* Footer Text & Loading Bar */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px',
                        width: '100%'
                    }}>
                        <div style={{
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontWeight: 400,
                            fontSize: 'clamp(0.7rem, 2vw, 1rem)',
                            letterSpacing: 'clamp(8px, 2vw, 20px)',
                            color: '#111',
                            textTransform: 'uppercase',
                            marginLeft: 'clamp(8px, 2vw, 20px)' // Offset for true centering with large letter spacing
                        }}>
                            STAY TUNED
                        </div>

                        {/* Loading Bar Animation (Filled to 80% with continuous overflowing/shimmer animation, no percentage text) */}
                        <div style={{ 
                            width: '220px', 
                            height: '6px', 
                            backgroundColor: 'rgba(0, 0, 0, 0.08)', 
                            borderRadius: '10px', 
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                            <div className="loading-bar-fill" style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: '80%',
                                borderRadius: '10px',
                                background: 'linear-gradient(90deg, #111 0%, #555 50%, #111 100%)',
                                backgroundSize: '200% 100%',
                                boxShadow: '0 0 8px rgba(0,0,0,0.2)'
                            }}>
                                <div className="loading-bar-shimmer" style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '100%',
                                    width: '100%',
                                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                                }} />
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.95) translateY(20px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                    }

                    @keyframes gradientFlow {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }

                    @keyframes shimmerFlow {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }

                    :global(.loading-bar-fill) {
                        animation: gradientFlow 3s linear infinite;
                        overflow: hidden;
                        position: relative;
                    }

                    :global(.loading-bar-shimmer) {
                        animation: shimmerFlow 1.5s ease-in-out infinite;
                    }
                `}</style>
            </main>
        );
    }
    // END: Coming soon mode

    return (
        <main style={{ backgroundColor: 'var(--bw-white)' }}>
            <CartSidebar />
            <Navbar />

            <LandingHero />

            {/* New Reservation Management Section */}
            <ReservationBanner />

            <ProductsSection />

            {/* Dynamic Feedback Section */}
            <FeedbackSection />

            {/* Other Events Section */}
            <OtherEventsSection />

            {/* Customized Design Section */}
            <section style={{ padding: '120px 0', backgroundColor: '#fdf8f4' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <Reveal>
                            <h4 style={{ letterSpacing: '4px', color: 'var(--bw-gray-medium)', marginBottom: '15px', textTransform: 'uppercase', fontSize: '0.9rem' }}>BESPOKE CREATIONS</h4>
                            <h2 className="font-romantic" style={{ fontSize: '4rem', color: 'var(--bw-black)', marginBottom: '25px', lineHeight: '1.1' }}>Want something truly unique?</h2>
                            <p style={{ fontSize: '1.2rem', color: 'var(--bw-gray-dark)', lineHeight: '1.8', marginBottom: '35px' }}>
                                Our master designers are ready to bring your vision to life. If you can't find the perfect template in our collection, we can create a one-of-a-kind digital experience specifically for your wedding theme.
                            </p>
                            <Link href="/contact" className="btn-primary" style={{ textDecoration: 'none', padding: '15px 40px' }}>
                                REQUEST CUSTOM TEMPLATE
                            </Link>
                        </Reveal>
                    </div>
                    <div style={{ flex: 1, minWidth: '300px', position: 'relative', height: '500px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                        <Image
                            src="/bespoke_roses_color.png"
                            alt="Custom Bespoke Wedding Design"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </section>


            <footer style={{ backgroundColor: 'var(--bw-gray-light)', padding: '60px 0', borderTop: '1px solid #eee' }}>
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
                        <h4 style={{ fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase' }}>Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <li><Link href="/" style={{ color: 'var(--bw-gray-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>Home</Link></li>
                            <li><Link href="#products" style={{ color: 'var(--bw-gray-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>Templates</Link></li>
                            <li><Link href="/contact" style={{ color: 'var(--bw-gray-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>Contact</Link></li>
                            <li><Link href="/client/login" style={{ color: 'var(--bw-gray-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>Client Login</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase' }}>Contact Us</h4>
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
                        <h4 style={{ fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase' }}>Follow Us</h4>
                        <div style={{ display: 'flex', gap: '15px' }}>
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
        footer a:hover {
            color: var(--bw-black) !important;
            text-decoration: underline !important;
        }
      `}</style>
        </main>
    );
}
