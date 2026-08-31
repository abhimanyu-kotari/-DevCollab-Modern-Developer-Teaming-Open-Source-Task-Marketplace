import React from 'react';
import { Code2, Github, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#090d16', borderTop: '1px solid #1e293b', padding: '3.5rem 0 2rem 0' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{
                background: '#38bdf8',
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#090d16'
              }}>
                <Code2 size={16} strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc' }}>
                Dev<span style={{ color: '#38bdf8' }}>Collab</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Built for CS3301 Full Stack Development (RV University).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
            <a href="https://github.com/abhimanyu-kotari/-DevCollab-Modern-Developer-Teaming-Open-Source-Task-Marketplace.git" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8' }}>
              <Github size={16} /> GitHub Repo
            </a>
            <a href="#projects" style={{ color: '#94a3b8' }}>Live Explore</a>
            <a href="#tech-stack" style={{ color: '#94a3b8' }}>MERN Stack Docs</a>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          fontSize: '0.75rem',
          color: '#475569'
        }}>
          <div>© 2026 DevCollab Team • All rights reserved.</div>
          <div>React 18 • Express.js • MongoDB Atlas • Node.js</div>
        </div>
      </div>
    </footer>
  );
}
