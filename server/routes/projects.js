const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Project = require('../models/Project');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

// In-memory initial project records as fallback
let memoryProjects = [
  {
    _id: 'proj_1',
    title: 'AI Resume Matcher',
    category: 'Full Stack',
    description: 'Web application to match student resumes with live tech job descriptions using NLP and vector embeddings.',
    skillsRequired: ['React', 'Node.js', 'MongoDB', 'Python'],
    openRole: 'Frontend Developer',
    ownerName: 'Abhimanyu Kotari',
    status: 'Open',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'proj_2',
    title: 'Campus Event Booking System',
    category: 'Web Development',
    description: 'Portal for university clubs to book auditorium halls and manage student registrations with calendar scheduling.',
    skillsRequired: ['React', 'Express.js', 'CSS', 'PostgreSQL'],
    openRole: 'Backend Developer',
    ownerName: 'Dhanush V',
    status: 'Open',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'proj_3',
    title: 'Student Expense Tracker',
    category: 'MERN Stack',
    description: 'A clean budget management app for college roommates to split hostel groceries, utilities, and daily expenses.',
    skillsRequired: ['JavaScript', 'React', 'Node.js', 'Chart.js'],
    openRole: 'UI/UX Designer',
    ownerName: 'Aniketh',
    status: 'Open',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'proj_4',
    title: 'Autonomous Drone Navigation Simulator',
    category: 'AI / ML',
    description: 'Simulation environment for testing computer vision obstacle avoidance algorithms on micro quadcopters.',
    skillsRequired: ['Python', 'OpenCV', 'PyTorch', 'ROS'],
    openRole: 'Computer Vision Engineer',
    ownerName: 'Abhimanyu Kotari',
    status: 'Open',
    createdAt: new Date().toISOString()
  }
];

// GET /api/projects - List all projects with search & category filters
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};

      if (category && category !== 'All') {
        query.category = category;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { skillsRequired: { $regex: search, $options: 'i' } }
        ];
      }

      // If database collection is fresh and empty, auto-seed default projects
      const totalCount = await Project.countDocuments();
      if (totalCount === 0) {
        await Project.insertMany([
          {
            title: 'AI Resume Matcher',
            category: 'Full Stack',
            description: 'Web application to match student resumes with live tech job descriptions using NLP and vector embeddings.',
            skillsRequired: ['React', 'Node.js', 'MongoDB', 'Python'],
            openRole: 'Frontend Developer',
            ownerName: 'Abhimanyu Kotari',
            status: 'Open'
          },
          {
            title: 'Campus Event Booking System',
            category: 'Web Development',
            description: 'Portal for university clubs to book auditorium halls and manage student registrations with calendar scheduling.',
            skillsRequired: ['React', 'Express.js', 'CSS', 'PostgreSQL'],
            openRole: 'Backend Developer',
            ownerName: 'Dhanush V',
            status: 'Open'
          },
          {
            title: 'Student Expense Tracker',
            category: 'MERN Stack',
            description: 'A clean budget management app for college roommates to split hostel groceries, utilities, and daily room expenses.',
            skillsRequired: ['JavaScript', 'React', 'Node.js', 'Chart.js'],
            openRole: 'UI/UX Designer',
            ownerName: 'Aniketh',
            status: 'Open'
          },
          {
            title: 'Autonomous Drone Navigation Simulator',
            category: 'AI / ML',
            description: 'Simulation environment for testing micro-quadcopter vision algorithms and path planning in 3D space.',
            skillsRequired: ['Python', 'OpenCV', 'PyTorch', 'ROS'],
            openRole: 'Computer Vision Engineer',
            ownerName: 'Abhimanyu Kotari',
            status: 'Open'
          }
        ]);
      }

      const projects = await Project.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: projects.length,
        projects
      });
    } else {
      // In-memory fallback
      let filtered = [...memoryProjects];

      if (category && category !== 'All') {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      if (search) {
        const lower = search.toLowerCase();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(lower) ||
          p.description.toLowerCase().includes(lower) ||
          (p.skillsRequired && p.skillsRequired.some(s => s.toLowerCase().includes(lower)))
        );
      }

      return res.status(200).json({
        success: true,
        count: filtered.length,
        projects: filtered
      });
    }
  } catch (error) {
    console.error('Fetch projects error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// GET /api/projects/:id - Retrieve single project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const project = await Project.findById(id).populate('owner', 'name email role');
      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }
      return res.status(200).json({ success: true, project });
    } else {
      const project = memoryProjects.find(p => p._id === id);
      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }
      return res.status(200).json({ success: true, project });
    }
  } catch (error) {
    console.error('Fetch project detail error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// POST /api/projects - Create new project
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { title, description, category, openRole, skillsRequired } = req.body;

    // Validation
    if (!title || !description || !openRole) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, description, and open role.'
      });
    }

    const ownerName = req.user ? req.user.name : (req.body.ownerName || 'Student Developer');
    const ownerId = req.user ? req.user.id : null;

    const parsedSkills = Array.isArray(skillsRequired)
      ? skillsRequired
      : (typeof skillsRequired === 'string' ? skillsRequired.split(',').map(s => s.trim()) : []);

    if (mongoose.connection.readyState === 1) {
      const newProject = await Project.create({
        title: title.trim(),
        description: description.trim(),
        category: category || 'Full Stack',
        openRole: openRole.trim(),
        skillsRequired: parsedSkills,
        owner: ownerId,
        ownerName,
        status: 'Open'
      });

      return res.status(201).json({
        success: true,
        message: 'Project posted successfully',
        project: newProject
      });
    } else {
      const newProject = {
        _id: 'proj_' + Date.now(),
        title: title.trim(),
        description: description.trim(),
        category: category || 'Full Stack',
        openRole: openRole.trim(),
        skillsRequired: parsedSkills,
        ownerName,
        status: 'Open',
        createdAt: new Date().toISOString()
      };
      memoryProjects.unshift(newProject);

      return res.status(201).json({
        success: true,
        message: 'Project posted successfully (in-memory mode)',
        project: newProject
      });
    }
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// PUT /api/projects/:id - Update existing project
router.put('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, openRole, skillsRequired, status } = req.body;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }

      if (title) project.title = title.trim();
      if (description) project.description = description.trim();
      if (category) project.category = category;
      if (openRole) project.openRole = openRole.trim();
      if (status) project.status = status;
      if (skillsRequired) {
        project.skillsRequired = Array.isArray(skillsRequired)
          ? skillsRequired
          : skillsRequired.split(',').map(s => s.trim());
      }

      await project.save();
      return res.status(200).json({ success: true, message: 'Project updated successfully', project });
    } else {
      const idx = memoryProjects.findIndex(p => p._id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }

      memoryProjects[idx] = {
        ...memoryProjects[idx],
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(category && { category }),
        ...(openRole && { openRole: openRole.trim() }),
        ...(status && { status }),
        ...(skillsRequired && {
          skillsRequired: Array.isArray(skillsRequired)
            ? skillsRequired
            : skillsRequired.split(',').map(s => s.trim())
        })
      };

      return res.status(200).json({
        success: true,
        message: 'Project updated successfully (in-memory mode)',
        project: memoryProjects[idx]
      });
    }
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const project = await Project.findByIdAndDelete(id);
      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }
      return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } else {
      const prevLength = memoryProjects.length;
      memoryProjects = memoryProjects.filter(p => p._id !== id);
      if (memoryProjects.length === prevLength) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }
      return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    }
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
