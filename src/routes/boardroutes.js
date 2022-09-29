import express from 'express';
import { categoriesGet } from '../controllers/categoriesControllers.js';

const router = express.Router();

router.get("/categories", categoriesGet);

export default router;