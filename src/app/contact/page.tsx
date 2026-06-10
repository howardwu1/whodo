'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navigation />
      <div style={{ maxWidth: '600px', margin: '60px auto 0', padding: '20px' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #191970 0%, #FF69B4 100%)',
            padding: '30px',
            textAlign: 'center',
          }}>
            <h1 style={{
              color: 'white',
              margin: 0,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: '28px',
            }}>
              Get in Touch
            </h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '10px 0 0 0',
              fontSize: '14px',
            }}>
              Have a question or feedback? We'd love to hear from you.
            </p>
          </div>

          {/* Form */}
          <div style={{ padding: '30px' }}>
            {submitted ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #191970, #FF69B4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <SendIcon style={{ color: 'white', fontSize: '30px' }} />
                </div>
                <h3 style={{ color: '#191970', marginBottom: '8px' }}>Message Sent!</h3>
                <p style={{ color: '#666', margin: 0 }}>
                  Thank you for reaching out. We'll get back to you soon.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                  style={{
                    marginTop: '20px',
                    padding: '10px 24px',
                    background: 'transparent',
                    border: '2px solid #191970',
                    borderRadius: '8px',
                    color: '#191970',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    color: '#333',
                    fontWeight: 500,
                    fontSize: '14px',
                  }}>
                    <PersonIcon style={{ fontSize: '18px', color: '#191970' }} />
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Smith"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #eee',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#191970')}
                    onBlur={(e) => (e.target.style.borderColor = '#eee')}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    color: '#333',
                    fontWeight: 500,
                    fontSize: '14px',
                  }}>
                    <MailIcon style={{ fontSize: '18px', color: '#191970' }} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #eee',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#191970')}
                    onBlur={(e) => (e.target.style.borderColor = '#eee')}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    color: '#333',
                    fontWeight: 500,
                    fontSize: '14px',
                  }}>
                    <MessageIcon style={{ fontSize: '18px', color: '#191970' }} />
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what's on your mind..."
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #eee',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#191970')}
                    onBlur={(e) => (e.target.style.borderColor = '#eee')}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #191970 0%, #FF69B4 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  <SendIcon style={{ fontSize: '18px' }} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&display=swap');
      `}</style>
    </div>
  );
}
