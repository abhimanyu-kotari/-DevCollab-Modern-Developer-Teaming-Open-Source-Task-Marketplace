import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ApplyModal({ project, onClose }) {
  const [selectedRole, setSelectedRole] = useState(project?.openRoles?.[0]?.name || "");
  const [pitch, setPitch] = useState("");
  const [github, setGithub] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!project) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pitch.trim()) return;
    setSubmitted(true);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }} onClick={onClose}>
      
      <div 
        className="glass-panel animate-fade-in" 
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '2rem',
          background: '#0f172a',
          border: '1px solid #38bdf8',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Role Application</span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#f8fafc' }}>
              {project.title}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Posted by {project.owner} ({project.department})
            </p>
          </div>

          <button 
            onClick={onClose}
            style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '0.4rem', padding: '0.4rem' }}
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', color: '#10b981', marginBottom: '1rem' }}>
              <CheckCircle2 size={48} />
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>
              Application Sent Successfully!
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
              Your pitch for <strong style={{ color: '#38bdf8' }}>{selectedRole}</strong> has been transmitted to {project.owner}. You'll receive a notification upon approval.
            </p>
            <button onClick={onClose} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Role select */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                Select Vacant Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '0.5rem',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                {project.openRoles.map((r, i) => (
                  <option key={i} value={r.name}>{r.name} ({r.count} opening)</option>
                ))}
              </select>
            </div>

            {/* Pitch Text */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                Why are you a good fit? (Experience & Skills)
              </label>
              <textarea
                rows={4}
                required
                placeholder="Share your experience with the required tech stack, past hackathons, or why you want to build this..."
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '0.5rem',
                  color: '#f8fafc',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* GitHub URL */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                GitHub Profile / Portfolio Link
              </label>
              <input
                type="url"
                placeholder="https://github.com/your-username"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '0.5rem',
                  color: '#f8fafc',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <Send size={16} />
                Submit Pitch
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
