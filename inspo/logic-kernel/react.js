import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const customStyles = {
  root: {
    '--void-black': '#0f1923',
    '--tactical-red': '#ff4655',
    '--off-white': '#ece8e1',
    '--ui-gray': '#364966',
    '--grid-line': 'rgba(236, 232, 225, 0.15)',
    '--font-display': "'Teko', sans-serif",
    '--font-tech': "'JetBrains Mono', monospace"
  }
};

const GridOverlay = () => {
  const gridStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: 'linear-gradient(rgba(236, 232, 225, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 232, 225, 0.15) 1px, transparent 1px)',
    backgroundSize: '100px 100px',
    zIndex: -1,
    pointerEvents: 'none',
    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
    WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
  };
  
  return <div style={gridStyle}></div>;
};

const VerticalText = () => {
  const style = {
    position: 'fixed',
    left: '20px',
    bottom: '40px',
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    fontFamily: 'var(--font-tech)',
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '2px'
  };
  
  return <div style={style}>SYS.READY // VER 4.02 // BOTARENA_OPEN_SRC</div>;
};

const Crosshair = ({ className }) => {
  const baseStyle = {
    position: 'absolute',
    width: '20px',
    height: '20px',
    pointerEvents: 'none'
  };
  
  const positionStyles = {
    'ch-1': { top: '15%', right: '10%', opacity: 0.5 },
    'ch-2': { bottom: '20%', left: '5%', opacity: 0.5 }
  };
  
  const beforeStyle = {
    content: '""',
    position: 'absolute',
    background: 'var(--tactical-red)',
    width: '100%',
    height: '1px',
    top: '50%'
  };
  
  const afterStyle = {
    content: '""',
    position: 'absolute',
    background: 'var(--tactical-red)',
    height: '100%',
    width: '1px',
    left: '50%'
  };
  
  return (
    <div style={{ ...baseStyle, ...positionStyles[className] }}>
      <div style={beforeStyle}></div>
      <div style={afterStyle}></div>
    </div>
  );
};

const Navigation = () => {
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem 4rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(15, 25, 35, 0.8)',
    backdropFilter: 'blur(10px)',
    position: 'fixed',
    width: '100%',
    zIndex: 100,
    top: 0
  };
  
  const logoStyle = {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '2rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    position: 'relative',
    paddingLeft: '1rem'
  };
  
  const logoBeforeStyle = {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '8px',
    height: '8px',
    background: 'var(--tactical-red)'
  };
  
  const navLinksStyle = {
    display: 'flex',
    gap: '3rem'
  };
  
  const navItemStyle = {
    fontFamily: 'var(--font-display)',
    textTransform: 'uppercase',
    fontSize: '1.2rem',
    letterSpacing: '1px',
    color: 'var(--off-white)',
    textDecoration: 'none',
    position: 'relative',
    opacity: 0.7,
    transition: '0.2s'
  };
  
  return (
    <nav style={navStyle}>
      <div style={logoStyle}>
        <span style={logoBeforeStyle}></span>
        BotArena<span style={{ color: 'var(--tactical-red)' }}>_</span>
      </div>
      <div style={navLinksStyle}>
        <Link to="/leaderboard" style={navItemStyle} onMouseEnter={(e) => { e.target.style.opacity = 1; e.target.style.color = 'var(--tactical-red)'; }} onMouseLeave={(e) => { e.target.style.opacity = 0.7; e.target.style.color = 'var(--off-white)'; }}>Leaderboard</Link>
        <Link to="/documentation" style={navItemStyle} onMouseEnter={(e) => { e.target.style.opacity = 1; e.target.style.color = 'var(--tactical-red)'; }} onMouseLeave={(e) => { e.target.style.opacity = 0.7; e.target.style.color = 'var(--off-white)'; }}>Documentation</Link>
        <Link to="/community" style={navItemStyle} onMouseEnter={(e) => { e.target.style.opacity = 1; e.target.style.color = 'var(--tactical-red)'; }} onMouseLeave={(e) => { e.target.style.opacity = 0.7; e.target.style.color = 'var(--off-white)'; }}>Community</Link>
        <Link to="/login" style={{ ...navItemStyle, color: 'var(--tactical-red)' }} onMouseEnter={(e) => { e.target.style.opacity = 1; }} onMouseLeave={(e) => { e.target.style.opacity = 0.7; }}>Login // &gt;</Link>
      </div>
    </nav>
  );
};

const Hero = () => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText('npx botarena generate');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const heroStyle = {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    paddingTop: '80px'
  };
  
  const bgTypographyStyle = {
    position: 'absolute',
    fontFamily: 'var(--font-display)',
    fontSize: '35vw',
    fontWeight: 700,
    lineHeight: 0.8,
    color: 'transparent',
    WebkitTextStroke: '2px rgba(255, 70, 85, 0.08)',
    zIndex: -1,
    whiteSpace: 'nowrap',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    userSelect: 'none'
  };
  
  const heroContentStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    maxWidth: '1400px',
    width: '100%',
    padding: '0 4rem',
    gap: '4rem',
    alignItems: 'center'
  };
  
  const microLabelStyle = {
    color: 'var(--tactical-red)',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };
  
  const microLabelAfterStyle = {
    content: '""',
    height: '1px',
    width: '40px',
    background: 'var(--tactical-red)'
  };
  
  const h1Style = {
    fontFamily: 'var(--font-display)',
    fontSize: '7rem',
    lineHeight: 0.85,
    textTransform: 'uppercase',
    marginBottom: '2rem',
    position: 'relative'
  };
  
  const outlineStyle = {
    color: 'transparent',
    WebkitTextStroke: '2px var(--off-white)',
    display: 'block'
  };
  
  const leadStyle = {
    fontSize: '1rem',
    lineHeight: 1.6,
    maxWidth: '500px',
    marginBottom: '3rem',
    color: '#bdc3c7',
    borderLeft: '2px solid var(--tactical-red)',
    paddingLeft: '1.5rem'
  };
  
  const terminalBlockStyle = {
    background: 'rgba(0,0,0,0.6)',
    border: '1px solid #333',
    padding: '2rem',
    position: 'relative',
    backdropFilter: 'blur(5px)',
    clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
  };
  
  const terminalBeforeStyle = {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '20px',
    height: '2px',
    background: 'var(--tactical-red)'
  };
  
  const terminalAfterStyle = {
    content: '""',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '20px',
    height: '2px',
    background: 'var(--tactical-red)'
  };
  
  const codeLineStyle = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '1.2rem',
    color: 'var(--off-white)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };
  
  const copyBtnStyle = {
    marginLeft: 'auto',
    background: 'transparent',
    border: '1px solid #444',
    color: copied ? 'var(--tactical-red)' : '#888',
    padding: '0.2rem 0.5rem',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: '0.2s'
  };
  
  const btnPrimaryStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60px',
    padding: '0 3rem',
    background: 'var(--tactical-red)',
    color: 'var(--off-white)',
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    textTransform: 'uppercase',
    textDecoration: 'none',
    fontWeight: 600,
    position: 'relative',
    letterSpacing: '1px',
    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
    transition: 'transform 0.2s',
    border: 'none',
    cursor: 'pointer'
  };
  
  const btnAfterStyle = {
    content: '""',
    position: 'absolute',
    bottom: '5px',
    right: '5px',
    width: '4px',
    height: '4px',
    background: 'var(--void-black)'
  };
  
  return (
    <section style={heroStyle}>
      <div style={bgTypographyStyle}>ARENA // MODE</div>
      
      <div style={heroContentStyle}>
        <div style={{ zIndex: 2 }}>
          <div style={microLabelStyle}>
            System Initialized
            <span style={microLabelAfterStyle}></span>
          </div>
          <h1 style={h1Style}>
            <span style={outlineStyle}>Deploy Your</span>
            <span style={{ display: 'block' }}>Logic Kernel</span>
          </h1>
          <p style={leadStyle}>
            The ultimate proving ground for open-source AI. Build, battle, and benchmark your bots against the global hivemind. No GUI. No mercy. Pure code.
          </p>
          
          <div>
            <Link to="/initialize" style={btnPrimaryStyle} onMouseEnter={(e) => { e.target.style.transform = 'translate(-2px, -2px)'; e.target.style.background = '#ff5866'; }} onMouseLeave={(e) => { e.target.style.transform = 'none'; e.target.style.background = 'var(--tactical-red)'; }}>
              Initialize Protocol
              <span style={btnAfterStyle}></span>
            </Link>
          </div>
        </div>
        
        <div style={terminalBlockStyle}>
          <span style={terminalBeforeStyle}></span>
          <span style={terminalAfterStyle}></span>
          <div style={{ ...microLabelStyle, marginBottom: '0.5rem', fontSize: '0.6rem', color: '#666' }}>TERMINAL_ACCESS</div>
          <div style={codeLineStyle}>
            <span style={{ color: 'var(--tactical-red)' }}>$</span>
            <span style={{ color: '#fff' }}>npx</span>
            <span style={{ color: '#888' }}>botarena generate</span>
            <button 
              style={copyBtnStyle} 
              onClick={handleCopy}
              onMouseEnter={(e) => { e.target.style.borderColor = 'var(--tactical-red)'; e.target.style.color = 'var(--tactical-red)'; }}
              onMouseLeave={(e) => { if (!copied) { e.target.style.borderColor = '#444'; e.target.style.color = '#888'; } }}
            >
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>
          <div style={{ ...codeLineStyle, marginTop: '1rem', opacity: 0.5, fontSize: '0.9rem' }}>
            <span>&gt; Scaffolding new neural net...</span>
          </div>
          <div style={{ ...codeLineStyle, marginTop: '0.2rem', opacity: 0.5, fontSize: '0.9rem' }}>
            <span>&gt; Done. Ready for deployment.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const BotCard = ({ rank, name, lang, elo, winRate, visualStyle }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardStyle = {
    background: isHovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${isHovered ? 'var(--tactical-red)' : 'rgba(255,255,255,0.1)'}',
    position: 'relative',
    transition: '0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
    cursor: 'pointer',
    overflow: 'hidden',
    transform: isHovered ? 'translateY(-5px)' : 'none'
  };
  
  const cardVisualStyle = {
    height: '300px',
    background: '#1a2733',
    position: 'relative',
    overflow: 'hidden',
    filter: isHovered ? 'grayscale(0%) contrast(1.1)' : 'grayscale(100%) contrast(1.2)',
    transition: '0.4s'
  };
  
  const rankBadgeStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'var(--void-black)',
    color: 'var(--off-white)',
    padding: '0.2rem 0.8rem',
    fontFamily: 'var(--font-display)',
    fontSize: '1.2rem',
    border: '1px solid var(--tactical-red)',
    zIndex: 2
  };
  
  const cardContentStyle = {
    padding: '1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.1)'
  };
  
  const botNameStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '2.5rem',
    textTransform: 'uppercase',
    lineHeight: 1,
    marginBottom: '0.5rem'
  };
  
  const botSpecsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: '#888',
    marginTop: '1rem'
  };
  
  const specItemStyle = {
    display: 'flex',
    flexDirection: 'column'
  };
  
  const specValStyle = {
    color: 'var(--off-white)',
    fontWeight: 700
  };
  
  const beforeStyle = {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: isHovered ? '100%' : '0',
    height: '2px',
    background: 'var(--tactical-red)',
    transition: '0.3s'
  };
  
  return (
    <div 
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={beforeStyle}></span>
      <div style={rankBadgeStyle}>{rank}</div>
      <div style={cardVisualStyle}>
        {visualStyle}
      </div>
      <div style={cardContentStyle}>
        <div style={botNameStyle}>{name}</div>
        <div style={botSpecsStyle}>
          <div style={specItemStyle}>
            <span>LANG</span>
            <span style={specValStyle}>{lang}</span>
          </div>
          <div style={specItemStyle}>
            <span>ELO</span>
            <span style={specValStyle}>{elo}</span>
          </div>
          <div style={specItemStyle}>
            <span>W/L</span>
            <span style={specValStyle}>{winRate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Showcase = () => {
  const [activeFilter, setActiveFilter] = useState('Global Elite');
  
  const showcaseStyle = {
    padding: '8rem 4rem',
    maxWidth: '1400px',
    margin: '0 auto',
    position: 'relative'
  };
  
  const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '4rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '1rem'
  };
  
  const microLabelStyle = {
    color: 'var(--tactical-red)',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };
  
  const sectionTitleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '4rem',
    textTransform: 'uppercase',
    lineHeight: 1
  };
  
  const gridFiltersStyle = {
    display: 'flex',
    gap: '1.5rem'
  };
  
  const filterItemStyle = (isActive) => ({
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    color: isActive ? 'var(--tactical-red)' : '#666',
    fontWeight: isActive ? 700 : 400,
    cursor: 'pointer',
    transition: '0.3s'
  });
  
  const botGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem'
  };
  
  const visual1 = (
    <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at 30% 20%, #444, #1a2733)', position: 'relative' }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, #1a2733, transparent)' }}></div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(45deg)', width: '100px', height: '100px', border: '2px solid #fff' }}></div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120px', height: '2px', background: 'var(--tactical-red)' }}></div>
    </div>
  );
  
  const visual2 = (
    <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at 70% 20%, #555, #1a2733)', position: 'relative' }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, #1a2733, transparent)' }}></div>
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '120px', border: '1px solid #fff' }}></div>
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '60px', height: '60px', background: 'var(--tactical-red)', opacity: 0.2 }}></div>
    </div>
  );
  
  const visual3 = (
    <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, #333, #1a2733)', position: 'relative' }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, #1a2733, transparent)' }}></div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(45deg)', width: '80px', height: '80px', border: '4px solid #fff' }}></div>
    </div>
  );
  
  return (
    <section style={showcaseStyle}>
      <div style={sectionHeaderStyle}>
        <div>
          <div style={microLabelStyle}>Live Feeds</div>
          <div style={sectionTitleStyle}>Top Performers</div>
        </div>
        <div style={gridFiltersStyle}>
          <div 
            style={filterItemStyle(activeFilter === 'Global Elite')}
            onClick={() => setActiveFilter('Global Elite')}
          >
            Global Elite
          </div>
          <div 
            style={filterItemStyle(activeFilter === 'Rising Stars')}
            onClick={() => setActiveFilter('Rising Stars')}
          >
            Rising Stars
          </div>
          <div 
            style={filterItemStyle(activeFilter === 'New Entries')}
            onClick={() => setActiveFilter('New Entries')}
          >
            New Entries
          </div>
        </div>
      </div>
      
      <div style={botGridStyle}>
        <BotCard 
          rank="#01"
          name="DeepBlue_X"
          lang="RUST"
          elo="3450"
          winRate="98%"
          visualStyle={visual1}
        />
        <BotCard 
          rank="#02"
          name="K-Nearest"
          lang="PYTHON"
          elo="3210"
          winRate="84%"
          visualStyle={visual2}
        />
        <BotCard 
          rank="#03"
          name="Alpha_Zero"
          lang="C++"
          elo="3105"
          winRate="79%"
          visualStyle={visual3}
        />
      </div>
    </section>
  );
};

const HomePage = () => {
  return (
    <>
      <Hero />
      <Showcase />
    </>
  );
};

const LeaderboardPage = () => {
  const pageStyle = {
    minHeight: '100vh',
    paddingTop: '120px',
    padding: '120px 4rem 4rem'
  };
  
  const titleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '4rem',
    textTransform: 'uppercase',
    marginBottom: '2rem'
  };
  
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Leaderboard</h1>
      <p>Full leaderboard coming soon...</p>
    </div>
  );
};

const DocumentationPage = () => {
  const pageStyle = {
    minHeight: '100vh',
    paddingTop: '120px',
    padding: '120px 4rem 4rem'
  };
  
  const titleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '4rem',
    textTransform: 'uppercase',
    marginBottom: '2rem'
  };
  
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Documentation</h1>
      <p>API documentation and guides coming soon...</p>
    </div>
  );
};

const CommunityPage = () => {
  const pageStyle = {
    minHeight: '100vh',
    paddingTop: '120px',
    padding: '120px 4rem 4rem'
  };
  
  const titleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '4rem',
    textTransform: 'uppercase',
    marginBottom: '2rem'
  };
  
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Community</h1>
      <p>Join our community channels...</p>
    </div>
  );
};

const LoginPage = () => {
  const pageStyle = {
    minHeight: '100vh',
    paddingTop: '120px',
    padding: '120px 4rem 4rem'
  };
  
  const titleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '4rem',
    textTransform: 'uppercase',
    marginBottom: '2rem'
  };
  
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Login</h1>
      <p>Authentication system initializing...</p>
    </div>
  );
};

const InitializePage = () => {
  const pageStyle = {
    minHeight: '100vh',
    paddingTop: '120px',
    padding: '120px 4rem 4rem'
  };
  
  const titleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '4rem',
    textTransform: 'uppercase',
    marginBottom: '2rem'
  };
  
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Initialize Protocol</h1>
      <p>Bot deployment wizard coming soon...</p>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        background-color: var(--void-black);
        color: var(--off-white);
        font-family: var(--font-tech);
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
      }
      
      @import url('https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
    `;
    document.head.appendChild(style);
    
    return () => document.head.removeChild(style);
  }, []);
  
  return (
    <Router basename="/">
      <div style={customStyles.root}>
        <GridOverlay />
        <VerticalText />
        <Crosshair className="ch-1" />
        <Crosshair className="ch-2" />
        <Navigation />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/initialize" element={<InitializePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;