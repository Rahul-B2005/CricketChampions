import { Router } from 'express';
import protect from '../middleware/auth.js';
import { run, history, getOne } from '../controllers/simulate.js';
const r = Router();
r.use(protect);
r.post('/', run);
r.get('/history', history);
r.get('/:id', getOne);
export default r;
