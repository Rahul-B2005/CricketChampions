import { kitFor, hashStr, SKINS, HAIR, shade } from '../game/kits';

// Stylised human avatar: team kit, jersey number, helmet/pads/gloves for batters,
// caps for fielders, umpire coat & hat. Face/skin/beard vary per player name.
// (Illustrated avatars — no real photos or likenesses.)
export default function PlayerAvatar({ team, role = 'fielder', side = 'right', animated = false, action = '', name = '', pose = '' }) {
  const kit = kitFor(team);
  const h = hashStr(name || role + side);
  const skin = SKINS[h % SKINS.length];
  const hair = HAIR[(h >> 2) % HAIR.length];
  const beard = ((h >> 4) % 3) === 0 && role !== 'umpire';
  const num = (h % 98) + 1;
  const isBat = role === 'batter', isBowl = role === 'bowler', isUmp = role === 'umpire';
  const shirt = isUmp ? '#f4f5f2' : kit.shirt;
  const trim = isUmp ? '#222a26' : kit.trim;
  const pants = isUmp ? '#2d3330' : kit.pants;
  const gid = `kit-${role}-${side}-${(name || 'x').replace(/\W/g, '')}-${shirt.replace('#', '')}`;

  const leftArm = isBat ? 'M31 50 L50 68' : pose === 'anthem' ? 'M31 50 L27 80' : 'M31 50 L17 68';
  const rightArm = isBat ? 'M59 50 L60 68' : pose === 'anthem' ? 'M59 50 L47 62' : 'M59 50 L73 68';

  return (
    <div className={`avatar-player ${role} ${side} ${animated ? 'is-animated' : ''} ${action}`} title={name}>
      <div className="player-shadow" />
      <svg viewBox="0 0 90 150" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" x2="1">
            <stop offset="0" stopColor={shirt} />
            <stop offset="1" stopColor={shade(shirt, 0.4)} />
          </linearGradient>
        </defs>

        {/* legs, pads, shoes */}
        <path d="M35 86 L32 130" stroke={pants} strokeWidth="11" strokeLinecap="round" />
        <path d="M55 86 L58 130" stroke={pants} strokeWidth="11" strokeLinecap="round" />
        {isBat && <>
          <rect x="24" y="97" width="15" height="35" rx="6" fill="#f6f6f1" stroke="#b5b9b0" />
          <rect x="51" y="97" width="15" height="35" rx="6" fill="#f6f6f1" stroke="#b5b9b0" />
          <path d="M26 108 H37 M26 118 H37 M53 108 H64 M53 118 H64" stroke="#c9cdc3" strokeWidth="1.5" />
        </>}
        <ellipse cx="31" cy="139" rx="10" ry="5" fill="#f3f3ee" stroke="#9aa09a" strokeWidth=".8" />
        <ellipse cx="59" cy="139" rx="10" ry="5" fill="#f3f3ee" stroke="#9aa09a" strokeWidth=".8" />

        {/* torso */}
        <path d="M28 44 Q45 36 62 44 L66 92 Q45 100 24 92 Z" fill={`url(#${gid})`} stroke={trim} strokeWidth="1.2" />
        <path d="M38 41 Q45 51 52 41" stroke={trim} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M27 50 L24 91" stroke={trim} strokeWidth="2.4" opacity=".85" />
        <path d="M63 50 L66 91" stroke={trim} strokeWidth="2.4" opacity=".85" />
        {!isUmp && <text x="45" y="76" textAnchor="middle" fontSize="16" fontWeight="800" fill={trim} fontFamily="Barlow Condensed, Inter, sans-serif">{num}</text>}

        {/* arms */}
        <g className="player-arm arm-left">
          <path d={leftArm} stroke={shirt} strokeWidth="9" strokeLinecap="round" />
          <path d={leftArm} stroke={skin} strokeWidth="6" strokeLinecap="round" strokeDasharray="0 9 40" />
        </g>
        {!isBowl && <g className="player-arm arm-right">
          <path d={rightArm} stroke={shirt} strokeWidth="9" strokeLinecap="round" />
          <path d={rightArm} stroke={skin} strokeWidth="6" strokeLinecap="round" strokeDasharray="0 9 40" />
        </g>}
        {isBat && <><circle cx="52" cy="68" r="4.2" fill="#eef1ea" stroke="#9aa59d" /><circle cx="61" cy="69" r="4.2" fill="#eef1ea" stroke="#9aa59d" /></>}

        {/* head */}
        <circle cx="45" cy="24" r="12.5" fill={skin} />
        {!isBat && !isUmp && <path d="M33 21 Q45 4 57 21 Q45 14 33 21Z" fill={hair} />}
        <circle cx="40.5" cy="25" r="1.3" fill="#24160f" /><circle cx="49.5" cy="25" r="1.3" fill="#24160f" />
        {beard && <path d="M35.5 28 Q45 43 54.5 28 Q45 33 35.5 28Z" fill={hair} opacity=".9" />}

        {/* helmet / cap / hat */}
        {isBat && <>
          <path d="M31 25 Q31 5 45 5 Q59 5 59 25 L59 27 L31 27 Z" fill={shade(shirt, 0.15)} stroke={trim} strokeWidth="1" />
          <path d="M31 27 H59" stroke="#0a0f0c" strokeWidth="2" />
          <path d="M36 28 V37 M45 28 V39 M54 28 V37 M33 33 H57" stroke="#cfd7d2" strokeWidth="1.2" />
        </>}
        {!isBat && !isUmp && <>
          <path d="M32.5 21 Q45 3 57.5 21 Z" fill={shirt} stroke={trim} strokeWidth=".8" />
          <path d="M50 20 Q64 20 66 25" stroke={shade(shirt, 0.25)} strokeWidth="3" strokeLinecap="round" fill="none" />
        </>}
        {isUmp && <>
          <ellipse cx="45" cy="15" rx="19" ry="4.5" fill="#f4f5f2" stroke="#9aa39d" />
          <path d="M33 15 Q45 0 57 15Z" fill="#f4f5f2" stroke="#9aa39d" />
        </>}

        {/* bat */}
        {isBat && <g className="bat">
          <path d="M58 66 L61 79" stroke="#3b2a1b" strokeWidth="4" strokeLinecap="round" />
          <path d="M61 78 L73 118" stroke="#dcb673" strokeWidth="9" strokeLinecap="round" />
          <path d="M61 78 L73 118" stroke="#a97d3f" strokeWidth="1.5" strokeLinecap="round" opacity=".7" />
        </g>}

        {/* bowling arm + ball */}
        {isBowl && <g className="bowling-arm">
          <path d="M59 50 L78 24" stroke={shirt} strokeWidth="9" strokeLinecap="round" />
          <path d="M59 50 L78 24" stroke={skin} strokeWidth="6" strokeLinecap="round" strokeDasharray="0 14 40" />
          <circle className="ball-hand" cx="79" cy="22" r="3.6" fill="#e03642" stroke="#ffb3b8" strokeWidth=".8" />
        </g>}
      </svg>
      {name && !isUmp && <span>{name}</span>}
    </div>
  );
}
