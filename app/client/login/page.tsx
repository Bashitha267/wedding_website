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
      backgroundColor: 'var(--bg-cream)'
    }}>
      <div style={{
        backgroundColor: 'var(--card-bg)',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(217, 133, 148, 0.15)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        border: '1px solid var(--rose-light)'
      }}>
        <h1 className="font-romantic" style={{ fontSize: '3rem', marginBottom: '10px', color: 'var(--rose-dark)' }}>Client Login</h1>
        <p style={{ color: 'var(--text-main)', marginBottom: '30px', opacity: 0.8 }}>Access your wedding template dashboard</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--rose-medium)' }} size={20} />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '1px solid var(--rose-medium)',
                borderRadius: '4px',
                fontSize: '1rem',
                fontFamily: 'var(--font-body)',
                outline: 'none'
              }}
              required
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--rose-medium)' }} size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '1px solid var(--rose-medium)',
                borderRadius: '4px',
                fontSize: '1rem',
                fontFamily: 'var(--font-body)',
                outline: 'none'
              }}
              required
            />
          </div>

          <button type="submit" style={{ 
            marginTop: '10px',
            backgroundColor: 'var(--rose-dark)',
            color: 'white',
            padding: '12px 32px',
            border: 'none',
            borderRadius: '4px',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && <p style={{ color: 'red', marginTop: '15px', fontSize: '0.9rem' }}>{error}</p>}

        <div style={{ marginTop: '20px' }}>
          <Link href="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
