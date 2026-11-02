export default function StadiumBackdrop({ name = 'RC26 INTERNATIONAL STADIUM', teams = [] }) {
  return (
    <div className="stadium-backdrop" aria-hidden="true">
      <div className="stadium-sky-gradient" />
      <div className="stadium-moon" />
      <div className="stadium-roof roof-left" />
      <div className="stadium-roof roof-right" />
      <div className="stadium-stands upper">
        <div className="stand-tier tier-1" /><div className="stand-tier tier-2" /><div className="stand-tier tier-3" />
      </div>
      <div className="stadium-stands lower">
        <div className="stand-tier tier-1" /><div className="stand-tier tier-2" />
      </div>
      <div className="stadium-corporate">
        <span>VIP</span><span>RC26 CLUB</span><span>MEDIA</span><span>HOSPITALITY</span>
      </div>
      <div className="stadium-adboards">
        <span>RC26 ARENA</span><span>INTERNATIONAL CRICKET</span><span>{teams[0]?.name || 'HOME'} • {teams[1]?.name || 'AWAY'}</span><span>LIVE</span>
      </div>
      <div className="stadium-scoreboard">
        <small>{name}</small><strong>LIVE CRICKET</strong><span>INTERNATIONAL MATCH</span>
      </div>
      <div className="stadium-floodlight light-left"><i/><i/><i/><i/><i/><i/></div>
      <div className="stadium-floodlight light-right"><i/><i/><i/><i/><i/><i/></div>
      <div className="stadium-poles pole-left"/><div className="stadium-poles pole-right"/>
      <div className="stadium-crowd-glow" />
      <div className="stadium-horizon" />
      <div className="stadium-title">{name}</div>
    </div>
  );
}
