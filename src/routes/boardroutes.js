import express from 'express';
import { categoriesGet, categoriesPost } from '../controllers/categoriesControllers.js';
import { customersGet } from '../controllers/customersControllers.js';

const router = express.Router();

router.get("/categories", categoriesGet);
router.post("/categories", categoriesPost);

router.get("/customers/:id", customersGet);

export default router;