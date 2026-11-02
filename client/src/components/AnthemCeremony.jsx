import { useEffect, useRef, useState } from 'react';
import PlayerAvatar from './PlayerAvatar';
import CrowdCanvas from './CrowdCanvas';
import { kitFor } from '../game/kits';
import { AudioFX } from '../game/audio';

const SECONDS = 14;
const squad = (t) => (t?.players?.length ? t.players.slice(0, 11).map((p) => (typeof p === 'string' ? p : p.name)) : Array.from({ length: 11 }, (_, i) => `Player ${i + 1}`));

export default function AnthemCeremony({ teams, say, onDone }) {
  const [idx, setIdx] = useState(0);
  const [src, setSrc] = useState('synth');
  const [pct, setPct] = useState(0);
  const level = useRef({ level: 0.12, flash: 0 });
  const doneRef = useRef(false);
  const team = teams[idx];

  const finish = () => { if (doneRef.current) return; doneRef.current = true; AudioFX.cheer('four'); onDone(); };

  useEffect(() => { say('anthem'); }, []); // eslint-disable-line

  useEffect(() => {
    let cancelled = false, raf, timer, stop = () => {};
    const next = () => { if (cancelled) return; idx === 0 ? setIdx(1) : finish(); };
    (async () => {
      const audio = await AudioFX.loadAnthem(team.code);
      if (cancelled) return;
      const started = performance.now();
      let usedFile = false;
      if (audio) {
        try { await audio.play(); usedFile = true; } catch { usedFile = false; }
      }
      if (cancelled) { audio?.pause(); return; }
      if (usedFile) {
        setSrc('file'); audio.onended = next; stop = () => audio.pause();
        const tick = () => { setPct(audio.duration ? audio.currentTime / audio.duration : 0); raf = requestAnimationFrame(tick); };
        tick();
      } else {
        setSrc('synth'); stop = AudioFX.ceremony(SECONDS); timer = setTimeout(next, SECONDS * 1000 + 400);
        const tick = () => { setPct(Math.min(1, (performance.now() - started) / (SECONDS * 1000))); raf = requestAnimationFrame(tick); };
        tick();
      }
    })();
    return () => { cancelled = true; clearTimeout(timer); cancelAnimationFrame(raf); stop(); };
  }, [idx]); // eslint-disable-line

  const kit = kitFor(team);
  return (
    <div className="anthem-stage" style={{ '--kit': kit.shirt }}>
      <CrowdCanvas levelRef={level} colors={[kitFor(teams[0]).shirt, kitFor(teams[1]).shirt]} />
      <div className="anthem-banner">
        <span className="eyebrow">NATIONAL ANTHEM • {idx + 1} / 2</span>
        <h1>{team.flag} {team.name}</h1>
        <div className="anthem-progress"><i style={{ width: `${pct * 100}%` }} /></div>
        <small>{src === 'synth'
          ? `Ceremonial fanfare playing. To hear the real anthem, add client/public/audio/anthems/${team.code}.mp3 (audio you have rights to use).`
          : 'Playing anthem audio.'}</small>
      </div>
      <div className="anthem-line" key={team.code}>
        {squad(team).map((n, i) => <PlayerAvatar key={n + i} team={team} role="fielder" pose="anthem" name={n} />)}
      </div>
      <button className="ghost anthem-skip" onClick={finish}>Skip ceremony</button>
    </div>
  );
}
