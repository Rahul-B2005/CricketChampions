import { Link } from 'react-router-dom';
import { FiPlay, FiGlobe, FiUsers, FiBarChart2, FiZap, FiMonitor, FiActivity } from 'react-icons/fi';
import { GiCricketBat, GiArena } from 'react-icons/gi';

export default function Dashboard(){
  return <div className="dashboard-home">
    <section className="dash-hero rc26-home-hero">
      <div className="home-copy">
        <span className="eyebrow"><FiZap/> RC26 ARENA • NEXT-GEN CRICKET</span>
        <h1>Feel the<br/><span>stadium.</span></h1>
        <p>Walk onto a full-size international ground, face a live bowler, time every shot and control the match yourself. No autoplay. No management-only simulation.</p>
        <div className="hero-actions">
          <Link className="primary hero-btn" to="/international"><FiPlay/> Play International Match</Link>
          <Link className="ghost hero-btn" to="/teams"><FiUsers/> Manage Squads</Link>
        </div>
        <div className="hero-actions home-pills">
          <span className="live-pill"><FiMonitor/> BROADCAST HUD</span>
          <span className="live-pill"><GiArena/> FULL-SIZE GROUND</span>
          <span className="live-pill"><GiCricketBat/> MANUAL BAT & BOWL</span>
        </div>
      </div>

      <div className="hero-score realistic-home-stadium">
        <div className="home-stadium-sky"/>
        <div className="home-stands home-stands-back"/>
        <div className="home-scoreboard"><small>RC26 INTERNATIONAL</small><b>IND <i>VS</i> AUS</b><span>T20 • NIGHT MATCH</span></div>
        <div className="home-floodlight hf-left"/><div className="home-floodlight hf-right"/>
        <div className="home-ground">
          <div className="home-boundary"/>
          <div className="home-pitch">
            <div className="home-crease hc-top"/><div className="home-crease hc-bottom"/>
            <div className="home-wicket hw-top"><i/><i/><i/></div><div className="home-wicket hw-bottom"><i/><i/><i/></div>
          </div>
          <div className="home-player hp-bowler">●</div><div className="home-player hp-batter">🏏</div>
        </div>
      </div>
    </section>

    <section className="quick-grid">
      <Link to="/international"><FiGlobe/><b>International Match</b><span>Real squads • stadiums • manual play</span></Link>
      <Link to="/simulator"><FiActivity/><b>Match Center</b><span>Ball-by-ball control • timing gameplay</span></Link>
      <Link to="/players"><FiUsers/><b>Player Hub</b><span>Roles, ratings & playing XI</span></Link>
      <Link to="/matches"><FiBarChart2/><b>Match History</b><span>Results & performance</span></Link>
    </section>

    <section className="broadcast-note home-broadcast">
      <span className="eyebrow">GAME PRESENTATION</span>
      <div><b>Broadcast scoreboard</b><b>Animated players</b><b>Full-size pitch</b><b>Live commentary</b><b>Manual controls</b></div>
    </section>
  </div>;
}
