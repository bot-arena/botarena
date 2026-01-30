import React, { useState, useEffect } from 'react';

const customStyles = {
  barcodeStrip: {
    height: '24px',
    width: '100%',
    background: 'repeating-linear-gradient(90deg, #ffffff, #ffffff 2px, transparent 2px, transparent 4px, #ffffff 6px, #ffffff 7px, transparent 7px, transparent 12px)',
    opacity: 0.8
  },
  barcodeBlock: {
    display: 'inline-block',
    height: '1.5em',
    width: '80px',
    background: 'repeating-linear-gradient(90deg, #ffffff, #ffffff 1px, transparent 1px, transparent 3px)'
  },
  heroCardBackground: {
    background: 'radial-gradient(circle at center, #1a1a1a 0%, #000 70%)'
  },
  botCardBackground: {
    background: 'rgba(255, 255, 255, 0.02)'
  }
};

const BarcodeStrip = ({ style = {} }) => (
  <div style={{ ...customStyles.barcodeStrip, ...style }}></div>
);

const BarcodeBlock = () => (
  <span style={customStyles.barcodeBlock}></span>
);

const HudCorner = ({ position, style = {} }) => {
  const baseStyle = {
    position: 'absolute',
    width: '20px',
    height: '20px',
    border: '2px solid #ffffff',
    transition: 'all 0.2s ease'
  };

  const positions = {
    tl: { top: 0, left: 0, borderRight: 'none', borderBottom: 'none' },
    tr: { top: 0, right: 0, borderLeft: 'none', borderBottom: 'none' },
    bl: { bottom: 0, left: 0, borderRight: 'none', borderTop: 'none' },
    br: { bottom: 0, right: 0, borderLeft: 'none', borderTop: 'none' }
  };

  return <div style={{ ...baseStyle, ...positions[position], ...style }}></div>;
};

const Crosshair = ({ style = {} }) => {
  const baseStyle = {
    position: 'absolute',
    width: '10px',
    height: '10px'
  };

  return (
    <div style={{ ...baseStyle, ...style }}>
      <div style={{ position: 'absolute', top: '4px', left: 0, width: '100%', height: '2px', background: '#ffffff' }}></div>
      <div style={{ position: 'absolute', top: 0, left: '4px', width: '2px', height: '100%', background: '#ffffff' }}></div>
    </div>
  );
};

const Sticker = ({ children, variant = 'default', style = {} }) => {
  const baseStyle = {
    display: 'inline-block',
    padding: '4px 8px',
    border: '1px solid #ffffff',
    fontFamily: "'Chakra Petch', sans-serif",
    fontWeight: 'bold',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    marginRight: '10px'
  };

  const variants = {
    red: { background: '#D80027', borderColor: '#D80027', color: '#050505' },
    yellow: { background: '#FFCC00', borderColor: '#FFCC00', color: '#050505' },
    default: {}
  };

  return (
    <span style={{ ...baseStyle, ...variants[variant], ...style }}>
      {children}
    </span>
  );
};

const NavIcon = ({ children, title, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const style = {
    width: '40px',
    height: '40px',
    border: `1px solid ${isHovered ? '#D80027' : '#333333'}`,
    display: 'grid',
    placeItems: 'center',
    fontFamily: "'Space Mono', monospace",
    fontSize: '1.2rem',
    transition: 'all 0.2s',
    cursor: 'pointer',
    background: isHovered ? '#D80027' : 'transparent',
    color: isHovered ? '#050505' : '#ffffff'
  };

  return (
    <div
      style={style}
      title={title}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const BotCard = ({ name, version, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        border: `1px solid ${isHovered ? '#FFCC00' : '#333333'}`,
        padding: '20px',
        position: 'relative',
        ...customStyles.botCardBackground,
        transition: 'border-color 0.2s'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HudCorner position="tl" style={{ width: isHovered ? '100%' : '10px', height: isHovered ? '100%' : '10px', borderColor: isHovered ? '#FFCC00' : '#ffffff' }} />
      <HudCorner position="br" style={{ width: isHovered ? '100%' : '10px', height: isHovered ? '100%' : '10px', borderColor: isHovered ? '#FFCC00' : '#ffffff' }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px dashed #333333', paddingBottom: '10px' }}>
        <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: '1.2rem', textTransform: 'uppercase' }}>
          {name}
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', background: '#ffffff', color: '#050505', padding: '2px 6px' }}>
          {version}
        </span>
      </div>
      
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', color: '#888', marginBottom: '20px' }}>
        {description}
      </p>
      
      <BarcodeStrip style={{ height: '10px', opacity: 0.3 }} />
    </div>
  );
};

const App = () => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&family=Koulen&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        background-color: #050505;
        color: #ffffff;
        font-family: 'Chakra Petch', sans-serif;
        overflow-x: hidden;
        line-height: 1.2;
        cursor: crosshair;
      }

      .glitch-text {
        position: relative;
      }
      
      .glitch-text::before, .glitch-text::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #050505;
      }
      
      .glitch-text::before {
        left: 2px;
        text-shadow: -1px 0 #D80027;
        clip: rect(24px, 550px, 90px, 0);
        animation: glitch-anim-2 3s infinite linear alternate-reverse;
      }

      @keyframes glitch-anim-2 {
        0% { clip: rect(65px, 9999px, 100px, 0); }
        5% { clip: rect(5px, 9999px, 80px, 0); }
        100% { clip: rect(10px, 9999px, 100px, 0); }
      }

      .angled-cut {
        clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
      }
    `;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px', display: 'grid', gridTemplateColumns: '80px 1fr 300px', gap: '40px', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid #333333', paddingRight: '20px', textAlign: 'center' }}>
        <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', fontFamily: "'Koulen', sans-serif", fontSize: '4rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D80027', lineHeight: 1 }}>
          Bot<span style={{ color: 'white' }}>Arena</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <NavIcon title="Home">01</NavIcon>
          <NavIcon title="Deploy">02</NavIcon>
          <NavIcon title="Config">03</NavIcon>
          <BarcodeStrip style={{ height: '100px', writingMode: 'vertical-rl' }} />
        </div>
        
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', opacity: 0.5 }}>
          V.2.0.4
        </div>
      </nav>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <header style={{ borderBottom: '2px solid #ffffff', paddingBottom: '20px', position: 'relative' }}>
          <BarcodeStrip style={{ marginBottom: '10px' }} />
          <h1 className="glitch-text" data-text="BOTARENA" style={{ fontFamily: "'Koulen', sans-serif", fontSize: '8rem', lineHeight: 0.8, textTransform: 'uppercase', marginBottom: '10px', color: '#ffffff' }}>
            BOT<span style={{ letterSpacing: '-0.05em' }}>ARENA</span>
          </h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Space Mono', monospace", fontSize: '0.9rem', letterSpacing: '0.05em' }}>
            <span>SYSTEM STATUS: <span style={{ color: '#FFCC00' }}>ONLINE</span></span>
            <BarcodeBlock />
            <span style={{ letterSpacing: '-2px', fontWeight: 'bold' }}>&gt;&gt;&gt; &gt;&gt;&gt; &gt;&gt;&gt;</span>
            <span>NETFLIX_MOD_ENABLED // FALSE</span>
          </div>
        </header>

        <section style={{ position: 'relative', height: '500px', border: '1px solid #333333', ...customStyles.heroCardBackground, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <div style={{ content: '', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '1px solid #D80027', transform: 'scale(0.97)', pointerEvents: 'none', clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}></div>
          
          <HudCorner position="tl" />
          <HudCorner position="tr" />
          <HudCorner position="bl" />
          <HudCorner position="br" />

          <Crosshair style={{ top: '20px', left: '50%' }} />
          <Crosshair style={{ bottom: '20px', left: '50%' }} />
          <Crosshair style={{ top: '50%', left: '20px' }} />
          <Crosshair style={{ top: '50%', right: '20px' }} />

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%' }}>
            <div style={{ marginBottom: '10px' }}>
              <Sticker variant="red">FEATURED</Sticker>
              <Sticker>KILLER_V2</Sticker>
            </div>
            
            <div style={{ width: '300px', height: '300px', background: '#FFCC00', margin: '0 auto 20px', maskImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"50\" cy=\"50\" r=\"40\" /></svg>')", WebkitMaskImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"50\" cy=\"50\" r=\"40\" /></svg>')", maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center', display: 'grid', placeItems: 'center', fontFamily: "'Koulen', sans-serif", fontSize: '8rem', color: '#050505', position: 'relative' }}>
              <div style={{ position: 'absolute' }}>AI</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: '#D80027', fontWeight: 'bold' }}>TYPE</span>
                <span>LLM-7B</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: '#D80027', fontWeight: 'bold' }}>SPEED</span>
                <span>450 T/S</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: '#D80027', fontWeight: 'bold' }}>ACCURACY</span>
                <span>99.9%</span>
              </div>
            </div>

            <button style={{ position: 'absolute', bottom: '40px', right: '40px', background: '#D80027', color: '#ffffff', border: 'none', padding: '15px 40px', fontFamily: "'Koulen', sans-serif", fontSize: '1.5rem', textTransform: 'uppercase', cursor: 'pointer', clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)', transition: 'transform 0.1s' }} onMouseEnter={(e) => { e.target.style.transform = 'translate(-2px, -2px)'; e.target.style.background = '#ffffff'; e.target.style.color = '#D80027'; }} onMouseLeave={(e) => { e.target.style.transform = 'translate(0, 0)'; e.target.style.background = '#D80027'; e.target.style.color = '#ffffff'; }}>
              INITIALIZE &gt;&gt;
            </button>
          </div>
        </section>

        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <div style={{ fontFamily: "'Koulen', sans-serif", fontSize: '2rem', textTransform: 'uppercase' }}>LATEST DEPLOYMENTS</div>
            <div style={{ flexGrow: 1, height: '1px', background: '#333333' }}></div>
            <div style={{ fontFamily: "'Space Mono', monospace" }}>[ VIEW_ALL ]</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <BotCard name="SYNTH_01" version="v1.2" description="Optimized for code generation and refactoring logic." />
            <BotCard name="NEXUS_CORE" version="v0.9" description="Natural language processing with emotional weighting." />
            <BotCard name="VECTOR_X" version="BETA" description="Image synthesis bridge. High latency / High fidelity." />
          </div>
        </section>
      </main>

      <aside style={{ borderLeft: '1px solid #333333', paddingLeft: '40px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div className="angled-cut" style={{ border: '1px solid #333333', padding: '20px' }}>
          <div style={{ background: '#D80027', color: '#ffffff', padding: '5px 10px', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', textTransform: 'uppercase', display: 'inline-block', marginBottom: '15px', marginLeft: '-25px' }}>LIVE_METRICS</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', marginBottom: '8px', borderBottom: '1px dotted #333', paddingBottom: '4px' }}>
            <span>UPTIME</span>
            <span style={{ color: '#FFCC00' }}>99.99%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', marginBottom: '8px', borderBottom: '1px dotted #333', paddingBottom: '4px' }}>
            <span>ACTIVE NODES</span>
            <span style={{ color: '#FFCC00' }}>4,028</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', marginBottom: '8px', borderBottom: '1px dotted #333', paddingBottom: '4px' }}>
            <span>REQ/SEC</span>
            <span style={{ color: '#FFCC00' }}>12k</span>
          </div>
          <BarcodeStrip style={{ marginTop: '10px', height: '40px' }} />
        </div>

        <div style={{ border: '1px solid #333333', padding: '20px' }}>
          <div style={{ background: '#ffffff', color: '#050505', padding: '5px 10px', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', textTransform: 'uppercase', display: 'inline-block', marginBottom: '15px', marginLeft: '-25px' }}>NOTICES</div>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', color: '#aaa', marginBottom: '10px' }}>
            &gt; SYSTEM UPDATE SCHEDULED FOR 23:00 UTC.<br />
            &gt; NEW KERNEL PATCH AVAILABLE.<br />
            &gt; MEMORY LEAK DETECTED IN SECTOR 7.
          </p>
          <Sticker variant="yellow" style={{ fontSize: '0.6rem' }}>ALERT</Sticker>
        </div>

        <div style={{ fontSize: '2rem', color: '#333333', textAlign: 'center', marginTop: 'auto' }}>
          ❖ ⌖ ⊗
          <div style={{ fontSize: '0.8rem', letterSpacing: '0.2em', marginTop: '10px' }}>SILENT_POWER</div>
        </div>
      </aside>

      <footer style={{ gridColumn: '1 / -1', borderTop: '1px solid #333333', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', textTransform: 'uppercase', color: '#666' }}>
        <div>© 2024 BOTARENA INC. // ALL RIGHTS RESERVED</div>
        <div style={{ letterSpacing: '5px' }}>/// /// /// ///</div>
        <div>[ PRIVACY_PROTOCOL ] [ TERMINATION_CLAUSE ]</div>
      </footer>
    </div>
  );
};

export default App;