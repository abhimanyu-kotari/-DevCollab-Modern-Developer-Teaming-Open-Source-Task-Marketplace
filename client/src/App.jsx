import React, { useState, useEffect, useCallback } from 'react';
import { authAPI, projectsAPI, applicationsAPI } from './services/api';

const CATEGORY_COVERS = {
  'Full Stack': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  'Web Development': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  'MERN Stack': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  'AI / ML': 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80'
};

const DEFAULT_PROJECTS = [
  {
    _id: 'proj_1',
    title: "AI Resume Matcher",
    category: "Full Stack",
    description: "Web application to match student resumes with live tech job descriptions using NLP and vector embeddings.",
    skillsRequired: ["React", "Node.js", "MongoDB", "Python"],
    openRole: "Frontend Developer",
    ownerName: "Abhimanyu Kotari",
    status: "Open",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: 'proj_2',
    title: "Campus Event Booking System",
    category: "Web Development",
    description: "Portal for university clubs to book auditorium halls and manage student registrations with calendar scheduling.",
    skillsRequired: ["React", "Express.js", "CSS", "PostgreSQL"],
    openRole: "Backend Developer",
    ownerName: "Dhanush V",
    status: "Open",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: 'proj_3',
    title: "Student Expense Tracker",
    category: "MERN Stack",
    description: "A clean budget management app for college roommates to split hostel groceries, utilities, and daily room expenses.",
    skillsRequired: ["JavaScript", "React", "Node.js", "Chart.js"],
    openRole: "UI/UX Designer",
    ownerName: "Aniketh",
    status: "Open",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: 'proj_4',
    title: "Autonomous Drone Simulator",
    category: "AI / ML",
    description: "Simulation environment for testing micro-quadcopter vision algorithms and path planning in 3D space.",
    skillsRequired: ["Python", "OpenCV", "PyTorch", "ROS"],
    openRole: "Computer Vision Engineer",
    ownerName: "Abhimanyu Kotari",
    status: "Open",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80"
  }
];

export default function App() {
  // Synchronous session recovery from localStorage
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

  // Profile & Teaming Hub Modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileActiveTab, setProfileActiveTab] = useState('received'); // 'received', 'sent', 'projects'
  const [myApplications, setMyApplications] = useState([]); // Applications sent by user
  const [receivedApplications, setReceivedApplications] = useState([]); // Applications received on user's projects

  // Fetch projects from REST API with default fallback
  const fetchProjects = useCallback(async () => {
    try {
      const data = await projectsAPI.getAll(searchTerm, selectedCategory);
      if (data && data.projects && data.projects.length > 0) {
        setProjects(data.projects);
        setApiConnected(true);
      } else if (data && data.projects && data.projects.length === 0 && !searchTerm && selectedCategory === 'All') {
        setProjects(DEFAULT_PROJECTS);
        setApiConnected(true);
      } else if (data && data.projects) {
        setProjects(data.projects);
        setApiConnected(true);
      }
    } catch (err) {
      setApiConnected(false);
    }
  }, [searchTerm, selectedCategory]);

  // Fetch submitted applications for current user
  const fetchMyApplications = useCallback(async (userEmail) => {
    if (!userEmail) return;
    try {
      const res = await applicationsAPI.getMyApplications(userEmail);
      if (res && res.applications) {
        setMyApplications(res.applications);
      }
    } catch (err) {
      // Keep existing state
    }
  }, []);

  // Fetch received applications on projects created by current user
  const fetchReceivedApplications = useCallback(async (userName) => {
    if (!userName) return;
    try {
      const res = await applicationsAPI.getReceivedApplications(userName);
      if (res && res.applications) {
        setReceivedApplications(res.applications);
      }
    } catch (err) {
      // Keep existing state
    }
  }, []);

  // Sync entire app state
  const syncAll = useCallback(async () => {
    await fetchProjects();
    if (currentUser?.email) {
      await fetchMyApplications(currentUser.email);
    }
    if (currentUser?.name) {
      await fetchReceivedApplications(currentUser.name);
    }
  }, [fetchProjects, fetchMyApplications, fetchReceivedApplications, currentUser?.email, currentUser?.name]);

  // Real-time tab sync and auto-polling
  useEffect(() => {
    if (currentScreen === 'main') {
      syncAll();

      const handleFocus = () => syncAll();
      window.addEventListener('focus', handleFocus);
      const timer = setInterval(syncAll, 6000);

      return () => {
        window.removeEventListener('focus', handleFocus);
        clearInterval(timer);
      };
    }
  }, [currentScreen, syncAll]);

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
        fetchMyApplications(res.user.email);
        fetchReceivedApplications(res.user.name);
      }
    } catch (err) {
      if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
        const fallbackName = name.trim() || email.split('@')[0];
        const formatted = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
        const fallbackUser = {
          name: formatted,
          email: email.toLowerCase(),
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
    setMyApplications([]);
    setReceivedApplications([]);
    setCurrentScreen('login');
  };

  // Add / Post Project Handler
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
      ownerName: currentUser?.name || "Student Developer",
      image: CATEGORY_COVERS[newCategory] || CATEGORY_COVERS['Full Stack']
    };

    try {
      const res = await projectsAPI.create(payload);
      if (res && res.project) {
        setProjects(prev => [res.project, ...prev]);
      }
    } catch (err) {
      const localProj = {
        _id: 'proj_' + Date.now(),
        ...payload
      };
      setProjects(prev => [localProj, ...prev]);
    }

    setNewTitle('');
    setNewDesc('');
    setNewRole('');
    setNewSkills('');
    setIsPostModalOpen(false);
    alert('Project successfully published to DevCollab!');
    fetchProjects();
  };

  // Delete Project Handler
  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await projectsAPI.delete(id);
    } catch (err) {
      console.warn('Local delete fallback:', err.message);
    }

    setProjects(prev => prev.filter(p => (p._id || p.id) !== id));
  };

  // Withdraw / Remove Application Handler
  const handleWithdrawApplication = async (appId) => {
    if (!window.confirm("Do you want to withdraw this application?")) {
      return;
    }

    try {
      await applicationsAPI.withdraw(appId);
    } catch (err) {
      console.warn('Local withdraw fallback:', err.message);
    }

    setMyApplications(prev => prev.filter(a => (a._id || a.id) !== appId));
    alert('Application withdrawn.');
  };

  // Accept or Reject Candidate Application Handler
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await applicationsAPI.updateStatus(appId, newStatus);
    } catch (err) {
      console.warn('Status update fallback:', err.message);
    }

    setReceivedApplications(prev =>
      prev.map(a => ((a._id || a.id) === appId ? { ...a, status: newStatus } : a))
    );
    alert(`Candidate marked as "${newStatus}".`);
  };

  // Check authorization: ONLY the project creator can delete their project
  const canDeleteProject = (p) => {
    if (!currentUser || !currentUser.name) return false;
    return p.ownerName?.toLowerCase() === currentUser.name.toLowerCase();
  };

  // Check if current user already applied to this project
  const isAlreadyApplied = (projectId) => {
    return myApplications.some(app =>
      String(app.projectId || app.project) === String(projectId)
    );
  };

  // Open Apply Modal
  const openApply = (project) => {
    const projId = project._id || project.id;
    if (isAlreadyApplied(projId)) {
      alert('You have already submitted an application for this project!');
      return;
    }
    setSelectedProject(project);
    setApplyRole(project.openRole);
    setApplyPitch(`Hi ${project.ownerName}, I have strong experience in ${project.skillsRequired?.slice(0, 2).join(' and ') || 'development'} and would love to join your project!`);
    setIsApplyModalOpen(true);
  };

  // Submit Application
  const submitApplication = async (e) => {
    e.preventDefault();
    if (!applyPitch.trim()) {
      alert("Please enter a short pitch!");
      return;
    }

    const projId = selectedProject._id || selectedProject.id;
    const appData = {
      projectId: projId,
      projectTitle: selectedProject.title,
      roleApplied: applyRole,
      pitch: applyPitch.trim(),
      applicantName: currentUser?.name || "Student Applicant",
      applicantEmail: (currentUser?.email || "student@rvu.edu.in").toLowerCase()
    };

    try {
      await applicationsAPI.submit(appData);
    } catch (err) {
      if (err.message && err.message.includes('already')) {
        alert(err.message);
        setIsApplyModalOpen(false);
        return;
      }
    }

    const newAppRecord = {
      ...appData,
      _id: 'app_' + Date.now(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setMyApplications(prev => [newAppRecord, ...prev]);
    setIsApplyModalOpen(false);
    alert(`Application submitted for "${applyRole}" on "${selectedProject.title}"!`);

    if (currentUser?.email) {
      fetchMyApplications(currentUser.email);
    }
  };

  // User's own projects
  const myOwnProjects = projects.filter(p =>
    p.ownerName?.toLowerCase() === currentUser?.name?.toLowerCase()
  );

  // Real-time client-side filter
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.skillsRequired && p.skillsRequired.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  // =========================================================================
  // SCREEN 1: AUTHENTICATION SCREEN (Dark Theme)
  // =========================================================================
  if (currentScreen === 'login') {
    return (
      <div className="login-container dark-theme">
        <div className="login-card">
          <div className="brand-hero-logo">
            <div className="brand-icon-box">⚡</div>
            <h2>Dev<span className="accent-text">Collab</span></h2>
          </div>
          <p className="subtitle">The Developer Teaming & Open Source Task Marketplace</p>

          <div className="auth-tab-switch">
            <button
              type="button"
              className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${authMode === 'signup' ? 'active' : ''}`}
              onClick={() => { setAuthMode('signup'); setAuthError(''); }}
            >
              Create Account
            </button>
          </div>

          {authError && <div className="auth-error-banner">{authError}</div>}

          <form onSubmit={handleAuthSubmit} className="auth-form">
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
              <label>Developer Email *</label>
              <input
                type="email"
                placeholder="developer@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                placeholder="Enter password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label>Primary Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Frontend Developer">Frontend Developer (React / UI)</option>
                <option value="Backend Developer">Backend Developer (Node / Express)</option>
                <option value="Full Stack Developer">Full Stack Developer (MERN Stack)</option>
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

            <button type="submit" className="btn btn-emerald-primary btn-block" disabled={authLoading}>
              {authLoading ? 'Authenticating...' : (authMode === 'login' ? 'Sign In with JWT →' : 'Register Developer Account →')}
            </button>
          </form>

          <div className="guest-action">
            <button type="button" className="btn-link" onClick={handleGuest}>
              Skip Login & Explore as Guest →
            </button>
          </div>

          <div className="login-footer-info">
            <span>🛡️ Bcrypt Salt Hashing & Cryptographic JWT Authorization</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 2: MAIN DASHBOARD & PROJECT MARKETPLACE (Dark Theme)
  // =========================================================================
  return (
    <div className="main-wrapper dark-theme">
      {/* Top Glassmorphic Navbar */}
      <header className="navbar">
        <div className="nav-container">
          {/* Left: Brand Logo */}
          <div className="nav-brand">
            <div className="brand-icon-box">⚡</div>
            <div className="brand-title-wrap">
              <h2>Dev<span className="accent-text">Collab</span></h2>
              <span className="badge-pill">v2.0</span>
            </div>
          </div>

          {/* Right: + Post Project & User Profile (All user actions consolidated) */}
          <div className="nav-right">
            {/* + Post Project Button */}
            <button className="btn btn-emerald-primary btn-sm" onClick={() => setIsPostModalOpen(true)}>
              <span className="btn-icon">⚡</span> + Post Project
            </button>

            {/* User Profile Button with Name (Opens Profile, Applications & Logout) */}
            {currentUser && (
              <button
                className="user-profile-button"
                onClick={() => setIsProfileModalOpen(true)}
                title="Open Profile, Applications & Logout"
              >
                <div className="avatar-initial">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-btn-details">
                  <span className="user-btn-name">{currentUser.name}</span>
                  <span className="user-btn-role">{currentUser.role || 'Developer'}</span>
                </div>
                {receivedApplications.length > 0 && (
                  <span className="received-badge" title={`${receivedApplications.length} candidate applications for your projects!`}>
                    {receivedApplications.length}
                  </span>
                )}
                <span className="profile-dropdown-arrow">▾</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="content-container">
        {/* Hero Section with Developer Visual Showcase */}
        <section className="dashboard-hero">
          <div className="hero-split-grid">
            <div className="hero-content-col">
              <div className="hero-announcement">
                <span className="announcement-sparkle">🚀</span>
                <span>Developer Teaming & Open Task Marketplace</span>
                <span className="announcement-tag">MERN Stack</span>
              </div>

              <h1 className="hero-heading">
                Find Teammates. Build Projects. <br />
                <span className="hero-gradient-text">Ship Real Code.</span>
              </h1>

              <p className="hero-subtext">
                Connect with peer developers, claim open roles, and form agile engineering teams backed by real-time MongoDB Atlas tracking.
              </p>

              <div className="hero-stats-row">
                <div className="stat-card">
                  <span className="stat-number">{projects.length}+</span>
                  <span className="stat-label">Active Projects</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">REST API CRUD</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">JWT</span>
                  <span className="stat-label">Bcrypt Security</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">Atlas</span>
                  <span className="stat-label">Cloud Database</span>
                </div>
              </div>
            </div>

            <div className="hero-visual-col">
              <div className="hero-ide-window">
                <div className="ide-window-header">
                  <div className="ide-window-dots">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                  </div>
                  <span className="ide-window-title">devcollab-workspace // sprint-terminal</span>
                  <span className="ide-window-status">● Live Sync</span>
                </div>
                <div className="ide-window-body">
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
                    alt="Developer Teaming Coding Workspace"
                    className="ide-banner-img"
                  />
                  <div className="ide-floating-overlay">
                    <div className="ide-glass-chip">
                      <span className="chip-spark">⚡</span>
                      <div>
                        <strong>Agile Teaming In Progress</strong>
                        <span>4+ Verified Projects Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Category Filter Controls */}
        <section className="filter-panel">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
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
            {[
              { id: 'All', label: '🌟 All Projects' },
              { id: 'Full Stack', label: '💻 Full Stack' },
              { id: 'Web Development', label: '🌐 Web Development' },
              { id: 'MERN Stack', label: '⚡ MERN Stack' },
              { id: 'AI / ML', label: '🤖 AI / ML' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Project Cards Grid */}
        <section className="projects-grid">
          {projectsLoading ? (
            <div className="empty-state">
              <div className="loading-spinner"></div>
              <p>Loading projects from MongoDB Atlas...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📂</div>
              <h3>No matching projects found</h3>
              <p>Try clearing your search query or click "+ Post Project" to publish a new task!</p>
            </div>
          ) : (
            filteredProjects.map((p) => {
              const projId = p._id || p.id;
              const applied = isAlreadyApplied(projId);
              const coverImage = p.image || CATEGORY_COVERS[p.category] || CATEGORY_COVERS['Full Stack'];

              return (
                <article key={projId} className="project-card">
                  {/* Project Cover Image */}
                  <div className="project-card-image-wrap">
                    <img
                      src={coverImage}
                      alt={p.title}
                      className="project-card-image"
                      loading="lazy"
                    />
                    <div className="project-image-gradient"></div>
                    <span className="category-tag-floating">{p.category || 'General'}</span>
                    <span className="status-indicator-floating">
                      <span className="status-dot-pulse"></span>
                      {p.status || 'Open'}
                    </span>
                  </div>

                  <div className="project-card-body">
                    <h3 className="project-title">{p.title}</h3>
                    <p className="project-desc">{p.description}</p>

                    <div className="tech-section">
                      <span className="section-label">Required Tech Stack:</span>
                      <div className="tech-tags">
                        {p.skillsRequired && p.skillsRequired.map((skill, i) => (
                          <span key={i} className="tech-pill">#{skill}</span>
                        ))}
                      </div>
                    </div>

                    <div className="role-callout">
                      <span className="role-callout-icon">🎯</span>
                      <div className="role-callout-text">
                        <span className="role-callout-label">Open Position</span>
                        <strong>{p.openRole}</strong>
                      </div>
                    </div>

                    <div className="card-footer">
                      <div className="owner-info">
                        <span className="owner-label">Project Lead</span>
                        <span className="owner-name">{p.ownerName || 'Student'}</span>
                      </div>

                      <div className="card-actions-group">
                        {/* Delete Button (Only Owner) */}
                        {canDeleteProject(p) && (
                          <button
                            type="button"
                            className="btn btn-delete-sm"
                            title="Delete this project post"
                            onClick={() => handleDeleteProject(projId, p.title)}
                          >
                            🗑️ Delete
                          </button>
                        )}

                        {/* Apply Button */}
                        {applied ? (
                          <button className="btn btn-applied" disabled title="Already applied">
                            Applied ✓
                          </button>
                        ) : (
                          <button className="btn btn-emerald-primary btn-sm" onClick={() => openApply(p)}>
                            Apply Now →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>

      {/* DEVELOPER PROFILE DRAWER (Slide-over panel containing Inquiries, Applications, Projects, and Logout) */}
      {isProfileModalOpen && (
        <div className="profile-drawer-backdrop" onClick={() => setIsProfileModalOpen(false)}>
          <div className="profile-drawer" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="profile-drawer-header">
              <div className="profile-drawer-title">
                <span className="drawer-icon">⚡</span>
                <h3>Developer Profile</h3>
              </div>
              <button className="modal-close" onClick={() => setIsProfileModalOpen(false)}>✕</button>
            </div>

            {/* User Identity Card */}
            <div className="profile-identity-card">
              <div className="profile-avatar-wrap">
                <div className="avatar-initial-large">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="avatar-online-dot"></span>
              </div>
              <h4 className="profile-name">{currentUser?.name || 'Developer'}</h4>
              <span className="profile-badge">{currentUser?.role || 'Developer'}</span>
              <p className="profile-email">{currentUser?.email}</p>

              {/* Overview Counters */}
              <div className="profile-stats-row">
                <div
                  className={`profile-stat-box ${profileActiveTab === 'received' ? 'active' : ''}`}
                  onClick={() => setProfileActiveTab('received')}
                >
                  <span className="stat-count">{receivedApplications.length}</span>
                  <span className="stat-name">Inquiries</span>
                </div>
                <div
                  className={`profile-stat-box ${profileActiveTab === 'sent' ? 'active' : ''}`}
                  onClick={() => setProfileActiveTab('sent')}
                >
                  <span className="stat-count">{myApplications.length}</span>
                  <span className="stat-name">Applications</span>
                </div>
                <div
                  className={`profile-stat-box ${profileActiveTab === 'projects' ? 'active' : ''}`}
                  onClick={() => setProfileActiveTab('projects')}
                >
                  <span className="stat-count">{myOwnProjects.length}</span>
                  <span className="stat-name">Projects</span>
                </div>
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="profile-tabs-nav">
              <button
                type="button"
                className={`profile-tab-item ${profileActiveTab === 'received' ? 'active' : ''}`}
                onClick={() => setProfileActiveTab('received')}
              >
                📥 Inquiries ({receivedApplications.length})
              </button>
              <button
                type="button"
                className={`profile-tab-item ${profileActiveTab === 'sent' ? 'active' : ''}`}
                onClick={() => setProfileActiveTab('sent')}
              >
                📤 Applications ({myApplications.length})
              </button>
              <button
                type="button"
                className={`profile-tab-item ${profileActiveTab === 'projects' ? 'active' : ''}`}
                onClick={() => setProfileActiveTab('projects')}
              >
                📁 Projects ({myOwnProjects.length})
              </button>
            </div>

            {/* Tab Body */}
            <div className="profile-drawer-body">
              {/* TAB 1: RECEIVED CANDIDATE APPLICATIONS */}
              {profileActiveTab === 'received' && (
                <div className="profile-tab-content">
                  <div className="tab-section-intro">
                    <span className="section-title">Candidate Inquiries</span>
                    <span className="section-hint">Applicants wanting to join your projects</span>
                  </div>

                  {receivedApplications.length === 0 ? (
                    <div className="empty-apps-box">
                      <span className="empty-box-icon">📬</span>
                      <p>No candidate inquiries yet.</p>
                      <p className="subtext">When developers apply to projects you lead, their requests appear here for your review.</p>
                    </div>
                  ) : (
                    <div className="apps-list">
                      {receivedApplications.map((app, idx) => (
                        <div key={app._id || idx} className="app-card-item candidate-card">
                          <div className="app-item-top">
                            <div>
                              <strong>{app.applicantName}</strong>
                              <span className="candidate-email"> ({app.applicantEmail})</span>
                            </div>
                            <span className={`status-tag ${app.status?.toLowerCase() || 'pending'}`}>
                              ● {app.status || 'Pending'}
                            </span>
                          </div>

                          <div className="app-role-line">
                            Applied for: <strong>{app.roleApplied}</strong> on <em>"{app.projectTitle}"</em>
                          </div>

                          <p className="app-pitch-text">"{app.pitch}"</p>

                          <div className="candidate-action-buttons">
                            <button
                              type="button"
                              className="btn btn-accept-sm"
                              disabled={app.status === 'Accepted'}
                              onClick={() => handleUpdateStatus(app._id || app.id, 'Accepted')}
                            >
                              ✓ Accept Candidate
                            </button>
                            <button
                              type="button"
                              className="btn btn-reject-sm"
                              disabled={app.status === 'Rejected'}
                              onClick={() => handleUpdateStatus(app._id || app.id, 'Rejected')}
                            >
                              ✕ Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MY SENT APPLICATIONS */}
              {profileActiveTab === 'sent' && (
                <div className="profile-tab-content">
                  <div className="tab-section-intro">
                    <span className="section-title">My Sent Applications</span>
                    <span className="section-hint">Teams and roles you applied to join</span>
                  </div>

                  {myApplications.length === 0 ? (
                    <div className="empty-apps-box">
                      <span className="empty-box-icon">📤</span>
                      <p>No applications sent yet.</p>
                      <p className="subtext">Browse open projects and click "Apply Now" to join a team!</p>
                    </div>
                  ) : (
                    <div className="apps-list">
                      {myApplications.map((app, idx) => (
                        <div key={app._id || idx} className="app-card-item">
                          <div className="app-item-top">
                            <strong>{app.projectTitle || 'DevCollab Project'}</strong>
                            <div className="app-status-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className={`status-tag ${app.status?.toLowerCase() || 'pending'}`}>
                                ● {app.status || 'Pending'}
                              </span>
                              <button
                                type="button"
                                className="btn btn-delete-sm"
                                title="Withdraw application"
                                onClick={() => handleWithdrawApplication(app._id || idx)}
                              >
                                Withdraw ✕
                              </button>
                            </div>
                          </div>
                          <div className="app-role-line">Role Applied: <span>{app.roleApplied}</span></div>
                          <p className="app-pitch-text">"{app.pitch}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MY POSTED PROJECTS */}
              {profileActiveTab === 'projects' && (
                <div className="profile-tab-content">
                  <div className="tab-section-intro">
                    <span className="section-title">My Posted Projects</span>
                    <span className="section-hint">Project posts published under your name</span>
                  </div>

                  {myOwnProjects.length === 0 ? (
                    <div className="empty-apps-box">
                      <span className="empty-box-icon">📁</span>
                      <p>You haven't posted any projects yet.</p>
                      <p className="subtext">Click "+ Post Project" in the navigation bar to publish your first task!</p>
                    </div>
                  ) : (
                    <div className="apps-list">
                      {myOwnProjects.map((p) => {
                        const projId = p._id || p.id;
                        return (
                          <div key={projId} className="app-card-item">
                            <div className="app-item-top">
                              <strong>{p.title}</strong>
                              <button
                                type="button"
                                className="btn btn-delete-sm"
                                onClick={() => handleDeleteProject(projId, p.title)}
                              >
                                🗑️ Delete Project
                              </button>
                            </div>
                            <div className="app-role-line">Category: <span>{p.category}</span> • Role: <strong>{p.openRole}</strong></div>
                            <p className="app-pitch-text">{p.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Drawer Footer with Logout Action */}
            <div className="profile-drawer-footer">
              <button
                type="button"
                className="btn btn-logout-full"
                onClick={() => {
                  setIsProfileModalOpen(false);
                  handleLogout();
                }}
              >
                <span>🚪</span> Logout from DevCollab
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POST PROJECT MODAL */}
      {isPostModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsPostModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <span className="modal-icon">✨</span>
                <h3>Post New Project Task</h3>
              </div>
              <button className="modal-close" onClick={() => setIsPostModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddProject}>
              <div className="form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Smart Campus Navigation System"
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
                <button type="submit" className="btn btn-emerald-primary">
                  Publish to Marketplace (POST)
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
              <div className="modal-title-wrap">
                <span className="modal-icon">🎯</span>
                <h3>Apply for {selectedProject.title}</h3>
              </div>
              <button className="modal-close" onClick={() => setIsApplyModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={submitApplication}>
              <div className="apply-project-summary">
                <p><strong>Project Lead:</strong> {selectedProject.ownerName}</p>
                <p><strong>Desired Role:</strong> {applyRole}</p>
              </div>

              <div className="form-group">
                <label>Select Desired Role *</label>
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
                  placeholder="Describe your tech stack experience, past projects, and weekly availability..."
                  value={applyPitch}
                  onChange={(e) => setApplyPitch(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsApplyModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-emerald-primary">
                  Submit Application (POST)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clean Modern Footer (Without RV University text) */}
      <footer className="footer">
        <div className="footer-content">
          <p><strong>DevCollab</strong> • Modern Developer Teaming & Open Source Task Marketplace</p>
          <p className="footer-sub">MongoDB Atlas Cloud • Express REST API • React 18 SPA • Node.js Engine</p>
        </div>
      </footer>
    </div>
  );
}
