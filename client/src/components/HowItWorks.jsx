import React from 'react';
import { UserPlus, Compass, KanbanSquare, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Compass size={28} color="#38bdf8" />,
      stepNum: "01",
      title: "Post or Discover Projects",
      description: "Project creators list idea details, target tech stack, and specify vacant roles. Solo developers search by exact skill sets."
    },
    {
      icon: <UserPlus size={28} color="#f59e0b" />,
      stepNum: "02",
      title: "Pitch & Match Teammates",
      description: "Submit 1-click applications with a concise role pitch and portfolio links. Owners accept collaborators with instant role assignment."
    },
    {
      icon: <KanbanSquare size={28} color="#10b981" />,
      stepNum: "03",
      title: "Collaborate on Kanban Board",
      description: "Organize sprint tasks across Todo, In-Progress, and Done columns. Connect GitHub repos and ship semester-ready software."
    }
  ];

  return (
    <section id="how-it-works" style={{ padding: '5rem 0', background: 'rgba(15, 23, 42, 0.4)', borderTop: '1px solid #1e293b' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
          <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} />
            <span>Structured Collaboration</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem' }}>
            How DevCollab Works
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
            A streamlined 3-step lifecycle designed to prevent project abandonment and build high-scoring full-stack apps.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          position: 'relative'
        }}>
          {steps.map((s, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '2.25rem', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                fontSize: '2.5rem',
                fontWeight: '900',
                color: 'rgba(148, 163, 184, 0.1)',
                fontFamily: 'monospace'
              }}>
                {s.stepNum}
              </div>

              <div style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '0.75rem',
                background: '#090d16',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                {s.icon}
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.75rem' }}>
                {s.title}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {s.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
