import React, { useState, useEffect } from 'react';
import { authAPI, projectsAPI, applicationsAPI } from './services/api';

const DEFAULT_PROJECTS = [
  {
    _id: 'proj_1',
    title: "AI Resume Matcher",
    category: "Full Stack",
    description: "Web application to match student resumes with live tech job descriptions using NLP and vector embeddings.",
    skillsRequired: ["React", "Node.js", "MongoDB", "Python"],
    openRole: "Frontend Developer",
    ownerName: "Abhimanyu Kotari",
    status: "Open"
  },
  {
    _id: 'proj_2',
    title: "Campus Event Booking System",
    category: "Web Development",
    description: "Portal for college clubs to book auditorium halls and manage student registrations with calendar scheduling.",
    skillsRequired: ["React", "Express.js", "CSS", "PostgreSQL"],
    openRole: "Backend Developer",
    ownerName: "Dhanush V",
    status: "Open"
  },
  {
    _id: 'proj_3',
    title: "Student Expense Tracker",
    category: "MERN Stack",
    description: "A clean budget management app for roommates to split hostel groceries, utilities, and daily room expenses.",
    skillsRequired: ["JavaScript", "React", "Node.js", "Chart.js"],
    openRole: "UI/UX Designer",
    ownerName: "Aniketh",
    status: "Open"
  },
  {
    _id: 'proj_4',
    title: "Autonomous Drone Simulator",
    category: "AI / ML",
    description: "Simulation environment for testing micro-quadcopter vision algorithms and path planning in 3D space.",
    skillsRequired: ["Python", "OpenCV", "PyTorch", "ROS"],
    openRole: "Computer Vision Engineer",
    ownerName: "Abhimanyu Kotari",
    status: "Open"
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('devcollab_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentScreen, setCurrentScreen] = useState(() => {
    try {
      const saved = localStorage.getItem('devcollab_user');
      return saved ? 'main' : 'login';
    } catch {
      return 'login';
    }
  });

  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [apiConnected, setApiConnected] = useState(false);

  // Auth Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Frontend Developer');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Main Page State
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Post Project Modal
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Full Stack');
  const [newDesc, setNewDesc] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newSkills, setNewSkills] = useState('');

  // Apply Modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [applyPitch, setApplyPitch] = useState('');
  const [applyRole, setApplyRole] = useState('');

  // My Applications Modal
  const [isAppsModalOpen, setIsAppsModalOpen] = useState(false);
  const [myApplications, setMyApplications] = useState([]);

  // Check saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('devcollab_user');
    const savedToken = localStorage.getItem('devcollab_token');
    if (savedUser && savedToken) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setCurrentScreen('main');
      } catch (err) {
        localStorage.removeItem('devcollab_user');
        localStorage.removeItem('devcollab_token');
      }
    }
    fetchProjects();
  }, []);

  // Fetch projects from backend REST API
  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const data = await projectsAPI.getAll(searchTerm, selectedCategory);
      if (data && data.projects) {
        setProjects(data.projects);
        setApiConnected(true);
      }
    } catch (err) {
      // Backend not running yet or offline: fallback gracefully
      setApiConnected(false);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Trigger search whenever searchTerm or category changes
  useEffect(() => {
    if (currentScreen === 'main') {
      fetchProjects();
    }
  }, [searchTerm, selectedCategory, currentScreen]);

  // Auth Handler: Login or Register
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      let res;
      if (authMode === 'login') {
        res = await authAPI.login(email, password);
      } else {
        res = await authAPI.register({
          name,
          email,
          password,
          role,
          skills: skills ? skills.split(',').map(s => s.trim()) : [],
          bio
        });
      }

      if (res.token && res.user) {
        localStorage.setItem('devcollab_token', res.token);
        localStorage.setItem('devcollab_user', JSON.stringify(res.user));
        setCurrentUser(res.user);
        setApiConnected(true);
        setCurrentScreen('main');
      }
    } catch (err) {
      // Fallback in-memory authentication if backend is offline
      if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
        const fallbackName = name.trim() || email.split('@')[0];
        const formatted = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
        const fallbackUser = {
          name: formatted,
          email: email,
          role: role
        };
        localStorage.setItem('devcollab_user', JSON.stringify(fallbackUser));
        localStorage.setItem('devcollab_token', 'offline_token_' + Date.now());
        setCurrentUser(fallbackUser);
        setApiConnected(false);
        setCurrentScreen('main');
      } else {
        setAuthError(err.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGuest = () => {
    const guestUser = {
      name: "Guest Student",
      email: "guest@rvu.edu.in",
      role: "Student Developer"
    };
    localStorage.setItem('devcollab_user', JSON.stringify(guestUser));
    localStorage.setItem('devcollab_token', 'guest_token_' + Date.now());
    setCurrentUser(guestUser);
    setCurrentScreen('main');
  };

  const handleLogout = () => {
    localStorage.removeItem('devcollab_token');
    localStorage.removeItem('devcollab_user');
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setAuthError('');
    setCurrentScreen('login');
  };

  // Post Project Handler
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !newRole.trim()) {
      alert("Please fill in all required fields!");
      return;
    }

    const payload = {
      title: newTitle.trim(),
      category: newCategory,
      description: newDesc.trim(),
      openRole: newRole.trim(),
      skillsRequired: newSkills ? newSkills.split(',').map(s => s.trim()) : [],
      ownerName: currentUser?.name || "Student Developer"
    };

    try {
      const res = await projectsAPI.create(payload);
      if (res && res.project) {
        setProjects([res.project, ...projects]);
      }
    } catch (err) {
      // Offline fallback
      const localProj = {
        _id: 'proj_' + Date.now(),
        ...payload
      };
      setProjects([localProj, ...projects]);
    }

    setNewTitle('');
    setNewDesc('');
    setNewRole('');
    setNewSkills('');
    setIsPostModalOpen(false);
    alert('Project successfully posted to DevCollab marketplace!');
  };

  // Open Apply Modal
  const openApply = (project) => {
    setSelectedProject(project);
    setApplyRole(project.openRole);
    setApplyPitch(`Hi ${project.ownerName}, I have strong experience in ${project.skillsRequired?.slice(0, 2).join(' and ') || 'full stack development'} and would love to join your project!`);
    setIsApplyModalOpen(true);
  };

  // Submit Application
  const submitApplication = async (e) => {
    e.preventDefault();
    if (!applyPitch.trim()) {
      alert("Please enter a short pitch!");
      return;
    }

    const appData = {
      projectId: selectedProject._id,
      projectTitle: selectedProject.title,
      roleApplied: applyRole,
      pitch: applyPitch.trim(),
      applicantName: currentUser?.name || "Student Applicant",
      applicantEmail: currentUser?.email || "student@rvu.edu.in"
    };

    try {
      await applicationsAPI.submit(appData);
    } catch (err) {
      // Local fallback
    }

    setMyApplications([
      { ...appData, _id: 'app_' + Date.now(), status: 'Pending', createdAt: new Date().toISOString() },
      ...myApplications
    ]);

    setIsApplyModalOpen(false);
    alert(`Application submitted for "${applyRole}" on "${selectedProject.title}"!`);
  };

  // Fetch My Applications
  const openApplicationsModal = async () => {
    setIsAppsModalOpen(true);
    if (currentUser?.email) {
      try {
        const res = await applicationsAPI.getMyApplications(currentUser.email);
        if (res && res.applications && res.applications.length > 0) {
          setMyApplications(res.applications);
        }
      } catch (err) {
        // Keeps local state
      }
    }
  };

  // Filter projects in memory for real-time responsiveness
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.skillsRequired && p.skillsRequired.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  // =========================================================================
  // SCREEN 1: AUTHENTICATION SCREEN (Login & Sign Up with Validation)
  // =========================================================================
  if (currentScreen === 'login') {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="brand-badge">DevCollab Platform</div>
          <h2><span>Dev</span>Collab</h2>
          <p className="subtitle">Developer Teaming & Open Task Marketplace</p>

          <div className="auth-tab-switch">
            <button
              type="button"
              className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
            >
              Student Login
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${authMode === 'signup' ? 'active' : ''}`}
              onClick={() => { setAuthMode('signup'); setAuthError(''); }}
            >
              Sign Up
            </button>
          </div>

          {authError && <div className="auth-error-banner">{authError}</div>}

          <form onSubmit={handleAuthSubmit}>
            {authMode === 'signup' && (
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Abhimanyu Kotari"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>College Email *</label>
              <input
                type="email"
                placeholder="student@rvu.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                placeholder="Enter password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label>Primary Skill Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Frontend Developer">Frontend Developer (React / UI)</option>
                <option value="Backend Developer">Backend Developer (Node / Express)</option>
                <option value="Full Stack Developer">Full Stack Developer (MERN)</option>
                <option value="UI/UX Designer">UI/UX Designer (Figma / CSS)</option>
                <option value="Student Developer">Student Developer</option>
              </select>
            </div>

            {authMode === 'signup' && (
              <div className="form-group">
                <label>Key Skills (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, MongoDB"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block" disabled={authLoading}>
              {authLoading ? 'Verifying...' : (authMode === 'login' ? 'Login with JWT' : 'Create Account')}
            </button>
          </form>

          <div className="guest-action">
            <button type="button" className="btn-link" onClick={handleGuest}>
              Skip Login & Explore as Guest
            </button>
          </div>

          <div className="login-footer-info">
            <span>Module 4: Bcrypt Password Hashing + JWT Authorization</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 2: MAIN DASHBOARD & PROJECT MARKETPLACE
  // =========================================================================
  return (
    <div className="main-wrapper">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h2><span>Dev</span>Collab</h2>
            <span className="badge-phase">Phase-2 Full Stack</span>
          </div>

          <div className="nav-right">
            <div className="api-status-pill" title={apiConnected ? "Connected to Express Backend" : "Operating with local fallback"}>
              <span className={`status-dot ${apiConnected ? 'online' : 'offline'}`}></span>
              {apiConnected ? 'API Live (Node/Express)' : 'In-Memory State'}
            </div>

            {currentUser && (
              <div className="user-badge">
                <span className="user-name">{currentUser.name}</span>
                <span className="user-role-tag">{currentUser.role || 'Developer'}</span>
              </div>
            )}

            <button className="btn btn-secondary btn-sm" onClick={openApplicationsModal}>
              My Applications ({myApplications.length})
            </button>

            <button className="btn btn-primary btn-sm" onClick={() => setIsPostModalOpen(true)}>
              + Post Project
            </button>

            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="content-container">
        {/* Banner Section */}
        <section className="dashboard-hero">
          <h1>Find Teammates & Open-Source Tasks</h1>
          <p>Collaborate on real-world MERN stack projects, split development roles, and build your engineering portfolio.</p>
        </section>

        {/* Search & Category Filter Controls */}
        <section className="filter-panel">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by project title, keyword, or tech skill (e.g. React, MongoDB)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>
            )}
          </div>

          <div className="category-chips">
            {['All', 'Full Stack', 'Web Development', 'MERN Stack', 'AI / ML'].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Project Cards Grid */}
        <section className="projects-grid">
          {projectsLoading ? (
            <div className="empty-state">Loading marketplace projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="empty-state">
              <h3>No matching projects found</h3>
              <p>Try clearing your search filters or click "+ Post Project" to publish a new task!</p>
            </div>
          ) : (
            filteredProjects.map((p) => (
              <article key={p._id || p.id} className="project-card">
                <div className="card-header">
                  <span className="category-tag">{p.category || 'General'}</span>
                  <span className="status-indicator">● {p.status || 'Open'}</span>
                </div>

                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.description}</p>

                <div className="tech-section">
                  <span className="section-label">Required Skills:</span>
                  <div className="tech-tags">
                    {p.skillsRequired && p.skillsRequired.map((skill, i) => (
                      <span key={i} className="tech-pill">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="role-callout">
                  <strong>Open Role:</strong> {p.openRole}
                </div>

                <div className="card-footer">
                  <div className="owner-info">
                    <span className="owner-label">Posted by</span>
                    <span className="owner-name">{p.ownerName || 'Student'}</span>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => openApply(p)}>
                    Apply Now
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      {/* POST PROJECT MODAL */}
      {isPostModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsPostModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Post New Project Task</h3>
              <button className="modal-close" onClick={() => setIsPostModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddProject}>
              <div className="form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Smart Campus Navigation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  <option value="Full Stack">Full Stack</option>
                  <option value="Web Development">Web Development</option>
                  <option value="MERN Stack">MERN Stack</option>
                  <option value="AI / ML">AI / ML</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  rows="3"
                  placeholder="What is the goal of this project and what problem does it solve?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Open Teammate Role *</label>
                <input
                  type="text"
                  placeholder="e.g. Backend API Developer"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Skills Required (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Node.js, Express, MongoDB"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsPostModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Project (POST)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPLY MODAL */}
      {isApplyModalOpen && selectedProject && (
        <div className="modal-backdrop" onClick={() => setIsApplyModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply for {selectedProject.title}</h3>
              <button className="modal-close" onClick={() => setIsApplyModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={submitApplication}>
              <div className="apply-project-summary">
                <p><strong>Lead:</strong> {selectedProject.ownerName}</p>
                <p><strong>Applying as:</strong> {applyRole}</p>
              </div>

              <div className="form-group">
                <label>Select Role</label>
                <input
                  type="text"
                  value={applyRole}
                  onChange={(e) => setApplyRole(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Why are you a good fit? (Pitch) *</label>
                <textarea
                  rows="4"
                  placeholder="Describe your tech stack experience, GitHub projects, and availability..."
                  value={applyPitch}
                  onChange={(e) => setApplyPitch(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsApplyModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Application (POST)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MY APPLICATIONS MODAL */}
      {isAppsModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAppsModalOpen(false)}>
          <div className="modal-content apps-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>My Submitted Applications</h3>
              <button className="modal-close" onClick={() => setIsAppsModalOpen(false)}>✕</button>
            </div>

            <div className="apps-list">
              {myApplications.length === 0 ? (
                <p className="empty-text">You haven't submitted any project applications yet. Click "Apply Now" on any card to connect with leads!</p>
              ) : (
                myApplications.map((app, idx) => (
                  <div key={app._id || idx} className="app-card-item">
                    <div className="app-item-top">
                      <strong>{app.projectTitle || 'Project Application'}</strong>
                      <span className={`status-tag ${app.status?.toLowerCase() || 'pending'}`}>
                        {app.status || 'Pending'}
                      </span>
                    </div>
                    <div className="app-role-line">Role: <span>{app.roleApplied}</span></div>
                    <p className="app-pitch-text">"{app.pitch}"</p>
                  </div>
                ))
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setIsAppsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>DevCollab Platform • RV University CS3301 Full Stack Development CIE-2 (Phase 2)</p>
        <p className="footer-sub">MERN Stack Architecture: MongoDB + Express.js + React.js + Node.js</p>
      </footer>
    </div>
  );
}
