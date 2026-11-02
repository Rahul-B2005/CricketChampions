import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiPlay, FiZap, FiMapPin, FiChevronRight, FiRefreshCw, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api/axios';

const stadiums = [
  ['Wankhede Stadium','Mumbai','🇮🇳','flat'],
  ['MCG','Melbourne','🇦🇺','green'],
  ['Lord’s','London','🏴','green'],
  ['Gaddafi Stadium','Lahore','🇵🇰','flat'],
  ['Newlands','Cape Town','🇿🇦','dusty'],
  ['Eden Gardens','Kolkata','🇮🇳','flat'],
];

const formats = [
  { id:'T20', label:'T20', overs:20, desc:'Fast • 20 overs' },
  { id:'ODI', label:'ODI', overs:50, desc:'One Day • 50 overs' },
  { id:'Test', label:'TEST', overs:90, desc:'Red Ball • 90 overs/day' },
];

export default function International(){
  const [teams,setTeams]=useState([]),[a,setA]=useState(''),[b,setB]=useState('');
  const [format,setFormat]=useState('T20'),[overs,setOvers]=useState(20);
  const [stadium,setStadium]=useState(stadiums[0]),[mode,setMode]=useState('Pro');
  const [loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[err,setErr]=useState('');
  const nav=useNavigate();

  const load=useCallback(async(nextFormat='T20')=>{
    setLoading(true);
    setErr('');
    try{
      const {data}=await api.post('/international/seed',{format:nextFormat});
      setTeams(data);
      if(data[0])setA(data[0]._id);
      if(data[1])setB(data[1]._id);
    }catch(e){setErr(errMsg(e));}
    finally{setLoading(false);}
  },[]);

  useEffect(()=>{load(format);},[format,load]);

  const teamA=useMemo(()=>teams.find(t=>t._id===a),[teams,a]);
  const teamB=useMemo(()=>teams.find(t=>t._id===b),[teams,b]);

  const start=async()=>{
    setErr('');
    if(!a||!b||a===b){setErr('Choose two different nations.');return;}
    setBusy(true);
    try{
      sessionStorage.setItem('rc26_live_match',JSON.stringify({
        teams:[teamA,teamB],format,overs,stadium:stadium[0],city:stadium[1],mode
      }));
      nav('/simulator?live=1');
    }catch(e){setErr(errMsg(e));}
    finally{setBusy(false);}
  };

  if(loading)return <div className="loading-screen"><div className="spinner"/>Loading international squads…</div>;

  return <div className="arena-page international-page">
    <section className="arena-hero international-hero">
      <div className="hero-copy">
        <span className="eyebrow"><FiZap/> INTERNATIONAL MATCH CENTER</span>
        <h1>Play the <span>world game.</span></h1>
        <p>Pick two nations, choose the stadium and step into a broadcast-style cricket match where every delivery is under your control.</p>
        <div className="hero-actions">
          <button className="primary hero-btn" onClick={start} disabled={busy}>
            <FiPlay/> {busy?'Preparing match…':'Start Match'} <FiChevronRight/>
          </button>
          <button className="ghost hero-refresh" onClick={()=>load(format)} disabled={loading}>
            <FiRefreshCw/> Refresh squads
          </button>
        </div>
        <div className="international-meta">
          <span><FiShield/> 11v11 PLAYING XI</span>
          <span><FiMapPin/> {stadium[0]} • {stadium[1]}</span>
          <span>● MANUAL PLAY</span>
        </div>
      </div>

      <div className="stadium-art stadium-art-large" aria-label="RC26 stadium preview">
        <div className="stadium-ring ring-back"/>
        <div className="stadium-stands-mini"/>
        <div className="lights l1"/><div className="lights l2"/><div className="lights l3"/>
        <div className="crowd"/>
        <div className="field">
          <div className="field-boundary"/>
          <div className="pitch-strip">
            <i className="pitch-crease top"/><i className="pitch-crease bottom"/>
            <i className="mini-stumps top"/><i className="mini-stumps bottom"/>
          </div>
        </div>
        <div className="score-ribbon">RC26 • LIVE ARENA</div>
      </div>
    </section>

    <section className="match-builder">
      <div className="section-title">
        <div><span className="eyebrow">MATCH BUILDER</span><h2>International fixture</h2></div>
        <span className="live-pill">● READY TO PLAY</span>
      </div>

      <div className="versus-grid">
        <TeamCard team={teamA} label="HOME / BAT FIRST" teams={teams} value={a} setValue={setA}/>
        <div className="vs-badge">VS</div>
        <TeamCard team={teamB} label="AWAY / CHASE" teams={teams} value={b} setValue={setB}/>
      </div>

      <div className="format-picker">
        <span className="eyebrow">MATCH FORMAT</span>
        <div className="format-tabs">
          {formats.map(f=><button key={f.id} className={format===f.id?'active':''} onClick={()=>{setFormat(f.id);setOvers(f.overs);}}>
            <b>{f.label}</b><small>{f.desc}</small>
          </button>)}
        </div>
      </div>

      <div className="settings-grid">
        <label>Overs / Day<select value={overs} onChange={e=>setOvers(Number(e.target.value))} disabled><option>{overs}</option></select></label>
        <label>Stadium<select value={stadium[0]} onChange={e=>setStadium(stadiums.find(s=>s[0]===e.target.value))}>{stadiums.map(s=><option key={s[0]}>{s[0]}</option>)}</select></label>
        <label>Difficulty<select value={mode} onChange={e=>setMode(e.target.value)}><option>Rookie</option><option>Pro</option><option>Legend</option></select></label>
      </div>
      {err&&<div className="game-error">{err}</div>}
    </section>

    <section className="feature-row">
      <div><b>10+</b><span>International nations</span></div>
      <div><b>6</b><span>Broadcast stadiums</span></div>
      <div><b>3</b><span>Match formats</span></div>
      <div><b>11v11</b><span>Manual playing XI</span></div>
    </section>
  </div>;
}

function TeamCard({team,label,teams,value,setValue}){
  const squad=team?.formatSquad||team?.players||[];
  return <div className="team-select-card" style={{'--accent':team?.accent||'#22c55e'}}>
    <span className="card-label">{label} • {team?.format||'T20'} SQUAD</span>
    <div className="team-emblem">{team?.flag||'🏏'}</div>
    <h3>{team?.name||'Select nation'}</h3>
    <small>{squad.length||0} players • {team?.format||'T20'} squad • Playing XI ready</small>
    {squad.length>0&&<div className="squad-preview">{squad.slice(0,11).map((p,i)=><span key={p._id||i}>{i+1}. {typeof p==='string'?p:p.name}</span>)}</div>}
    <select value={value} onChange={e=>setValue(e.target.value)}>{teams.map(t=><option key={t._id} value={t._id}>{t.flag} {t.name}</option>)}</select>
  </div>;
}
