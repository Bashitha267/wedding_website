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

export default function LiveHome() {
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
                                <a href="https://wa.me/94769996430" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>WhatsApp (076 999 6430)</a>
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
