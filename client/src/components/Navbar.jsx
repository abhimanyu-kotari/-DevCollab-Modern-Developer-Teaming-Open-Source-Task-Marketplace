import React, { useState } from 'react';
import { Code2, PlusCircle, User, Menu, X, Terminal, ExternalLink } from 'lucide-react';

export default function Navbar({ onPostProjectClick, onExploreClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #1e293b'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.5rem'
      }}>
        {/* Brand Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#090d16',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
          }}>
            <Code2 size={24} strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#f8fafc' }}>
              Dev<span style={{ color: '#38bdf8' }}>Collab</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              RV University • CS3301
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '2rem' }} className="desktop-links">
          <a href="#projects" onClick={onExploreClick} style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' }}>
            Explore Projects
          </a>
          <a href="#how-it-works" style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' }}>
            How It Works
          </a>
          <a href="#features" style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' }}>
            Features
          </a>
          <a href="#tech-stack" style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' }}>
            Tech Stack (MERN)
          </a>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-actions">
          <button onClick={onPostProjectClick} className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}>
            <PlusCircle size={16} />
            Post Project
          </button>
          <button className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.55rem 1rem' }}>
            <User size={16} />
            Sign In
          </button>
        </div>

        {/* Mobile menu toggle button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', color: '#f8fafc', padding: '0.5rem', display: 'block' }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: '#0f172a',
          borderBottom: '1px solid #1e293b',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <a href="#projects" onClick={() => { onExploreClick(); setMobileMenuOpen(false); }} style={{ color: '#cbd5e1', padding: '0.5rem 0' }}>Explore Projects</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1', padding: '0.5rem 0' }}>How It Works</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1', padding: '0.5rem 0' }}>Features</a>
          <a href="#tech-stack" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1', padding: '0.5rem 0' }}>Tech Stack</a>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={() => { onPostProjectClick(); setMobileMenuOpen(false); }} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              <PlusCircle size={16} /> Post Project
            </button>
            <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
              Sign In
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-links { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
