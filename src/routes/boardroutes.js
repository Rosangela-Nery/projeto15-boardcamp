import express from 'express';
import { categoriesGet, categoriesPost } from '../controllers/categoriesControllers.js';
import { customersPost, customersGetId, customersGet, customersPut } from '../controllers/customersControllers.js';
import { gamesGet, gamesPost } from '../controllers/gamesControllers.js';

const router = express.Router();

router.get("/categories", categoriesGet);
router.post("/categories", categoriesPost);

router.get("/games", gamesGet);
router.post("/games", gamesPost);

router.post("/customers", customersPost);
router.get("/customers", customersGet);
router.get("/customers/:id", customersGetId);
router.put("/customers/:id", customersPut);

export default router;