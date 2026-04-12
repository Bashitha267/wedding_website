'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, X, CreditCard, User, Link as LinkIcon, Phone, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<any>(null);
  
  // Checkout form state
  const [form, setForm] = useState({
    name: '',
    url: '', // slug
    contact: '',
    username: '',
    password: '',
    card: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleOpenCart = (e: any) => {
      if (e.detail) {
        setItem(e.detail);
      }
      setIsOpen(true);
    };
    
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network delay for Mock Payment feel
    await new Promise(r => setTimeout(r, 1000));
    
    try {
      if (!item || (!item.id && item.name !== 'The Eternal Blush')) {
        throw new Error("No valid template selected in cart.");
      }
      
      const parsedTemplateId = item.id === '1' ? 'classic' : item.id;
      
      const { data, error } = await supabase.rpc('checkout_order', {
        p_name: form.name,
        p_slug: form.url,
        p_contact: form.contact,
        p_username: form.username,
        p_password: form.password,
        p_template_id: parsedTemplateId || 'classic'
      });

      if (error) {
        throw error;
      }

      if (data && data.success === false) {
        throw new Error(data.message || "Username or URL might already be taken!");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      const msg = err.message || err.details || JSON.stringify(err);
      alert(`Checkout failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000,
          backdropFilter: 'blur(2px)'
        }}
        onClick={() => setIsOpen(false)}
      />
      
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: '450px',
        backgroundColor: 'var(--bw-white)',
        zIndex: 2001,
        boxShadow: '-5px 0 30px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.3s ease-out forwards'
      }}>
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><ShoppingCart size={24} /> Fast Checkout</h2>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
              <h2>Payment Successful!</h2>
              <p style={{ color: 'var(--bw-gray-medium)', margin: '20px 0' }}>
                Your template is ready. You can now login to customize it.
              </p>
              <p>Your URL: <b>http://localhost:3001/{form.url || 'your-url'}</b></p>
              <br />
              <button 
                className="btn-primary" 
                onClick={() => { window.location.href = '/client/login'; }}
                style={{ width: '100%' }}
              >
                Go to Client Dashboard
              </button>
            </div>
          ) : (
            <>
              {item ? (
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <img src={item.image} alt="Template" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{item.name}</h3>
                    <p style={{ margin: 0, color: 'var(--bw-gray-medium)', fontSize: '0.9rem' }}>{item.theme}</p>
                    <p style={{ margin: '5px 0 0 0', fontWeight: 600 }}>$149.00 USD</p>
                  </div>
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'gray' }}>Your cart is empty.</p>
              )}

              {item && (
                <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  
                  <h4>Order Details</h4>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#888' }} />
                    <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                    <LinkIcon size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#888' }} />
                    <input type="text" placeholder="Desired URL (e.g., akashandchamudi)" required value={form.url} onChange={e => setForm({...form, url: e.target.value})} style={inputStyle} />
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#888' }} />
                    <input type="tel" placeholder="Contact Number" required value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} style={inputStyle} />
                  </div>

                  <h4 style={{ marginTop: '10px' }}>Dashboard Account Registration</h4>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#888' }} />
                    <input type="text" placeholder="Create a Username" required value={form.username} onChange={e => setForm({...form, username: e.target.value})} style={inputStyle} />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#888' }} />
                    <input type="password" placeholder="Create a Password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} />
                  </div>

                  <h4 style={{ marginTop: '10px' }}>Payment (Mock Only)</h4>
                  <div style={{ position: 'relative' }}>
                    <CreditCard size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#888' }} />
                    <input type="text" placeholder="Card Number (4242 4242...)" required value={form.card} onChange={e => setForm({...form, card: e.target.value})} style={inputStyle} />
                  </div>

                  <button type="submit" className="btn-primary" style={{ marginTop: '20px', fontSize: '1.1rem', padding: '15px' }} disabled={loading}>
                    {loading ? 'Processing Payment...' : 'Pay & Create Account'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 12px 12px 40px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontFamily: 'inherit',
  fontSize: '0.95rem'
};
