import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiArrowLeft, FiRefreshCw, FiTarget, FiZap, FiActivity } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import PlayerAvatar from '../components/PlayerAvatar';
import CrowdCanvas from '../components/CrowdCanvas';
import StadiumBackdrop from '../components/StadiumBackdrop';
import Toss from '../components/Toss';
import AnthemCeremony from '../components/AnthemCeremony';
import AudioBar from '../components/AudioBar';
import { kitFor } from '../game/kits';
import { AudioFX, Speech } from '../game/audio';
import { commentaryLine, LANGS } from '../game/commentary';

const shots = [
  { id:'defend', label:'DEFEND', key:'A', hint:'Dead bat', power:.20, angles:['DEFENCE','SOFT HANDS'] },
  { id:'drive', label:'DRIVE', key:'S', hint:'Front foot', power:.58, angles:['COVER DRIVE','STRAIGHT DRIVE'] },
  { id:'pull', label:'PULL', key:'D', hint:'Short ball', power:.72, angles:['PULL','HOOK'] },
  { id:'loft', label:'LOFT', key:'F', hint:'Risk / six', power:.92, angles:['LOFTED DRIVE','SLOG'] },
];

const deliveries = [
  {line:'OFF',length:'GOOD',speed:138,difficulty:52},
  {line:'MIDDLE',length:'YORKER',speed:146,difficulty:86},
  {line:'LEG',length:'SHORT',speed:134,difficulty:42},
  {line:'OFF',length:'FULL',speed:141,difficulty:57},
  {line:'MIDDLE',length:'GOOD',speed:137,difficulty:50},
  {line:'LEG',length:'FULL',speed:143,difficulty:67},
  {line:'OFF',length:'SHORT',speed:136,difficulty:45},
];

const names=(team,side)=>{
  const p=team?.players||[];
  if(p.length)return p.slice(0,11).map(x=>typeof x==='string'?x:x.name);
  return Array.from({length:11},(_,i)=>`${side} Player ${i+1}`);
};
const oversText=b=>`${Math.floor(b/6)}.${b%6}`;

function Fielders({team, activeField}){
  const spots=[['f1','left'],['f2','right'],['f3','left'],['f4','right'],['f5','left'],['f6','right'],['f7','left'],['f8','right'],['f9','left']];
  const squad=names(team,'Fielder');
  return <>{spots.map(([cls,side],i)=><div key={cls} className={`fielder-slot ${cls} ${activeField && i%3===activeField?'reacting':''}`}><PlayerAvatar team={team} role="fielder" side={side} name={squad[(i+2)%squad.length]}/></div>)}</>;
}

export default function Simulator(){
  const [params]=useSearchParams();
  const live=params.get('live')==='1';
  const [config,setConfig]=useState(null);
  const [phase,setPhase]=useState('setup'); // setup | toss | anthem | playing | complete
  const [batFirst,setBatFirst]=useState(0);
  const [inning,setInning]=useState(0);
  const [score,setScore]=useState([0,0]);
  const [wickets,setWickets]=useState([0,0]);
  const [balls,setBalls]=useState([0,0]);
  const [batter,setBatter]=useState(0);
  const [bowler,setBowler]=useState(0);
  const [delivery,setDelivery]=useState(deliveries[0]);
  const [ballState,setBallState]=useState('idle');
  const [message,setMessage]=useState('Set your field and bowl the first delivery.');
  const [last,setLast]=useState(null);
  const [power,setPower]=useState(78);
  const [difficulty,setDifficulty]=useState('Pro');
  const [selectedLine,setSelectedLine]=useState('MIDDLE');
  const [selectedLength,setSelectedLength]=useState('GOOD');
  const [activeField,setActiveField]=useState(null);
  const [camera,setCamera]=useState('broadcast');
  const [timing,setTiming]=useState(50);
  const [lang,setLang]=useState(()=>{try{return localStorage.getItem('rc26_lang')||'en'}catch{return 'en'}});
  const [voiceOn,setVoiceOn]=useState(true);
  const [crowdOn,setCrowdOn]=useState(true);
  const [feed,setFeed]=useState([]);
  const timerRef=useRef(null);
  const deliveryStarted=useRef(0);
  const crowdRef=useRef({level:.2,flash:0});

  useEffect(()=>{
    if(!live){setPhase('setup');return;}
    try{const raw=sessionStorage.getItem('rc26_live_match');if(raw){setConfig(JSON.parse(raw));setPhase('setup')}}catch{}
    return()=>clearTimeout(timerRef.current);
  },[live]);

  useEffect(()=>{try{localStorage.setItem('rc26_lang',lang)}catch{}},[lang]);
  useEffect(()=>{Speech.enabled=voiceOn;if(!voiceOn)Speech.cancel()},[voiceOn]);
  useEffect(()=>{AudioFX.setCrowd(crowdOn)},[crowdOn]);
  useEffect(()=>()=>{Speech.cancel();AudioFX.stopAll();clearTimeout(timerRef.current)},[]);
  useEffect(()=>{
    if(phase==='toss'||phase==='anthem'){AudioFX.crowdStart();AudioFX.setBase(phase==='anthem'?.12:.3)}
    if(phase==='playing')AudioFX.setBase(.45);
    if(phase==='complete'){AudioFX.cheer('win');crowdRef.current.level=1;crowdRef.current.flash=1}
  },[phase]);

  const rawTeams=useMemo(()=>config?.teams||[{name:'India',flag:'🇮🇳',code:'IND'},{name:'Australia',flag:'🇦🇺',code:'AUS'}],[config]);
  // teams[0] always bats first (decided by the toss), teams[1] chases.
  const teams=useMemo(()=>batFirst===0?rawTeams:[rawTeams[1],rawTeams[0]],[rawTeams,batFirst]);
  const batTeam=teams[inning];
  const bowlTeam=teams[1-inning];
  const batters=useMemo(()=>names(batTeam,'Batter'),[batTeam]);
  const bowlers=useMemo(()=>names(bowlTeam,'Bowler'),[bowlTeam]);
  const target=inning===1?score[0]+1:null;
  const maxBalls=(Number(config?.overs)||20)*6;
  const currentScore=score[inning], currentW=wickets[inning], currentBalls=balls[inning];
  const crowdColors=useMemo(()=>[kitFor(teams[0]).shirt,kitFor(teams[1]).shirt],[teams]);

  // Commentary: always shows a subtitle, and speaks it in the chosen language if a voice exists.
  const say=(event,extra={},queue=false)=>{
    const vars={venue:config?.stadium||'the stadium',fmt:config?.format||'T20',a:rawTeams[0]?.name,c:rawTeams[1]?.name,
      b:batters[batter],w:bowlers[bowler],t:batTeam?.name,o:bowlTeam?.name,...extra};
    const text=commentaryLine(lang,event,vars);
    if(!text)return;
    setFeed(f=>[{id:Date.now()+Math.random(),text,lang},...f].slice(0,5));
    Speech.speak(text,lang,queue);
  };

  const nextDelivery=useCallback(()=>{
    const base=deliveries[Math.floor(Math.random()*deliveries.length)];
    const speed=Math.max(118,Math.min(153,Math.round(base.speed + (power-70)*.18 + (Math.random()-.5)*6)));
    setDelivery({...base,line:selectedLine,length:selectedLength,speed});
    setBallState('idle');
    setTiming(50);
    setMessage(`Ready • ${selectedLine} line • ${selectedLength} length`);
    setActiveField(null);
  },[power,selectedLine,selectedLength]);

  const enterMatch=()=>{
    AudioFX.init();
    setPhase('toss');
    say('welcome');
  };
  const onToss=({batFirst:bf})=>{setBatFirst(bf);setPhase('anthem')};
  const startGame=()=>{
    setPhase('playing');
    setMessage('Bowl the ball. Then time your shot — no autoplay.');
    const first=bowlers[0];
    say('inningsStart',{t:teams[0].name,o:teams[1].name,w:names(teams[1],'Bowler')[0]||first},true);
    timerRef.current=setTimeout(nextDelivery,50);
  };

  const bowl=()=>{
    if(ballState!=='idle'||phase!=='playing')return;
    setCamera('broadcast');
    setBallState('incoming');
    deliveryStarted.current=performance.now();
    setMessage('BALL RELEASED — watch the seam and time your shot!');
    const duration=Math.max(620,1120-(delivery.speed-120)*3.1);
    // If no shot is played the batter is beaten: counts as a dot ball and play moves on.
    timerRef.current=setTimeout(()=>resolveBall(0,{angles:['BEATEN']},'BEATEN! DOT BALL',0,true),duration);
  };

  const playShot=(shot)=>{
    if(ballState!=='incoming')return;
    clearTimeout(timerRef.current);
    const elapsed=performance.now()-deliveryStarted.current;
    const duration=Math.max(620,1120-(delivery.speed-120)*3.1);
    const ratio=elapsed/duration;
    const ideal=delivery.length==='SHORT'&&shot.id==='pull' ? .68 : delivery.length==='FULL'&&shot.id==='drive' ? .73 : .78;
    const delta=Math.abs(ratio-ideal);
    const skill=difficulty==='Rookie'?.13:difficulty==='Legend'?-0.06:0;
    const quality=Math.max(0,1-(delta/(.38+skill)));
    setTiming(Math.round(quality*100));

    let result=0, label='MIS-TIMED';
    const lineFit=(delivery.line==='LEG'&&shot.id==='drive')?.72:1;
    const lengthFit=(delivery.length==='YORKER'&&shot.id==='loft')?.55:1;
    const chance=quality*lineFit*lengthFit;
    const rand=Math.random();
    if(chance<.28){
      if(shot.id==='loft'&&rand<.38) result='W';
      else result=0;
      label=result==='W'?'TOP EDGE / CAUGHT':'DOT BALL';
    }else if(chance<.48){result=1;label='WORKED INTO THE FIELD';}
    else if(chance<.68){result=2;label='PUSHED FOR TWO';}
    else if(chance<.86){result=4;label=shot.id==='pull'?'FOUR! PULLED AWAY':'FOUR! BEAUTIFUL TIMING';}
    else if(shot.id==='loft'&&rand>.25){result=6;label='SIX! OUT OF THE GROUND';}
    else {result=4;label='FOUR!';}
    if(delivery.length==='SHORT'&&shot.id==='defend'&&quality<.55) result=0;
    resolveBall(result,shot,label,quality);
  };

  const resolveBall=(result,shot,label,quality,missed=false)=>{
    setBallState(missed?'missed':result==='W'?'wicket':'hit');
    setCamera(result===6||result===4?'boundary':'broadcast');
    if(result===4||result===6)setActiveField(2);
    else if(result==='W')setActiveField(1);
    else setActiveField(result?0:null);
    const shotName=shot.angles[Math.floor(Math.random()*shot.angles.length)];
    setLast({result,shot:shotName,speed:delivery.speed,line:delivery.line,length:delivery.length,timing:Math.round(quality*100),label});
    setScore(prev=>{const n=[...prev];if(result!=='W')n[inning]+=Number(result);return n});
    setWickets(prev=>{const n=[...prev];if(result==='W')n[inning]++;return n});
    setBalls(prev=>{const n=[...prev];n[inning]++;return n});
    setMessage(result==='W'?'WICKET! A catch in the deep.':label);

    // sound + crowd + commentary
    const cr=crowdRef.current;
    if(!missed)AudioFX.hit(quality);
    if(result==='W'){AudioFX.cheer('wicket');cr.level=.9;cr.flash=.5;say('wicket')}
    else if(result===6){AudioFX.cheer('six');cr.level=1;cr.flash=1;say('six')}
    else if(result===4){AudioFX.cheer('four');cr.level=.85;cr.flash=.6;say('four')}
    else if(missed){AudioFX.groan();say('miss')}
    else if(result===0){AudioFX.groan();say('dot')}
    else if(result===1){cr.level=Math.max(cr.level,.35);say('one')}
    else {cr.level=Math.max(cr.level,.45);say('two')}

    const newScore=result==='W'?currentScore:currentScore+Number(result);
    const newBalls=currentBalls+1;
    const newW=result==='W'?currentW+1:currentW;
    timerRef.current=setTimeout(()=>finishBall(result,newScore,newBalls,newW),1150);
  };

  const finishBall=(result,currentScoreNow,currentBallsNow,wNow)=>{
    const inningsDone=(inning===1&&currentScoreNow>=target)||currentBallsNow>=maxBalls||wNow>=10;
    if(inningsDone){
      if(inning===0){
        const firstScore=currentScoreNow;
        say('inningsEnd',{runs:firstScore,wkts:wNow,target:firstScore+1});
        setInning(1);setBatter(0);setBowler(0);setPhase('playing');
        setMessage(`${teams[0]?.name} finish on ${firstScore}. ${teams[1]?.name} need ${firstScore+1}.`);
        timerRef.current=setTimeout(nextDelivery,900);
      }else{
        const f=score[0];
        if(currentScoreNow>f)say('win',{t:teams[1].name});
        else if(currentScoreNow<f)say('win',{t:teams[0].name});
        else say('tie');
        setPhase('complete');
      }
      return;
    }
    if(currentBallsNow%6===0)say('overEnd',{runs:currentScoreNow,wkts:wNow},true);
    setBatter(b=>result==='W'?Math.min(b+1,10):b);
    setBowler(b=>currentBallsNow%6===0?(b+1)%11:b);
    timerRef.current=setTimeout(nextDelivery,500);
  };

  const reset=()=>{clearTimeout(timerRef.current);Speech.cancel();setPhase('setup');setBatFirst(0);setInning(0);setScore([0,0]);setWickets([0,0]);setBalls([0,0]);setBatter(0);setBowler(0);setLast(null);setBallState('idle');setActiveField(null);setCamera('broadcast');setFeed([]);};

  useEffect(()=>{
    const fn=e=>{
      if(phase!=='playing')return;
      const k=e.key.toLowerCase();
      if(k===' '){e.preventDefault(); if(ballState==='idle')bowl(); return;}
      const shot=shots.find(x=>x.key.toLowerCase()===k);
      if(shot)playShot(shot);
    };
    window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn);
  });

  const audioBar=<AudioBar lang={lang} setLang={setLang} voiceOn={voiceOn} setVoiceOn={setVoiceOn} crowdOn={crowdOn} setCrowdOn={setCrowdOn}/>;

  if(!live)return <div className="game-lobby"><span className="eyebrow">RC26 ARENA</span><h1>Start from International Match.</h1><Link className="primary" to="/international">Open International Match</Link></div>;
  if(!config)return <div className="loading-screen">Loading match…</div>;
  if(phase==='setup')return <div className="game-lobby"><div><span className="eyebrow"><FiTarget/> REAL PLAY MODE</span><h1>Play the match yourself.</h1><p>Toss, national anthems, live crowd and commentary in English, Tamil or Hindi. You control the delivery and the bat timing — no autoplay.</p></div><div className="real-start-card"><div className="coin"><span>{rawTeams[0]?.flag||'🏏'}</span><b>VS</b><span>{rawTeams[1]?.flag||'🏏'}</span></div><h2>{rawTeams[0]?.name} vs {rawTeams[1]?.name}</h2><p>{config.format||'T20'} • {config.overs||20} overs • {config.stadium||'International Stadium'}</p><label>Difficulty<select value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option>Rookie</option><option>Pro</option><option>Legend</option></select></label>{audioBar}<button className="primary" onClick={enterMatch}><FiZap/> Enter stadium</button></div></div>;
  if(phase==='toss')return <div className="ceremony-screen">{audioBar}<Toss teams={rawTeams} overs={Number(config?.overs)||20} say={say} onDone={onToss}/></div>;
  if(phase==='anthem')return <div className="ceremony-screen no-pad"><AnthemCeremony teams={rawTeams} say={say} onDone={startGame}/></div>;

  const result=phase==='complete'?(score[1]>score[0]?`${teams[1]?.name} win`:score[1]===score[0]?'Match tied':`${teams[0]?.name} win`):'';
  const langLabel=LANGS.find(l=>l.id===lang)?.short;
  return <div className={`real-match camera-${camera}`}>
    <header className="real-top"><Link to="/international"><FiArrowLeft/> Exit Match</Link><div><i/> LIVE • {config.stadium||'INTERNATIONAL ARENA'} • {config.format||'T20'}</div><button className="reset-small" onClick={reset}><FiRefreshCw/></button></header>
    {audioBar}
    <section className="real-score"><div><small>{teams[0]?.flag} {teams[0]?.name}</small><b>{score[0]}/{wickets[0]}</b><span>{oversText(balls[0])} ov</span></div><strong>VS</strong><div><small>{teams[1]?.flag} {teams[1]?.name}</small><b>{score[1]}/{wickets[1]}</b><span>{oversText(balls[1])} ov</span></div>{target&&phase!=='complete'&&<em>Target {target}</em>}{result&&<em className="result-banner">{result}</em>}</section>
    <section className="real-viewport">
      <div className="sky"><StadiumBackdrop name={config.stadium||'RC26 INTERNATIONAL ARENA'} teams={teams}/><span className="stadium-name">{config.stadium||'RC26 INTERNATIONAL ARENA'} • {config.format||'T20'}</span><div className="big-screen"><b>RC26</b><span>LIVE INTERNATIONAL CRICKET</span><strong>{teams[0]?.name} vs {teams[1]?.name}</strong><small>{currentScore}/{currentW} • {oversText(currentBalls)} ov</small></div><CrowdCanvas levelRef={crowdRef} colors={crowdColors}/><div className="crowd-lights"/></div>
      <div className="grass"><div className="boundary-rope"/><div className="circle-mark"/><Fielders team={bowlTeam} activeField={activeField}/>
        <div className="pitch-real"><div className="crease-real top"/><div className="crease-real bottom"/><div className="stumps top-stumps"><i/><i/><i/></div><div className="stumps bottom-stumps"><i/><i/><i/></div>
          <div className={`bowler-real ${ballState==='incoming'?'runup':''}`}><PlayerAvatar team={bowlTeam} role="bowler" animated={ballState==='incoming'} action={ballState==='incoming'?'bowling':''} name={bowlers[bowler]}/></div>
          <div className={`batter-real ${ballState==='incoming'?'ready':''} ${ballState==='hit'?'swing':''}`}><PlayerAvatar team={batTeam} role="batter" animated={ballState==='hit'} action={ballState==='hit'?'batting':''} name={batters[batter]}/></div>
          <div className={`ball-real ${ballState}`}><i/></div>
        </div>
        <div className="umpire-real"><PlayerAvatar team={{accent:'#bfc9c3'}} role="umpire" name="Umpire"/></div>
      </div><div className="field-light fl-a"/><div className="field-light fl-b"/>
      {last&&<div className={`floating-call ${last.result==='W'?'danger':''}`}>{last.result==='W'?'WICKET!':last.result===6?'SIX!':last.result===4?'FOUR!':last.result===0?'DOT BALL':`${last.result} RUN`}</div>}
      {feed[0]&&<div className="commentary-bar" key={feed[0].id}><span className="lang-tag">🎙 {langLabel}</span>{feed[0].text}</div>}
    </section>
    <section className="real-panel">
      <div className="match-toolbar"><div className="delivery-info"><span>OVER {Math.floor(currentBalls/6)+1} • BALL {(currentBalls%6)+1}</span><b>{delivery.speed} KM/H</b><small>{delivery.line} • {delivery.length} • TIMING {timing}%</small></div><div className="camera-buttons"><button className={camera==='broadcast'?'active':''} onClick={()=>setCamera('broadcast')}>BROADCAST</button><button className={camera==='boundary'?'active':''} onClick={()=>setCamera('boundary')}>ACTION CAM</button></div></div>
      <div className="bowling-controls"><label>LINE<select value={selectedLine} onChange={e=>setSelectedLine(e.target.value)} disabled={ballState!=='idle'}><option>OFF</option><option>MIDDLE</option><option>LEG</option></select></label><label>LENGTH<select value={selectedLength} onChange={e=>setSelectedLength(e.target.value)} disabled={ballState!=='idle'}><option>FULL</option><option>GOOD</option><option>SHORT</option><option>YORKER</option></select></label><label>PACE <b>{power}</b><input type="range" min="45" max="100" value={power} onChange={e=>setPower(+e.target.value)} disabled={ballState!=='idle'}/></label><button className="bowl-btn" onClick={bowl} disabled={ballState!=='idle'||phase==='complete'}><FiActivity/> BOWL <span>SPACE</span></button></div>
      <div className="batting-controls"><div className="bat-instruction"><small>BAT NOW</small><b>{message}</b><span>Hit when the ball reaches the batter. Timing controls power, placement and wicket risk.</span></div>{shots.map(s=><button key={s.id} className={`shot ${s.id}`} disabled={ballState!=='incoming'} onClick={()=>playShot(s)}><strong>{s.label}</strong><span>{s.key} • {s.hint}</span></button>)}</div>
      <div className="keyboard-tip">⌨ <b>A</b> Defend <b>S</b> Drive <b>D</b> Pull <b>F</b> Loft • <b>SPACE</b> Bowl</div>
      {last&&<div className={`last-result ${last.result==='W'?'wicket':''}`}><b>{last.result==='W'?'WICKET':`${last.result} RUN${last.result===1?'':'S'}`}</b><span>{last.shot} • {last.speed} km/h • {last.line} {last.length} • {last.timing}% timing</span></div>}
      {feed.length>1&&<div className="commentary-feed">{feed.slice(1).map(f=><p key={f.id}>{f.text}</p>)}</div>}
    </section>
  </div>;
}
