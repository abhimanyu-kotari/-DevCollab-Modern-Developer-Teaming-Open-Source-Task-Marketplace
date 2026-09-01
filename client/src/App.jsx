import React, { useState } from 'react';

// Initial project listings (Module 2: React State)
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
  // Screen state: 'login' (Screen 1) or 'main' (Screen 2)
  const [currentScreen, setCurrentScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Full Stack Developer');

  // Main page project list state
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Post project modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newSkills, setNewSkills] = useState('');

  // -------------------------------------------------------------
  // LOGIN ACTION: Moves from Screen 1 to Screen 2
  // -------------------------------------------------------------
  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password!");
      return;
    }

    // Extract student name from email (e.g., student@rvu.edu.in -> Student)
    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    setCurrentUser({
      name: formattedName,
      email: email,
      role: role
    });

    // Switch to the main landing page
    setCurrentScreen('main');
  };

  // Continue as guest
  const handleGuest = () => {
    setCurrentUser({
      name: "Guest Student",
      role: "Developer"
    });
    setCurrentScreen('main');
  };

  // Logout action: Back to Screen 1
  const handleLogout = () => {
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setCurrentScreen('login');
  };

  // Add new project listing
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !newRole.trim()) {
      alert("Please fill all required fields!");
      return;
    }

    const newProject = {
      id: Date.now(),
      title: newTitle,
      category: "Full Stack",
      description: newDesc,
      skills: newSkills ? newSkills.split(',').map(s => s.trim()) : ["React", "JavaScript"],
      openRole: newRole,
      owner: currentUser?.name || "Student Dev",
      status: "Open"
    };

    setProjects([newProject, ...projects]);
    setNewTitle('');
    setNewDesc('');
    setNewRole('');
    setNewSkills('');
    setIsModalOpen(false);
    alert("Project listing posted successfully!");
  };

  // Apply to a project
  const handleApply = (projectTitle, roleName) => {
    alert(`Application submitted for "${roleName}" on project "${projectTitle}"! The owner will contact you.`);
  };

  // Filter projects by search term & category
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // =============================================================
  // SCREEN 1: LOGIN SCREEN
  // =============================================================
  if (currentScreen === 'login') {
    return (
      <div className="login-wrapper">
        <div className="login-box">
          <div className="login-header">
            <h2>Dev<span>Collab</span></h2>
            <p>Student Teaming & Project Marketplace</p>
            <span className="course-tag">CS3301 Full Stack Development</span>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-item">
              <label>College Email ID *</label>
              <input
                type="email"
                required
                placeholder="e.g. student@rvu.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-item">
              <label>Password *</label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-item">
              <label>Your Preferred Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Frontend Developer">Frontend Developer (React)</option>
                <option value="Backend Developer">Backend Developer (Node / Express)</option>
                <option value="Full Stack Developer">Full Stack Developer (MERN)</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Database Lead">Database Lead (MongoDB)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Login to Main Page →
            </button>
          </form>

          <div className="login-extra">
            <button type="button" className="link-button" onClick={handleGuest}>
              Skip Login (Browse as Guest)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =============================================================
  // SCREEN 2: MAIN PAGE (LANDING PAGE & EXPLORER)
  // =============================================================
  return (
    <div className="main-wrapper">
      {/* Navbar */}
      <header className="site-header">
        <div className="brand">
          <h2>Dev<span>Collab</span></h2>
          <small>Phase 1 Prototype</small>
        </div>

        <div className="header-user">
          <span className="user-greeting">
            Welcome, <strong>{currentUser?.name}</strong> ({currentUser?.role})
          </span>
          <button className="btn btn-sm btn-primary" onClick={() => setIsModalOpen(true)}>
            + Post Project
          </button>
          <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Find Teammates. Build Projects Together.</h1>
        <p>
          Post your project idea with missing team roles, apply to exciting student projects, 
          and build your full-stack semester applications.
        </p>
        <div className="hero-actions">
          <a href="#projects-list" className="btn btn-primary">Browse Projects</a>
          <button className="btn btn-secondary" onClick={() => setIsModalOpen(true)}>
            + Post New Listing
          </button>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section id="projects-list" className="search-filter-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title, keywords, or skills (e.g. React, Node, MongoDB)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {["All", "Full Stack", "Web Development", "MERN Stack"].map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Project Cards Grid */}
      <section className="projects-section">
        <div className="projects-header">
          <h3>Active Project Openings ({filteredProjects.length})</h3>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="no-results">
            <p>No project openings match your search.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredProjects.map((p) => (
              <div key={p.id} className="card">
                <div className="card-top">
                  <span className="badge-cat">{p.category}</span>
                  <span className="badge-status">{p.status}</span>
                </div>

                <h4>{p.title}</h4>
                <p className="card-description">{p.description}</p>

                <div className="tech-tags">
                  <strong>Tech:</strong>
                  <div className="tags-row">
                    {p.skills.map((s, i) => (
                      <span key={i} className="tag-pill">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="role-highlight">
                  <strong>Open Role:</strong> {p.openRole}
                </div>

                <div className="card-bottom">
                  <span className="owner-label">By {p.owner}</span>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleApply(p.title, p.openRole)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How it works info */}
      <section className="steps-section">
        <h3>How DevCollab Works</h3>
        <div className="steps-grid">
          <div className="step-item">
            <div className="circle-num">1</div>
            <h4>Post Project</h4>
            <p>Share what you want to build and what technical skills your team needs.</p>
          </div>
          <div className="step-item">
            <div className="circle-num">2</div>
            <h4>Apply & Match</h4>
            <p>Browse open positions, pitch your skills, and get accepted into a team.</p>
          </div>
          <div className="step-item">
            <div className="circle-num">3</div>
            <h4>Build & Ship</h4>
            <p>Collaborate with classmates to ship a complete MERN stack application.</p>
          </div>
        </div>
      </section>

      {/* Simple Post Project Modal Form */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title-row">
              <h3>Post a New Project</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleAddProject}>
              <div className="form-item">
                <label>Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Campus Navigation App"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="form-item">
                <label>Project Description *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Briefly describe the features and purpose of your project..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="form-item">
                <label>Vacant Role Needed *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React Frontend Lead"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                />
              </div>

              <div className="form-item">
                <label>Required Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, CSS"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                />
              </div>

              <div className="modal-btn-row">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="site-footer">
        <p>DevCollab • CS3301 Full Stack Development (RV University)</p>
        <p><small>Phase 1 Team Prototype</small></p>
      </footer>
    </div>
  );
}
