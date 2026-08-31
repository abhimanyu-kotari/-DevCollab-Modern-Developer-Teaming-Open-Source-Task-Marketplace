import React, { useState } from 'react';
import { Search, Filter, Layers, UserCheck, Calendar, ArrowUpRight, Check, Tag } from 'lucide-react';

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: "AI Resume Scanner & Job Matcher",
    category: "AI / Full Stack",
    description: "An automated web app that extracts resume skills and calculates real-time job fit scores using NLP embeddings and React charts.",
    techStack: ["React", "Node.js", "MongoDB", "Express", "Tailwind"],
    openRoles: [
      { name: "Frontend Lead (React)", count: 1 },
      { name: "Backend Eng (Express)", count: 1 }
    ],
    owner: "Alex Rivera",
    ownerAvatar: "AR",
    department: "Computer Science",
    daysAgo: "2 days ago",
    status: "Open"
  },
  {
    id: 2,
    title: "Decentralized Campus Voting System",
    category: "Web3 / MERN",
    description: "Tamper-proof student council elections platform leveraging Ethereum smart contracts with a responsive MERN administration portal.",
    techStack: ["React", "Express", "Solidity", "MongoDB", "Ethers.js"],
    openRoles: [
      { name: "UI/UX Designer", count: 1 },
      { name: "Smart Contract Dev", count: 1 }
    ],
    owner: "Priya Sharma",
    ownerAvatar: "PS",
    department: "Information Science",
    daysAgo: "Just now",
    status: "Open"
  },
  {
    id: 3,
    title: "Campus Food & Tiffin Delivery Hub",
    category: "Full Stack Web",
    description: "Real-time ordering and delivery tracker connecting campus cafeteria vendors directly with hostel students.",
    techStack: ["React", "Node.js", "MongoDB", "Socket.io", "Stripe"],
    openRoles: [
      { name: "Full Stack Dev", count: 2 },
      { name: "QA Tester", count: 1 }
    ],
    owner: "Rahul Verma",
    ownerAvatar: "RV",
    department: "CS & Engineering",
    daysAgo: "3 days ago",
    status: "Open"
  },
  {
    id: 4,
    title: "CodePulse: Real-Time Collaborative IDE",
    category: "Developer Tools",
    description: "Browser-based multiplayer code editor with syntax highlighting, compiler API integration, and audio chat for pair programming.",
    techStack: ["React", "WebSockets", "Express", "Monaco Editor", "Docker"],
    openRoles: [
      { name: "React Frontend Dev", count: 1 },
      { name: "DevOps Engineer", count: 1 }
    ],
    owner: "Sarah Jenkins",
    ownerAvatar: "SJ",
    department: "Software Eng",
    daysAgo: "4 days ago",
    status: "Open"
  },
  {
    id: 5,
    title: "EcoTrack: University Carbon Footprint Calculator",
    category: "Data & Web",
    description: "Campus sustainability dashboard monitoring departmental energy use, waste generation, and commuter emissions.",
    techStack: ["React", "Chart.js", "Express", "MongoDB", "CSS Grid"],
    openRoles: [
      { name: "Data Viz Specialist", count: 1 }
    ],
    owner: "Karthik N.",
    ownerAvatar: "KN",
    department: "Data Science",
    daysAgo: "1 week ago",
    status: "Open"
  },
  {
    id: 6,
    title: "MediVault: Personal Health & Rx Vault",
    category: "Healthcare / MERN",
    description: "Role-Based health portal for securely uploading medical records, tracking prescriptions, and sharing records with verified doctors.",
    techStack: ["React", "Bcrypt", "JWT", "Express", "MongoDB Atlas"],
    openRoles: [
      { name: "Security & Auth Lead", count: 1 },
      { name: "Frontend Engineer", count: 1 }
    ],
    owner: "Divya M.",
    ownerAvatar: "DM",
    department: "Computer Science",
    daysAgo: "5 days ago",
    status: "Open"
  }
];

const CATEGORIES = ["All", "React", "Node.js", "MongoDB", "Full Stack", "AI / Full Stack", "Web3"];

export default function ProjectExplorer({ onApplyClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const filteredProjects = INITIAL_PROJECTS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedTag === "All") return matchesSearch;
    return matchesSearch && (p.techStack.includes(selectedTag) || p.category.includes(selectedTag));
  });

  return (
    <section id="projects" style={{ padding: '4rem 0', borderTop: '1px solid #1e293b' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <div className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
              <Layers size={14} />
              <span>Live Project Feed</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff' }}>
              Explore Active Collaborations
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Join exciting student teams, contribute code, and build your verified project portfolio.
            </p>
          </div>
          
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Showing <strong style={{ color: '#38bdf8' }}>{filteredProjects.length}</strong> active openings
          </div>
        </div>

        {/* Search Bar and Category Filters */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          {/* Input Box */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text"
              placeholder="Search projects by title, keywords, or tech stack (e.g. React, MongoDB)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1rem 0.9rem 3rem',
                background: '#111827',
                border: '1px solid #1e293b',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
              onBlur={(e) => e.target.style.borderColor = '#1e293b'}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedTag(cat)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  background: selectedTag === cat ? '#38bdf8' : '#1e293b',
                  color: selectedTag === cat ? '#090d16' : '#94a3b8',
                  border: `1px solid ${selectedTag === cat ? '#38bdf8' : '#334155'}`,
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.75rem'
        }}>
          {filteredProjects.map(project => (
            <div 
              key={project.id}
              className="glass-panel"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, border-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#38bdf8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#1e293b';
              }}
            >
              <div>
                {/* Header Badge & Timestamp */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge badge-purple">{project.category}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{project.daysAgo}</span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.75rem' }}>
                  {project.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  {project.description}
                </p>

                {/* Tech Stack Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  {project.techStack.map((tech, i) => (
                    <span key={i} style={{
                      fontSize: '0.7rem',
                      background: '#090d16',
                      color: '#cbd5e1',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '0.35rem',
                      border: '1px solid #1e293b',
                      fontFamily: 'monospace'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Open Vacancies Box */}
                <div style={{
                  background: 'rgba(9, 13, 22, 0.6)',
                  border: '1px dashed #334155',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Open Positions:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {project.openRoles.map((role, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#e2e8f0' }}>
                        <span>• {role.name}</span>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>{role.count} spot</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Owner & Apply Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #1e293b',
                paddingTop: '1rem',
                marginTop: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    background: '#334155',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    {project.ownerAvatar}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#f8fafc' }}>{project.owner}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{project.department}</div>
                  </div>
                </div>

                <button 
                  onClick={() => onApplyClick(project)}
                  className="btn-primary" 
                  style={{ fontSize: '0.8rem', padding: '0.45rem 1rem', borderRadius: '0.4rem' }}
                >
                  Apply Role
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
