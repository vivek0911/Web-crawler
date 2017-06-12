const express = require('express');
const router = express.Router();

const linkController = require('./controllers/link.controller');

router.post('/link/new', linkController.createLink);
router.get('/link/:url', linkController.getLinkByUrl);
router.get('/links', linkController.getAllLinks);

module.exports = router;