import { useEffect, useRef, useState } from 'react';

export default function Toss({ teams, overs = 20, say, onDone }) {
  const [stage, setStage] = useState('call'); // call | flipping | choose | decided
  const [outcome, setOutcome] = useState(null);
  const [winner, setWinner] = useState(null);
  const [decision, setDecision] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const user = teams[0], opp = teams[1];

  const announce = (w, d) => {
    setWinner(w); setDecision(d); setStage('decided');
    say(d === 'bat' ? 'tossBat' : 'tossBowl', { t: teams[w].name });
  };
  const flip = (call) => {
    const res = Math.random() < 0.5 ? 'heads' : 'tails';
    setOutcome(res); setStage('flipping'); say('tossFlip');
    timer.current = setTimeout(() => {
      if (res === call) { setWinner(0); setStage('choose'); }
      else announce(1, Math.random() < (overs <= 20 ? 0.7 : 0.5) ? 'bowl' : 'bat');
    }, 2500);
  };

  return (
    <div className="toss-card">
      <span className="eyebrow">THE TOSS</span>
      <h1>{user.flag} {user.name} <em>vs</em> {opp.flag} {opp.name}</h1>
      <div className="coin-stage">
        <div className={`coin3d ${stage !== 'call' && outcome ? `flip-${outcome}` : ''}`}>
          <div className="coin-face front"><b>RC26</b><small>HEADS</small></div>
          <div className="coin-face back"><b>🏆</b><small>TAILS</small></div>
        </div>
      </div>
      {stage === 'call' && <>
        <p>{user.name}, call it while the coin is in the air.</p>
        <div className="toss-actions"><button className="primary" onClick={() => flip('heads')}>Heads</button><button className="primary" onClick={() => flip('tails')}>Tails</button></div>
      </>}
      {stage === 'flipping' && <p>The coin is in the air…</p>}
      {stage === 'choose' && <>
        <p>It's <b>{outcome}</b> — {user.name} won the toss! What will you do?</p>
        <div className="toss-actions"><button className="primary" onClick={() => announce(0, 'bat')}>Bat first</button><button className="primary" onClick={() => announce(0, 'bowl')}>Bowl first</button></div>
      </>}
      {stage === 'decided' && <>
        <p><b>{teams[winner].name}</b> won the toss and chose to {decision} first.</p>
        <button className="primary" onClick={() => onDone({ batFirst: decision === 'bat' ? winner : 1 - winner })}>Continue to national anthems</button>
      </>}
    </div>
  );
}
