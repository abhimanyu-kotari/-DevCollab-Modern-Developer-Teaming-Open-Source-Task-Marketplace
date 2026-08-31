import React from 'react';
import { Lock, Layout, GitPullRequest, Database, Zap, Cpu } from 'lucide-react';

export default function Features() {
  const feats = [
    {
      icon: <Lock size={22} color="#38bdf8" />,
      title: "Bcrypt & JWT Auth (Module 4)",
      desc: "Salted password hashing and stateless token issuance protecting user profiles and role authorizations."
    },
    {
      icon: <Layout size={22} color="#10b981" />,
      title: "React 18 SPA UI (Module 2)",
      desc: "Fast component-driven interface built with Vite, React Router v6, and responsive CSS Flexbox/Grid."
    },
    {
      icon: <Zap size={22} color="#f59e0b" />,
      title: "Express REST API (Module 3)",
      desc: "Modular MVC endpoints with Helmet security, Morgan logging, CORS, and centralized error handling."
    },
    {
      icon: <Database size={22} color="#c084fc" />,
      title: "MongoDB & Mongoose (Module 4)",
      desc: "Relational population between Users, Projects, Applications, and compound indexing for rapid search."
    },
    {
      icon: <GitPullRequest size={22} color="#f43f5e" />,
      title: "Git Team Collaboration (Module 1)",
      desc: "Clean branch workflows (main, dev, feature/*), pull requests, and semantic version control."
    },
    {
      icon: <Cpu size={22} color="#38bdf8" />,
      title: "Cloud CI/CD Ready (Module 5)",
      desc: "Configured for zero-downtime deployment on Vercel (Frontend) and Render (Backend API Service)."
    }
  ];

  return (
    <section id="features" style={{ padding: '5rem 0', borderTop: '1px solid #1e293b' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
          <div className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>
            <span>Architecture Highlights</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem' }}>
            Engineered for Modern Web Standards
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
            Directly implementing the concepts and best practices taught across all 5 syllabus modules.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {feats.map((f, i) => (
            <div key={i} className="glass-panel" style={{ padding: '1.75rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                background: '#090d16',
                border: '1px solid #334155',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                flexShrink: 0
              }}>
                {f.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.4rem' }}>
                  {f.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
