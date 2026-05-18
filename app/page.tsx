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

// WhatsApp SVG Icon
const WhatsAppIcon = ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M12.004 2.002c-5.522 0-10 4.478-10 10 0 1.996.586 3.856 1.626 5.438L2 22l4.686-1.55c1.536.942 3.338 1.488 5.318 1.488 5.522 0 10-4.478 10-10 0-5.522-4.478-10-10-10zm.012 18.156c-1.642 0-3.19-.422-4.55-1.164l-.326-.178-2.778.918.936-2.708-.196-.312c-.824-1.31-1.266-2.834-1.266-4.436 0-4.6 3.742-8.342 8.342-8.342s8.342 3.742 8.342 8.342-3.742 8.342-8.342 8.342zm4.584-6.248c-.252-.126-1.488-.734-1.718-.818-.23-.084-.398-.126-.566.126-.168.252-.648.818-.796.986-.148.168-.296.19-.548.064-.252-.126-1.062-.392-2.022-1.246-.746-.664-1.25-1.486-1.398-1.738-.148-.252-.016-.388.11-.514.114-.114.252-.294.378-.442.126-.148.168-.252.252-.42.084-.168.042-.316-.02-.442-.064-.126-.566-1.364-.776-1.868-.204-.492-.41-.426-.566-.434l-.484-.008c-.168 0-.442.064-.672.316s-.88 .86-.88 2.096c0 1.236.902 2.43 1.028 2.598.126.168 1.772 2.704 4.292 3.792.6.258 1.068.412 1.434.528.602.19 1.15.164 1.586.1.488-.072 1.488-.608 1.698-1.196.21-.588.21-1.092.148-1.196-.062-.104-.23-.168-.482-.294z" />
    </svg>
);

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
                                width: '0%',
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

                {/* Floating WhatsApp Button */}
                <a
                    href="https://wa.me/94769996430"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="floating-whatsapp"
                    aria-label="Chat on WhatsApp"
                >
                    <WhatsAppIcon size={32} color="#fff" />
                </a>

                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.95) translateY(20px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                    }

                    @keyframes smoothProgress {
                        0% { width: 0%; opacity: 0; }
                        15% { width: 15%; opacity: 1; }
                        100% { width: 80%; opacity: 1; }
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
                        animation: smoothProgress 2.5s ease-out forwards, gradientFlow 3s linear infinite;
                        overflow: hidden;
                        position: relative;
                    }

                    :global(.loading-bar-shimmer) {
                        animation: shimmerFlow 1.5s ease-in-out infinite;
                    }

                    .floating-whatsapp {
                        position: fixed;
                        bottom: 30px;
                        right: 30px;
                        width: 60px;
                        height: 60px;
                        background-color: #25d366;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4);
                        z-index: 9999;
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }
                    .floating-whatsapp:hover {
                        transform: scale(1.1);
                        box-shadow: 0 15px 35px rgba(37, 211, 102, 0.6);
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
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <li style={{ color: 'var(--bw-gray-dark)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <WhatsAppIcon size={18} color="#25D366" />
                                <a href="https://wa.me/94769996430" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>076 999 6430</a>
                            </li>
                            <li style={{ color: 'var(--bw-gray-dark)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '1.1rem' }}>✉️</span>
                                <a href="mailto:invite.knotstory@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>Email Us</a>
                            </li>
                            <li style={{ color: 'var(--bw-gray-dark)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '1.1rem' }}>📍</span>
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

            {/* Floating WhatsApp Button */}
            <a
                href="https://wa.me/94769996430"
                target="_blank"
                rel="noopener noreferrer"
                className="floating-whatsapp"
                aria-label="Chat on WhatsApp"
            >
                <WhatsAppIcon size={32} color="#fff" />
            </a>

            <style jsx>{`
        footer a:hover {
            color: var(--bw-black) !important;
            text-decoration: underline !important;
        }
        .floating-whatsapp {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background-color: #25d366;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4);
            z-index: 9999;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .floating-whatsapp:hover {
            transform: scale(1.1);
            box-shadow: 0 15px 35px rgba(37, 211, 102, 0.6);
        }
      `}</style>
        </main>
    );
}
