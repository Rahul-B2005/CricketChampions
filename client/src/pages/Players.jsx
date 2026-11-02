import { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import api, { errMsg } from '../api/axios';

const blank = { name: '', role: 'Batter', tier: 'Silver', battingRating: 50, bowlingRating: 50, fieldingRating: 50, battingStyle: 'Right-hand bat', bowlingStyle: '' };
export default function Players() {
  const [list, setList] = useState([]);
  const [f, setF] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');
  const load = () => api.get('/players').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      await (editing ? api.put(`/players/${editing}`, f) : api.post('/players', f));
      setF(blank); setEditing(null); load();
    } catch (x) { setErr(errMsg(x)); }
  };
  const edit = (p) => { setEditing(p._id); setF({ ...blank, ...p }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const del = async (p) => { if (window.confirm(`Delete ${p.name}?`)) { await api.delete(`/players/${p._id}`); load(); } };
  const num = (k, label) => <label>{label}<input type="number" min="1" max="99" value={f[k]} onChange={set(k)} /></label>;
  return (
    <>
      <h1>Players</h1>
      <form className="panel grid-form" onSubmit={submit}>
        <label>Name<input value={f.name} onChange={set('name')} required /></label>
        <label>Role<select value={f.role} onChange={set('role')}>{['Batter', 'Bowler', 'All-rounder', 'Wicketkeeper'].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label>Tier<select value={f.tier} onChange={set('tier')}>{['Bronze', 'Silver', 'Gold', 'Platinum'].map((x) => <option key={x}>{x}</option>)}</select></label>
        {num('battingRating', 'Batting')}{num('bowlingRating', 'Bowling')}{num('fieldingRating', 'Fielding')}
        <label>Batting style<input value={f.battingStyle} onChange={set('battingStyle')} /></label>
        <label>Bowling style<input value={f.bowlingStyle} onChange={set('bowlingStyle')} placeholder="e.g. Right-arm fast" /></label>
        <div className="row-end">
          {err && <span className="error">{err}</span>}
          {editing && <button type="button" className="ghost" onClick={() => { setEditing(null); setF(blank); }}>Cancel</button>}
          <button className="primary">{editing ? 'Save changes' : 'Add player'}</button>
        </div>
      </form>
      {list.length === 0 ? <p className="empty">No players yet. Add your first player above to start building a squad.</p> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Name</th><th>Role</th><th>Tier</th><th>Bat</th><th>Bowl</th><th>Field</th><th /></tr></thead>
          <tbody>{list.map((p) => (
            <tr key={p._id}>
              <td><b>{p.name}</b><small>{p.battingStyle}{p.bowlingStyle && ` · ${p.bowlingStyle}`}</small></td>
              <td>{p.role}</td><td><span className={`tier ${p.tier}`}>{p.tier}</span></td>
              <td>{p.battingRating}</td><td>{p.bowlingRating}</td><td>{p.fieldingRating}</td>
              <td className="actions"><button className="icon" aria-label="Edit" onClick={() => edit(p)}><FiEdit2 /></button><button className="icon" aria-label="Delete" onClick={() => del(p)}><FiTrash2 /></button></td>
            </tr>))}</tbody>
        </table></div>
      )}
    </>
  );
}
