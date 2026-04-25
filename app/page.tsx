'use client';

import Navbar from "@/components/Navbar";
import LandingHero from "@/components/LandingHero";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import Reveal from "@/components/Reveal";
import CartSidebar from "@/components/CartSidebar";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <main style={{ backgroundColor: 'var(--bw-white)' }}>
            <CartSidebar />
            <Navbar />

            <LandingHero />

            <AboutSection />

            <ProductsSection />

            {/* Trust Quote / Customer Satisfaction */}
            <section style={{ backgroundColor: 'var(--bw-black)', color: 'var(--bw-white)', padding: '100px 0' }}>
                <div className="container text-center">
                    <Reveal>
                        <div style={{ fontSize: '3rem', marginBottom: '30px' }}>❝</div>
                        <h2 className="font-romantic" style={{ fontSize: '3.5rem', marginBottom: '30px' }}>Making every moment eternal.</h2>
                        <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.2rem', lineHeight: '1.8', opacity: 0.8, fontWeight: 300 }}>
                            "We were blown away by the elegance of our digital invitation. KNOT STORY captured our style perfectly and our guests loved the interactive features. It truly set the tone for our wedding."
                        </p>
                        <div style={{ marginTop: '30px', fontWeight: 600, letterSpacing: '2px' }}>— ELEANOR & JAMES</div>
                    </Reveal>
                </div>
            </section>
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

            {/* Pre-footer Call to Action */}
            <section style={{ padding: '120px 0', backgroundColor: 'var(--bw-white)' }}>
                <div className="container text-center">
                    <Reveal>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', textTransform: 'uppercase' }}>Ready to start your journey?</h2>
                        <p style={{ marginBottom: '40px', color: 'var(--bw-gray-medium)', fontSize: '1.1rem' }}>Get in touch with us today for a custom consultation.</p>
                        <Link href="/contact" className="btn-primary" style={{ textDecoration: 'none' }}>
                            CONTACT OUR TEAM
                        </Link>
                    </Reveal>
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
                    <p style={{ color: 'var(--bw-gray-medium)', fontSize: '0.7rem', marginTop: '10px', opacity: 0.5, letterSpacing: '2px' }}>BY MATRIX</p>
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
