'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (data) setFeedbacks(data);
    setLoading(false);
  };

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    if (feedbacks.length > 0) {
      timeoutRef.current = setTimeout(
        () => setCurrentIndex((prevIndex) => (prevIndex + 1) % feedbacks.length),
        5000
      );
    }
    return () => resetTimeout();
  }, [currentIndex, feedbacks.length]);

  if (loading || feedbacks.length === 0) return null;

  // On desktop we show 3, on mobile 1
  // To handle the "3 per row" requirement with auto-sliding, 
  // it's best to show a sliding window or just change the starting index.
  
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);

  return (
    <section style={{ padding: '80px 0', backgroundColor: '#fff', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '10px', color: '#111' }}>Happy Couples</h2>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#000', margin: '0 auto' }}></div>
        </div>

        <div style={{ position: 'relative', width: '100%' }}>
          <div style={{ 
            display: 'flex', 
            gap: '20px',
            transition: 'transform 0.5s ease-in-out',
            transform: `translateX(calc(-${currentIndex * 100}% / var(--visible-items)))`
          }} className="feedback-track">
            {feedbacks.map((feedback) => (
              <div 
                key={feedback.id} 
                style={{ 
                  flex: '0 0 calc((100% - (var(--visible-items) - 1) * 20px) / var(--visible-items))',
                  height: '400px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              >
                {/* Background Image */}
                <div style={{ 
                  position: 'absolute', inset: 0, 
                  backgroundImage: `url(${feedback.image_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.5s ease'
                }} />
                
                {/* Dark Overlay */}
                <div style={{ 
                  position: 'absolute', inset: 0, 
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '30px',
                  color: 'white'
                }}>
                  <Quote size={32} style={{ opacity: 0.5, marginBottom: '15px' }} />
                  <p style={{ 
                    fontSize: '1rem', 
                    lineHeight: '1.6', 
                    marginBottom: '20px',
                    fontStyle: 'italic',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    "{feedback.description}"
                  </p>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '1px' }}>
                    {feedback.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          {feedbacks.length > 1 && (
            <>
              <button 
                onClick={prevSlide}
                style={{
                  position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)',
                  width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'white',
                  border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextSlide}
                style={{
                  position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)',
                  width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'white',
                  border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
          {feedbacks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: '12px', height: '12px', borderRadius: '50%',
                backgroundColor: currentIndex === idx ? '#000' : '#ddd',
                border: 'none', cursor: 'pointer', transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        section {
          --visible-items: 3;
        }
        @media (max-width: 992px) {
          section {
            --visible-items: 2;
          }
        }
        @media (max-width: 768px) {
          section {
            --visible-items: 1;
          }
          .container {
            padding: 0 20px;
          }
        }
      `}</style>
    </section>
  );
}
