const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Application = require('../models/Application');
const Project = require('../models/Project');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

let memoryApplications = [];

// POST /api/applications - Submit an application
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { projectId, projectTitle, roleApplied, pitch, applicantName, applicantEmail } = req.body;

    if (!projectId || !roleApplied || !pitch) {
      return res.status(400).json({
        success: false,
        error: 'Please provide project ID, role applied for, and application pitch.'
      });
    }

    const name = req.user ? req.user.name : (applicantName || 'Student Applicant');
    const email = req.user ? req.user.email : (applicantEmail || 'student@rvu.edu.in');
    const applicantId = req.user ? req.user.id : null;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(projectId)) {
      // Prevent duplicate applications
      const existing = await Application.findOne({
        project: projectId,
        applicantEmail: email.toLowerCase()
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'You have already submitted an application for this project.'
        });
      }

      const application = await Application.create({
        project: projectId,
        projectTitle: projectTitle || 'DevCollab Project',
        applicant: applicantId,
        applicantName: name,
        applicantEmail: email.toLowerCase(),
        roleApplied: roleApplied.trim(),
        pitch: pitch.trim(),
        status: 'Pending'
      });

      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        application
      });
    } else {
      const exists = memoryApplications.find(
        a => String(a.project) === String(projectId) && a.applicantEmail.toLowerCase() === email.toLowerCase()
      );
      if (exists) {
        return res.status(400).json({
          success: false,
          error: 'You have already submitted an application for this project.'
        });
      }

      const newApp = {
        _id: 'app_' + Date.now(),
        project: projectId,
        projectTitle: projectTitle || 'DevCollab Project',
        applicantName: name,
        applicantEmail: email.toLowerCase(),
        roleApplied: roleApplied.trim(),
        pitch: pitch.trim(),
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      memoryApplications.push(newApp);

      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully (in-memory mode)',
        application: newApp
      });
    }
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// GET /api/applications/received - View applications received for user's posted projects
router.get('/received', optionalAuth, async (req, res) => {
  try {
    const ownerName = req.user ? req.user.name : req.query.ownerName;

    if (!ownerName) {
      return res.status(200).json({ success: true, count: 0, applications: [] });
    }

    if (mongoose.connection.readyState === 1) {
      // Find projects owned by this user
      const userProjects = await Project.find({ ownerName: { $regex: new RegExp(`^${ownerName}$`, 'i') } });
      const projectIds = userProjects.map(p => p._id);

      const applications = await Application.find({ project: { $in: projectIds } }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: applications.length, applications });
    } else {
      const ProjectModel = require('../models/Project');
      const userProjects = await Project.find({ ownerName: { $regex: new RegExp(`^${ownerName}$`, 'i') } }).catch(() => []);
      const projectIds = userProjects.map(p => String(p._id));
      const received = memoryApplications.filter(a => projectIds.includes(String(a.project)));
      return res.status(200).json({ success: true, count: received.length, applications: received });
    }
  } catch (error) {
    console.error('Fetch received applications error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// GET /api/applications/my - View applications submitted by user
router.get('/my', optionalAuth, async (req, res) => {
  try {
    const userEmail = req.user ? req.user.email : req.query.email;

    if (!userEmail) {
      return res.status(200).json({ success: true, count: 0, applications: [] });
    }

    if (mongoose.connection.readyState === 1) {
      const applications = await Application.find({ applicantEmail: userEmail.toLowerCase() }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: applications.length, applications });
    } else {
      const userApps = memoryApplications.filter(a => a.applicantEmail.toLowerCase() === userEmail.toLowerCase());
      return res.status(200).json({ success: true, count: userApps.length, applications: userApps });
    }
  } catch (error) {
    console.error('Fetch my applications error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// GET /api/applications/project/:projectId - View applications for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(projectId)) {
      const applications = await Application.find({ project: projectId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: applications.length, applications });
    } else {
      const apps = memoryApplications.filter(a => a.project === projectId);
      return res.status(200).json({ success: true, count: apps.length, applications: apps });
    }
  } catch (error) {
    console.error('Fetch project applications error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// PATCH /api/applications/:id/status - Update application status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const app = await Application.findByIdAndUpdate(id, { status }, { new: true });
      if (!app) return res.status(404).json({ success: false, error: 'Application not found' });
      return res.status(200).json({ success: true, application: app });
    } else {
      const app = memoryApplications.find(a => a._id === id);
      if (!app) return res.status(404).json({ success: false, error: 'Application not found' });
      app.status = status;
      return res.status(200).json({ success: true, application: app });
    }
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// DELETE /api/applications/:id - Withdraw application
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      await Application.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Application withdrawn successfully' });
    } else {
      memoryApplications = memoryApplications.filter(a => String(a._id) !== String(id));
      return res.status(200).json({ success: true, message: 'Application withdrawn successfully' });
    }
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
