import { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import api, { errMsg } from '../api/axios';

const blank = { opponent: '', myRuns: '', myWkts: 0, oppRuns: '', oppWkts: 0, overs: 20, venue: '', date: new Date().toISOString().slice(0, 10) };
export default function Matches() {
  const [list, setList] = useState([]);
  const [f, setF] = useState(blank);
  const [err, setErr] = useState('');
  const load = () => api.get('/matches').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.post('/matches', f); setF(blank); load(); } catch (x) { setErr(errMsg(x)); }
  };
  const del = async (m) => { if (window.confirm('Delete this match?')) { await api.delete(`/matches/${m._id}`); load(); } };
  const n = (k, label, extra = {}) => <label>{label}<input type="number" min="0" value={f[k]} onChange={set(k)} {...extra} /></label>;
  return (
    <>
      <h1>Matches</h1>
      <form className="panel grid-form" onSubmit={submit}>
        <label>Opponent<input value={f.opponent} onChange={set('opponent')} required /></label>
        {n('myRuns', 'Your runs', { required: true })}{n('myWkts', 'Your wickets lost', { max: 10 })}
        {n('oppRuns', 'Opponent runs', { required: true })}{n('oppWkts', 'Opponent wickets lost', { max: 10 })}
        {n('overs', 'Overs', { min: 1 })}
        <label>Venue<input value={f.venue} onChange={set('venue')} /></label>
        <label>Date<input type="date" value={f.date} onChange={set('date')} /></label>
        <div className="row-end">{err && <span className="error">{err}</span>}<button className="primary">Log match</button></div>
      </form>
      {list.length === 0 ? <p className="empty">No matches logged. Log a result to start your win and run trends.</p> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Date</th><th>Opponent</th><th>You</th><th>Them</th><th>Overs</th><th>Result</th><th /></tr></thead>
          <tbody>{list.map((m) => (
            <tr key={m._id}><td>{new Date(m.date).toLocaleDateString()}</td>
              <td><b>{m.opponent}</b><small>{m.venue}</small></td>
              <td>{m.myRuns}/{m.myWkts}</td><td>{m.oppRuns}/{m.oppWkts}</td><td>{m.overs}</td>
              <td><span className={`res ${m.result}`}>{m.result}</span></td>
              <td className="actions"><button className="icon" aria-label="Delete" onClick={() => del(m)}><FiTrash2 /></button></td></tr>))}</tbody>
        </table></div>
      )}
    </>
  );
}
