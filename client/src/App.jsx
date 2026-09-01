import React, { useState } from 'react';

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: "AI Resume Matcher",
    category: "Full Stack",
    description: "Web application to match student resumes with live tech job descriptions using NLP.",
    skills: ["React", "Node.js", "MongoDB"],
    openRole: "Frontend Developer",
    owner: "Abhimanyu K.",
    status: "Open"
  },
  {
    id: 2,
    title: "Campus Event Booking System",
    category: "Web Development",
    description: "Portal for college clubs to book auditorium halls and manage student registrations.",
    skills: ["React", "Express.js", "CSS"],
    openRole: "Backend Developer",
    owner: "Dhanush V.",
    status: "Open"
  },
  {
    id: 3,
    title: "Student Expense Tracker",
    category: "MERN Stack",
    description: "A clean budget management app for roommates to split hostel groceries and bills.",
    skills: ["JavaScript", "React", "Node.js"],
    openRole: "UI/UX Designer",
    owner: "Aniketh K.",
    status: "Open"
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Frontend Developer');

  // Main page state
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newSkills, setNewSkills] = useState('');

  // Handle Login -> Switch to Main Screen
  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password!");
      return;
    }
    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    setCurrentUser({
      name: formattedName,
      email: email,
      role: role
    });
    setCurrentScreen('main');
  };

  const handleGuest = () => {
    setCurrentUser({
      name: "Guest Student",
      role: "Student Developer"
    });
    setCurrentScreen('main');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setCurrentScreen('login');
  };

  // Add Project
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !newRole.trim()) {
      alert("Please fill all required fields!");
      return;
    }

    const newProj = {
      id: Date.now(),
      title: newTitle,
      category: "Full Stack",
      description: newDesc,
      skills: newSkills ? newSkills.split(',').map(s => s.trim()) : ["React", "Node.js"],
      openRole: newRole,
      owner: currentUser?.name || "Student Dev",
      status: "Open"
    };

    setProjects([newProj, ...projects]);
    setNewTitle('');
    setNewDesc('');
    setNewRole('');
    setNewSkills('');
    setIsModalOpen(false);
    alert("Project posted!");
  };

  const handleApply = (title, roleName) => {
    alert(`Applied for "${roleName}" on project: "${title}"`);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // SCREEN 1: Simple Login
  if (currentScreen === 'login') {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Dev<span>Collab</span></h2>
          <p className="subtitle">Student Teaming Platform • Phase 1</p>

          <form onSubmit={handleLogin} className="simple-form">
            <div className="form-group">
              <label>College Email</label>
              <input
                type="email"
                required
                placeholder="student@rvu.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Login
            </button>
          </form>

          <div className="guest-row">
            <button type="button" className="link-btn" onClick={handleGuest}>
              Skip Login (Browse as Guest)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 2: Simple Main Page
  return (
    <div className="main-container">
      {/* Simple Header */}
      <header className="simple-navbar">
        <div className="brand-logo">
          <h2>Dev<span>Collab</span></h2>
        </div>

        <div className="user-controls">
          <span className="user-badge">
            {currentUser?.name} ({currentUser?.role})
          </span>
          <button className="btn btn-sm btn-primary" onClick={() => setIsModalOpen(true)}>
            + Post Project
          </button>
          <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Page Title & Search Bar */}
      <section className="top-section">
        <h3>Available Projects ({filteredProjects.length})</h3>
        
        <div className="search-filter-row">
          <input
            type="text"
            className="simple-search"
            placeholder="Search projects by skill or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="filter-pills">
            {["All", "Full Stack", "Web Development", "MERN Stack"].map((cat) => (
              <button
                key={cat}
                className={`pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Project Cards Grid */}
      <section className="cards-grid">
        {filteredProjects.length === 0 ? (
          <p className="empty-text">No projects found.</p>
        ) : (
          filteredProjects.map((p) => (
            <div key={p.id} className="simple-card">
              <div className="card-top">
                <span className="cat-badge">{p.category}</span>
                <span className="open-badge">{p.status}</span>
              </div>

              <h4>{p.title}</h4>
              <p className="desc">{p.description}</p>

              <div className="tech-row">
                <strong>Tech Stack:</strong>
                <div className="tech-tags">
                  {p.skills.map((s, i) => (
                    <span key={i} className="tech-pill">{s}</span>
                  ))}
                </div>
              </div>

              <div className="role-box">
                <strong>Looking for:</strong> <span>{p.openRole}</span>
              </div>

              <div className="card-bottom">
                <span className="owner">By: {p.owner}</span>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => handleApply(p.title, p.openRole)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Simple Post Modal */}
      {isModalOpen && (
        <div className="modal-bg" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <h3>Post a Project</h3>
              <button className="close-x" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleAddProject}>
              <div className="form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chat App"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Short description..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Role Needed</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Backend Dev"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, CSS"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simple Clean Footer */}
      <footer className="simple-footer">
        <p>DevCollab • CS3301 Full Stack Development (Phase 1)</p>
      </footer>
    </div>
  );
}
