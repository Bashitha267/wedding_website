'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ClientLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Securely call the Supabase RPC function
      const { data, error: rpcError } = await supabase.rpc('verify_user', {
        p_username: username,
        p_password: password
      });

      if (rpcError) {
        console.error("Supabase RPC Error:", rpcError);
        setError(`DB Error: ${rpcError.message || rpcError.details || JSON.stringify(rpcError)}`);
        setLoading(false);
        return;
      }

      if (data && data.success && data.user.role === 'client') {
        localStorage.setItem('wedding_client', JSON.stringify(data.user));
        router.push('/client');
      } else {
        setError(data?.message || 'Invalid client credentials.');
      }
    } catch (err: any) {
      console.error("Login Exception:", err);
      const errorMessage = err?.message || err?.details || JSON.stringify(err);
      setError(`Network Exception: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#000000',
        padding: '48px 40px',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center',
        border: '1px solid #111'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '160px', display: 'block', margin: '0 auto', filter: 'brightness(0) invert(1)' }} />
        </div>
        
        <h1 className="font-romantic" style={{ 
          fontSize: '2.8rem', 
          marginBottom: '8px', 
          color: '#ffffff',
          fontWeight: '400'
        }}>Client Login</h1>
        
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.5)', 
          marginBottom: '40px', 
          fontSize: '0.9rem',
          letterSpacing: '0.5px'
        }}>Access your wedding template dashboard</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', top: '14px', left: '16px', color: 'rgba(255, 255, 255, 0.4)' }} size={18} />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '0.95rem',
                color: '#ffffff',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              required
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', top: '14px', left: '16px', color: 'rgba(255, 255, 255, 0.4)' }} size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '0.95rem',
                color: '#ffffff',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              required
            />
          </div>

          <button type="submit" style={{ 
            marginTop: '12px',
            backgroundColor: '#ffffff',
            color: '#000000',
            padding: '14px',
            border: 'none',
            borderRadius: '12px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.3s ease'
          }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {error && (
          <div style={{ 
            marginTop: '20px', 
            padding: '12px', 
            backgroundColor: 'rgba(255, 82, 82, 0.1)', 
            border: '1px solid rgba(255, 82, 82, 0.2)', 
            borderRadius: '8px',
            color: '#ff5252',
            fontSize: '0.85rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: '32px' }}>
          <Link href="/" style={{ 
            color: 'rgba(255, 255, 255, 0.4)', 
            textDecoration: 'none', 
            fontSize: '0.85rem',
            transition: 'color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
          onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
          >
            &larr; Back to Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
