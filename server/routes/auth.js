import { Router } from 'express';
import protect from '../middleware/auth.js';
import { register, login, me } from '../controllers/auth.js';
const r = Router();
r.post('/register', register);
r.post('/login', login);
r.get('/me', protect, me);
export default r;
