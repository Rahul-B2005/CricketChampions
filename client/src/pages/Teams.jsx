import { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import api, { errMsg } from '../api/axios';

export default function Teams() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [squad, setSquad] = useState([]);
  const [xi, setXI] = useState([]);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');
  const load = () => api.get('/teams').then((r) => setTeams(r.data));
  useEffect(() => { api.get('/players').then((r) => setPlayers(r.data)); load(); }, []);

  const toggleSquad = (id) => {
    if (squad.includes(id)) { setSquad(squad.filter((x) => x !== id)); setXI(xi.filter((x) => x !== id)); }
    else setSquad([...squad, id]);
  };
  const toggleXI = (id) => {
    if (xi.includes(id)) return setXI(xi.filter((x) => x !== id));
    if (xi.length >= 11) return setErr('A playing XI holds 11 players. Remove one first.');
    setErr(''); setXI([...xi, id]); if (!squad.includes(id)) setSquad([...squad, id]);
  };
  const reset = () => { setName(''); setSquad([]); setXI([]); setEditing(null); setErr(''); };
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      const body = { name, players: squad, playingXI: xi };
      await (editing ? api.put(`/teams/${editing}`, body) : api.post('/teams', body));
      reset(); load();
    } catch (x) { setErr(errMsg(x)); }
  };
  const edit = (t) => { setEditing(t._id); setName(t.name); setSquad(t.players.map((p) => p._id)); setXI(t.playingXI.map((p) => p._id)); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const del = async (t) => { if (window.confirm(`Delete ${t.name}?`)) { await api.delete(`/teams/${t._id}`); load(); } };

  return (
    <>
      <h1>Teams</h1>
      <form className="panel" onSubmit={submit}>
        <label>Team name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        {players.length === 0 ? <p className="empty">Add players first, then pick them for a team.</p> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Player</th><th>Role</th><th>Squad</th><th>XI ({xi.length}/11)</th></tr></thead>
            <tbody>{players.map((p) => (
              <tr key={p._id}><td>{p.name}</td><td>{p.role}</td>
                <td><input type="checkbox" checked={squad.includes(p._id)} onChange={() => toggleSquad(p._id)} aria-label={`${p.name} in squad`} /></td>
                <td><input type="checkbox" checked={xi.includes(p._id)} onChange={() => toggleXI(p._id)} aria-label={`${p.name} in XI`} /></td></tr>))}</tbody>
          </table></div>
        )}
        <div className="row-end">
          {err && <span className="error">{err}</span>}
          {editing && <button type="button" className="ghost" onClick={reset}>Cancel</button>}
          <button className="primary">{editing ? 'Save team' : 'Create team'}</button>
        </div>
      </form>
      <div className="cards">
        {teams.map((t) => (
          <div className="panel" key={t._id}>
            <div className="card-head"><h3>{t.name}</h3>
              <span><button className="icon" aria-label="Edit" onClick={() => edit(t)}><FiEdit2 /></button><button className="icon" aria-label="Delete" onClick={() => del(t)}><FiTrash2 /></button></span></div>
            <p className="muted">{t.players.length} in squad · {t.playingXI.length} in XI</p>
            <p>{t.playingXI.map((p) => p.name).join(', ') || 'No XI picked. The simulator will use the first 11 squad players.'}</p>
          </div>))}
      </div>
    </>
  );
}
