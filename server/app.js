import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import auth from './routes/auth.js';
import players from './routes/players.js';
import teams from './routes/teams.js';
import matches from './routes/matches.js';
import simulate from './routes/simulate.js';
import international from './routes/international.js';

const app = express();
app.use(cors({ origin: (o, cb) => cb(null, !o || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(o)) }));
app.use(express.json());
app.get('/api/health', (_, res) => res.json({ ok: true, app: 'rc26-companion' }));
app.use('/api/auth', auth);
app.use('/api/players', players);
app.use('/api/teams', teams);
app.use('/api/matches', matches);
app.use('/api/simulate', simulate);
app.use('/api/international', international);
app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => app.listen(process.env.PORT || 5055, () => console.log('API on port ' + (process.env.PORT || 5055))))
  .catch((e) => { console.error('DB connection failed:', e.message); process.exit(1); });
