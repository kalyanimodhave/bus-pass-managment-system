import express from 'express';
import Application from '../models/Application.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadDocuments } from '../middleware/upload.js';
import { routes, isValidJourney } from '../config/routes.js';

const router = express.Router();
router.use(protect);

router.get('/routes', (_req, res) => res.json({ routes }));

router.post('/', uploadDocuments, async (req, res, next) => {
  try {
    const { college, gender, course, startStop, endStop, duration } = req.body;
    const files = req.files || {};
    if (!college || !gender || !course || !startStop || !endStop) return res.status(400).json({ message: 'Please complete all application fields.' });
    if (!files.bonafide?.[0] || !files.idCard?.[0] || !files.photo?.[0]) return res.status(400).json({ message: 'Upload bonafide certificate, ID card and passport photo.' });
    if (!isValidJourney(startStop, endStop)) return res.status(400).json({ message: 'This stop pair is not available on the configured ST routes. Please select a valid route.' });
    const route = routes.find(r => r.stops.includes(startStop) && r.stops.includes(endStop) && r.stops.indexOf(startStop) < r.stops.indexOf(endStop));
    const app = await Application.create({
      student: req.user._id, studentName: req.user.name, college, gender, course, startStop, endStop,
      routeName: route.name, duration: duration || 'Monthly',
      documents: {
        bonafide: `/uploads/${files.bonafide[0].filename}`,
        idCard: `/uploads/${files.idCard[0].filename}`,
        photo: `/uploads/${files.photo[0].filename}`
      }
    });
    res.status(201).json({ message: 'Application submitted successfully.', application: app });
  } catch (error) { next(error); }
});

router.get('/mine', async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) { next(error); }
});

router.get('/track/:id', async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, student: req.user._id };
    const application = await Application.findOne(filter);
    if (!application) return res.status(404).json({ message: 'Application not found.' });
    res.json({ application });
  } catch (error) { next(error); }
});

router.get('/admin/all', adminOnly, async (_req, res, next) => {
  try {
    const applications = await Application.find().populate('student', 'name email phone').sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) { next(error); }
});

router.patch('/admin/:id/review', adminOnly, async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) return res.status(400).json({ message: 'Choose Approved or Rejected.' });
    if (status === 'Rejected' && !rejectionReason?.trim()) return res.status(400).json({ message: 'Please enter a rejection reason.' });
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found.' });
    app.status = status;
    app.rejectionReason = status === 'Rejected' ? rejectionReason.trim() : '';
    app.reviewedBy = req.user._id;
    app.reviewedAt = new Date();
    if (status === 'Approved') {
      app.passNumber = `ST-${Date.now().toString().slice(-8)}`;
      const months = app.duration === 'Yearly' ? 12 : app.duration === 'Quarterly' ? 3 : 1;
      app.validUntil = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);
    } else {
      app.passNumber = '';
      app.validUntil = undefined;
    }
    await app.save();
    res.json({ message: `Application ${status.toLowerCase()}.`, application: app });
  } catch (error) { next(error); }
});

export default router;
