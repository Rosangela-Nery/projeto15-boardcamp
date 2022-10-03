import express from 'express';
import { categoriesGet, categoriesPost } from '../controllers/categoriesControllers.js';
import { customersPost, customersGetId, customersGet, customersPut } from '../controllers/customersControllers.js';
import { gamesGet, gamesPost } from '../controllers/gamesControllers.js';
import { rentalsPost, rentalsGet, rentalsPostReturn, rentalsDelete } from '../controllers/rentalsControllers.js';

const router = express.Router();

router.get("/categories", categoriesGet);
router.post("/categories", categoriesPost);

router.get("/games", gamesGet);
router.post("/games", gamesPost);

router.post("/customers", customersPost);
router.get("/customers", customersGet);
router.get("/customers/:id", customersGetId);
router.put("/customers/:id", customersPut);

router.post("/rentals", rentalsPost);
router.get("/rentals", rentalsGet);
router.post("/rentals/:id/return", rentalsPostReturn);
router.delete("/rentals/:id", rentalsDelete);

export default router;