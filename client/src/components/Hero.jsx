import React from 'react';
import { ArrowRight, Sparkles, Users, FolderGit2, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

export default function Hero({ onExploreClick, onPostClick }) {
  return (
    <section style={{ padding: '4.5rem 0 3.5rem 0', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '960px' }}>
        
        {/* Course Badge */}
        <div style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
          <div className="badge badge-cyan" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
            <Sparkles size={14} />
            <span>CS3301 Full Stack Development • Phase-1 Project</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 4rem)',
          fontWeight: '800',
          lineHeight: '1.15',
          letterSpacing: '-0.03em',
          color: '#ffffff',
          marginBottom: '1.5rem'
        }}>
          Find Your Dream Teammates.<br />
          <span style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 50%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Build & Ship Projects Together.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.15rem',
          color: '#94a3b8',
          lineHeight: '1.7',
          maxWidth: '720px',
          margin: '0 auto 2.5rem auto'
        }}>
          DevCollab connects student developers, open-source creators, and designers. 
          Post project ideas with vacant roles, pitch your skills, and manage sprint milestones in a unified MERN workspace.
        </p>

        {/* CTA Button Group */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '3.5rem'
        }}>
          <button onClick={onExploreClick} className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 1.8rem' }}>
            Explore Open Projects
            <ArrowRight size={18} />
          </button>
          <button onClick={onPostClick} className="btn-secondary" style={{ fontSize: '1rem', padding: '0.85rem 1.8rem' }}>
            <Flame size={18} color="#f59e0b" />
            Post a Project Idea
          </button>
        </div>

        {/* Live Metrics Card Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginTop: '1rem'
        }}>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: '#38bdf8' }}>
              <Users size={28} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc' }}>500+</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Active Student Developers</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: '#10b981' }}>
              <FolderGit2 size={28} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc' }}>140+</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Projects Formed</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: '#f59e0b' }}>
              <CheckCircle2 size={28} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc' }}>45+</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Hackathon Finalists</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: '#c084fc' }}>
              <ShieldCheck size={28} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc' }}>100% MERN</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Modules 1–5 Compliant</div>
          </div>
        </div>

      </div>
    </section>
  );
}
