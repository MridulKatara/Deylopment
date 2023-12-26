const express = require('express');
const authenticateJWT = require('../middleware/auth');
const Notice = require('../models/Notice');

const router = express.Router();

// Create a notice
router.post('/notices', authenticateJWT, async (req, res) => {
  try {
    const { title, body, category } = req.body;
    const notice = new Notice({ title, body, category, user: req.user.id });
    await notice.save();
    res.status(201).send('Notice created successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Read all notices (with optional category filter)
router.get('/notices', authenticateJWT, async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const notices = await Notice.find({ ...filter, user: req.user.id });
    res.json(notices);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a notice
router.put('/notices/:id', authenticateJWT, async (req, res) => {
  try {
    const { title, body, category } = req.body;
    const notice = await Notice.findOne({ _id: req.params.id, user: req.user.id });
    if (!notice) return res.status(404).send('Notice not found');
    notice.title = title;
    notice.body = body;
    notice.category = category;
    await notice.save();
    res.send('Notice updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a notice
router.delete('/notices/:id', authenticateJWT, async (req, res) => {
  try {
    const notice = await Notice.findOne({ _id: req.params.id, user: req.user.id });
    if (!notice) return res.status(404).send('Notice not found');
    await notice.remove();
    res.send('Notice deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
