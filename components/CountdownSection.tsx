'use client';

import { useEffect, useState } from 'react';
import Reveal from './Reveal';

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('August 24, 2026 15:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeItems = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds }
  ];

  return (
    <section className="countdown-section" style={{
      padding: '40px 10px',
      textAlign: 'center',
      width: '100%'
    }}>
      <Reveal delay={200}>
        <div className="subheading" style={{ marginBottom: '20px' }}>COUNTDOWN</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          {timeItems.map((item) => (
            <div key={item.label} style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                width: '70px'
            }}>
              <div style={{ 
                fontSize: '1.8rem', 
                fontWeight: 300,
                color: 'var(--rose-dark)',
                borderBottom: '1px solid var(--rose-light)',
                paddingBottom: '5px',
                width: '100%'
              }}>
                {item.value.toString().padStart(2, '0')}
              </div>
              <span style={{ 
                fontSize: '0.7rem', 
                letterSpacing: '1px',
                marginTop: '10px',
                color: 'var(--rose-medium)'
              }}>
                {item.label.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
};

export default CountdownSection;
