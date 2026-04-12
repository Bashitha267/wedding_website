'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
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
      // Securely call the Supabase RPC function to check the password in the database
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

      if (data && data.success && data.user.role === 'admin') {
        // Here you would typically store the session in cookies/localStorage
        // But for this mock, we just route them.
        router.push('/admin');
      } else {
        setError(data?.message || 'Invalid admin credentials.');
      }
    } catch (err: any) {
      console.error("Login Exception:", err);
      // More descriptive error state
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
      backgroundColor: 'var(--bw-gray-light)'
    }}>
      <div style={{
        backgroundColor: 'var(--bw-white)',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Admin Login</h1>
        <p style={{ color: 'var(--bw-gray-medium)', marginBottom: '30px' }}>Enter your credentials to access the dashboard</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--bw-gray-medium)' }} size={20} />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                fontFamily: 'var(--font-body)'
              }}
              required
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--bw-gray-medium)' }} size={20} />
            <input 
              type="password" 
              placeholder="Password (hashed in DB)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                fontFamily: 'var(--font-body)'
              }}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && <p style={{ color: 'red', marginTop: '15px', fontSize: '0.9rem' }}>{error}</p>}

        <div style={{ marginTop: '20px' }}>
          <Link href="/" style={{ color: 'var(--bw-gray-medium)', textDecoration: 'none', fontSize: '0.9rem' }}>
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
