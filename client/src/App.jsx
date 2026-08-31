import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ProjectExplorer from './components/ProjectExplorer.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Features from './components/Features.jsx';
import ApplyModal from './components/ApplyModal.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [activeApplyProject, setActiveApplyProject] = useState(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        onExploreClick={() => scrollToSection('projects')}
        onPostProjectClick={() => alert("Project Posting Form will open in Phase 2 (State-Managed Component).")}
      />
      
      <main style={{ flex: 1 }}>
        <Hero 
          onExploreClick={() => scrollToSection('projects')}
          onPostClick={() => scrollToSection('projects')}
        />
        
        <ProjectExplorer 
          onApplyClick={(proj) => setActiveApplyProject(proj)}
        />
        
        <HowItWorks />
        
        <Features />
      </main>

      <Footer />

      {activeApplyProject && (
        <ApplyModal 
          project={activeApplyProject}
          onClose={() => setActiveApplyProject(null)}
        />
      )}
    </div>
  );
}
