import { Router } from 'express';
import protect from '../middleware/auth.js';
import { matchCrud as c, stats } from '../controllers/matches.js';
const r = Router();
r.use(protect);
r.get('/stats', stats);
r.route('/').get(c.list).post(c.create);
r.route('/:id').put(c.update).delete(c.remove);
export default r;
