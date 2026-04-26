'use client';

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Camera, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset'; 
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dxoa3ashm';

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    contact_number: '',
    description: '',
    image_url: '',
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      
      if (result.secure_url) {
        setFormData({ ...formData, image_url: result.secure_url });
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact_number || !formData.description) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('feedbacks')
        .insert([formData]);

      if (error) throw error;
      setStatus('success');
      setFormData({ name: '', contact_number: '', description: '', image_url: '' });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <CheckCircle2 size={64} color="#28a745" style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Thank You!</h1>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Your feedback has been submitted successfully. It will be published after review by our team.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            style={{
              marginTop: '25px',
              padding: '12px 30px',
              backgroundColor: '#000',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ marginBottom: '40px' }}>
        <Image
          src="https://res.cloudinary.com/dnfbik3if/image/upload/v1776967066/logo_bfzkos.png"
          alt="Logo"
          width={200}
          height={80}
          style={{ objectFit: 'contain' }}
        />
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '5px', textAlign: 'center' }}>Share Your Experience</h1>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '30px' }}>We value your feedback and would love to hear from you!</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Name"
                style={{ width: '100%', padding: '12px', border: '1px solid #eee', borderRadius: '10px', backgroundColor: '#f9f9f9' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Contact Number</label>
              <input
                type="tel"
                required
                value={formData.contact_number}
                onChange={e => setFormData({ ...formData, contact_number: e.target.value })}
                placeholder="Phone Number"
                style={{ width: '100%', padding: '12px', border: '1px solid #eee', borderRadius: '10px', backgroundColor: '#f9f9f9' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Your Feedback</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about your experience..."
              style={{ width: '100%', padding: '12px', border: '1px solid #eee', borderRadius: '10px', backgroundColor: '#f9f9f9', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Upload Photo (Optional)</label>
            <div style={{
              border: '2px dashed #eee',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              position: 'relative',
              backgroundColor: '#f9f9f9',
              cursor: 'pointer'
            }}>
              {formData.image_url ? (
                <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <Image src={formData.image_url} alt="Preview" fill style={{ objectFit: 'contain' }} />
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                    style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: 'rgba(255,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <Camera size={32} color="#999" />
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>{uploading ? 'Uploading...' : 'Click to upload a photo'}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
                </label>
              )}
            </div>
          </div>

          {status === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#dc3545', backgroundColor: '#fff5f5', padding: '12px', borderRadius: '10px', fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || uploading}
            style={{
              marginTop: '10px',
              padding: '15px',
              backgroundColor: '#000',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: (submitting || uploading) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: (submitting || uploading) ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {submitting ? 'Submitting...' : <><Send size={18} /> Submit Feedback</>}
          </button>
        </form>
      </div>

      <footer style={{ marginTop: '40px', color: '#666', fontSize: '0.85rem' }}>
        &copy; {new Date().getFullYear()} Knot Story. All rights reserved.
      </footer>
    </div>
  );
}
