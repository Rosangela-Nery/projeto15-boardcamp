import express from 'express';
import { categoriesGet, categoriesPost } from '../controllers/categoriesControllers.js';
import { customersGet } from '../controllers/customersControllers.js';
import { gamesGet, gamesPost } from '../controllers/gamesControllers.js';

const router = express.Router();

router.get("/categories", categoriesGet);
router.post("/categories", categoriesPost);

router.get("/games", gamesGet);
router.post("/games", gamesPost);

router.get("/customers/:id", customersGet);

export default router;