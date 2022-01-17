import express, { Router } from 'express';

import * as apiController from '../controllers/api.controller';

const router: Router = express.Router();

// Endpoint for sharing private youtube videos to other user emails
router.post('/share', apiController.shareYouTubeVideos);

// Endpoint for unsharing private youtube videos from other user emails
router.post('/unshare', apiController.unshareYouTubeVideos);

export default router;
