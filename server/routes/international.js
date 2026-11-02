import { Router } from 'express';
import protect from '../middleware/auth.js';
import { seedInternational } from '../controllers/international.js';
const r = Router();
r.use(protect);
r.post('/seed', seedInternational);
export default r;
