import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const customStyles = {
  root: {
    '--bg': '#080808',
    '--fg': '#e6e6e6',
    '--dim': '#666666',
    '--border': '#333333',
    '--accent': '#ffffff',
    '--font-serif': '"Times New Roman", Times, serif',
    '--font-mono': '"Courier New", Courier, monospace',
    '--spacing': '1rem'
  },
  body: {
    backgroundColor: 'var(--bg)',
    color: 'var(--fg)',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    lineHeight: '1.4',
    overflowX: 'hidden',
    width: '100vw',
    margin: 0,
    padding: 0
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    borderLeft: '1px solid var(--border)',
    borderRight: '1px solid var(--border)',
    minHeight: '100vh',
    position: 'relative',
    zIndex: 2
  },
  logo: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    letterSpacing: '-0.02em',
    display: 'flex',
    alignItems: 'center'
  },
  h1: {
    fontFamily: 'var(--font-serif)',
    fontSize: '4rem',
    lineHeight: '0.9',
    marginBottom: '2rem',
    fontWeight: 'normal',
    letterSpacing: '-0.03em'
  },
  manifesto: {
    padding: '4rem 2rem',
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    lineHeight: '1.3',
    maxWidth: '800px',
    borderBottom: '1px solid var(--border)'
  }
};

const NoiseCanvas = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    
    const resize = () => {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      canvas.width = width;
      canvas.height = height;
      return { width, height };
    };
    
    let { width, height } = resize();
    window.addEventListener('resize', () => {
      const dims = resize();
      width = dims.width;
      height = dims.height;
    });
    
    let animationId;
    
    const draw = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      const scale = 0.003;
      const time = Date.now() * 0.0002;
      
      for (let x = 0; x < width; x += 2) {
        for (let y = 0; y < height; y += 2) {
          const v = Math.sin(x * scale + time) * Math.cos(y * scale + time) + Math.sin((x + y) * scale * 2);
          let gray = (v + 2) / 4 * 255;
          gray += (Math.random() - 0.5) * 50;
          const threshold = 100 + (Math.random() * 50);
          
          if (gray > threshold) {
            const index = (y * width + x) * 4;
            data[index] = 200;
            data[index + 1] = 200;
            data[index + 2] = 200;
            data[index + 3] = 255;
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', resize);
    };
  }, []);
  
  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', opacity: 0.8, filter: 'contrast(150%) brightness(0.9)' }} />;
};

const Ticker = () => {
  return (
    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.7rem', color: 'var(--dim)' }}>
      <div style={{ display: 'inline-block', animation: 'marquee 20s linear infinite' }}>
        NOMINAL SYSTEM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOMINAL SYSTEM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOMINAL SYSTEM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NOMINAL SYSTEM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', borderBottom: '1px solid var(--border)' }}>
      <div style={{ ...customStyles.logo, padding: 'var(--spacing)' }}>
        NOMINAL <span style={{ fontSize: '0.5em', marginLeft: '10px', fontFamily: 'var(--font-mono)' }}>v.2.0.4</span>
      </div>
      <div 
        onClick={() => navigate('/')}
        style={{ 
          borderLeft: '1px solid var(--border)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textTransform: 'uppercase', 
          fontSize: '0.7rem', 
          cursor: 'pointer', 
          transition: 'background 0.2s, color 0.2s' 
        }}
        onMouseEnter={(e) => { e.target.style.background = 'var(--fg)'; e.target.style.color = 'var(--bg)'; }}
        onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--fg)'; }}
      >
        System Overview
      </div>
      <div 
        onClick={() => navigate('/login')}
        style={{ 
          borderLeft: '1px solid var(--border)', 
          borderRight: 'none',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textTransform: 'uppercase', 
          fontSize: '0.7rem', 
          cursor: 'pointer', 
          transition: 'background 0.2s, color 0.2s' 
        }}
        onMouseEnter={(e) => { e.target.style.background = 'var(--fg)'; e.target.style.color = 'var(--bg)'; }}
        onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--fg)'; }}
      >
        Login
      </div>
    </header>
  );
};

const DataRow = ({ module, description, efficiency, load, barWidth, delay = 0 }) => {
  const [animatedWidth, setAnimatedWidth] = useState('0%');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(barWidth);
    }, delay);
    return () => clearTimeout(timer);
  }, [barWidth, delay]);
  
  return (
    <>
      <div style={{ padding: '0.75rem', borderRight: '1px solid var(--border)', borderTop: '1px solid var(--border)', fontSize: '0.8rem' }}>
        <span style={{ textTransform: 'uppercase' }}>{module}</span><br />
        <span style={{ color: 'var(--dim)', fontSize: '0.6rem' }}>{description}</span>
      </div>
      <div style={{ padding: '0.75rem', borderRight: '1px solid var(--border)', borderTop: '1px solid var(--border)', fontSize: '0.8rem' }}>
        {efficiency}
        <div style={{ width: '100%', height: '8px', background: '#1a1a1a', marginTop: '4px', border: '1px solid #333' }}>
          <div style={{ height: '100%', background: 'var(--fg)', width: animatedWidth, transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)' }}></div>
        </div>
      </div>
      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem' }}>
        {load}
      </div>
    </>
  );
};

const Stamp = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      style={{ 
        border: `1px solid ${isHovered ? 'var(--fg)' : 'var(--dim)'}`,
        borderRadius: '50%',
        width: '100px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: '0.6rem',
        textTransform: 'uppercase',
        transform: isHovered ? 'rotate(0deg) scale(1.1)' : 'rotate(-10deg)',
        opacity: isHovered ? 1 : 0.7,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        background: isHovered ? '#111' : 'transparent'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ position: 'absolute', inset: '3px', border: '1px solid var(--border)', borderRadius: '50%' }}></div>
      <div>{children}</div>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', minHeight: '60vh' }}>
        <div style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--dim)', display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
              <span>CLASSIFICATION</span>
              <span>FINANCIAL / REGULATORY</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--dim)', display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
              <span>PROTOCOL</span>
              <span>AUTO-FILING</span>
            </div>
            <br /><br />
            <h1 style={customStyles.h1}>
              TAX AUTONOMY<br />FOR THE POST-FIAT<br />
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--dim)' }}>LANDSCAPE.</span>
            </h1>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <p style={{ maxWidth: '400px', marginBottom: '2rem', color: 'var(--dim)' }}>
              Eliminate human error variance. Nominal ingests financial ledgers and outputs audit-proof regulatory filings with 99.99% accuracy.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              style={{ 
                background: 'transparent', 
                border: '1px solid var(--fg)', 
                color: 'var(--fg)', 
                padding: '1rem 2rem', 
                fontFamily: 'var(--font-mono)', 
                textTransform: 'uppercase', 
                fontSize: '0.9rem', 
                cursor: 'pointer', 
                transition: 'all 0.2s' 
              }}
              onMouseEnter={(e) => { 
                e.target.style.background = 'var(--fg)'; 
                e.target.style.color = 'var(--bg)'; 
                e.target.style.boxShadow = '0 0 10px rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => { 
                e.target.style.background = 'transparent'; 
                e.target.style.color = 'var(--fg)'; 
                e.target.style.boxShadow = 'none';
              }}
            >
              Initialize Sequence
            </button>
          </div>
        </div>
        
        <div style={{ borderLeft: '1px solid var(--border)', position: 'relative', overflow: 'hidden', background: 'black' }}>
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--dim)', fontSize: '0.6rem', pointerEvents: 'none' }}>
            X: 42.9001<br />
            Y: 88.1023<br />
            Z: DITHERING...
          </div>
          <NoiseCanvas />
        </div>
      </div>
      
      <div style={{ borderBottom: '1px solid var(--border)', padding: '0.5rem', fontSize: '0.7rem', textTransform: 'uppercase', background: '#0a0a0a' }}>
        System Metrics &amp; Capabilities
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderBottom: '1px solid var(--border)' }}>
        <div style={{ padding: '0.75rem', borderRight: '1px solid var(--border)', borderTop: '1px solid var(--border)', fontSize: '0.8rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', background: '#0f0f0f' }}>
          MODULE TYPE
        </div>
        <div style={{ padding: '0.75rem', borderRight: '1px solid var(--border)', borderTop: '1px solid var(--border)', fontSize: '0.8rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', background: '#0f0f0f' }}>
          EFFICIENCY
        </div>
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', background: '#0f0f0f' }}>
          LOAD
        </div>
        
        <DataRow module="Ledger Ingestion" description="CSV, QBO, PLAID API" efficiency="0.04s" load="LOW" barWidth="98%" delay={500} />
        <DataRow module="Deduction Analysis" description="AI-DRIVEN CATEGORIZATION" efficiency="1.20s" load="MED" barWidth="85%" delay={700} />
        <DataRow module="Audit Simulation" description="PRE-FILING RISK CHECK" efficiency="0.89s" load="HIGH" barWidth="92%" delay={900} />
        <DataRow module="Regulatory Submission" description="FEDERAL + ALL 50 STATES" efficiency="INSTANT" load="N/A" barWidth="100%" delay={1100} />
      </div>
      
      <div style={customStyles.manifesto}>
        Mathematics is not a suggestion. <br />
        <span style={{ color: 'var(--dim)' }}>Neither is compliance. We built Nominal to exist in the space between chaotic revenue streams and rigid government architecture.</span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '2rem', gap: '2rem', borderBottom: '1px solid var(--border)' }}>
        <Stamp>
          <div>
            SOC-2<br />Type II<br />*****
          </div>
        </Stamp>
        <Stamp>
          <div>
            IRS<br />e-File<br />Auth
          </div>
        </Stamp>
        <Stamp>
          <div>
            256-Bit<br />AES<br />Encryp
          </div>
        </Stamp>
        <Stamp>
          <div>
            GDPR<br />Ready<br />EU-US
          </div>
        </Stamp>
      </div>
      
      <div style={{ padding: '4rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>READY TO COMPUTE?</h2>
          <p style={{ color: 'var(--dim)', maxWidth: '300px' }}>Deploy Nominal to your financial stack today.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/docs')}
            style={{ 
              background: 'transparent', 
              border: '1px solid var(--dim)', 
              color: 'var(--dim)', 
              padding: '1rem 2rem', 
              fontFamily: 'var(--font-mono)', 
              textTransform: 'uppercase', 
              fontSize: '0.9rem', 
              cursor: 'pointer', 
              transition: 'all 0.2s' 
            }}
            onMouseEnter={(e) => { 
              e.target.style.background = 'var(--fg)'; 
              e.target.style.color = 'var(--bg)'; 
              e.target.style.boxShadow = '0 0 10px rgba(255,255,255,0.2)';
              e.target.style.borderColor = 'var(--fg)';
            }}
            onMouseLeave={(e) => { 
              e.target.style.background = 'transparent'; 
              e.target.style.color = 'var(--dim)'; 
              e.target.style.boxShadow = 'none';
              e.target.style.borderColor = 'var(--dim)';
            }}
          >
            Documentation
          </button>
          <button 
            onClick={() => navigate('/signup')}
            style={{ 
              background: 'transparent', 
              border: '1px solid var(--fg)', 
              color: 'var(--fg)', 
              padding: '1rem 2rem', 
              fontFamily: 'var(--font-mono)', 
              textTransform: 'uppercase', 
              fontSize: '0.9rem', 
              cursor: 'pointer', 
              transition: 'all 0.2s' 
            }}
            onMouseEnter={(e) => { 
              e.target.style.background = 'var(--fg)'; 
              e.target.style.color = 'var(--bg)'; 
              e.target.style.boxShadow = '0 0 10px rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => { 
              e.target.style.background = 'transparent'; 
              e.target.style.color = 'var(--fg)'; 
              e.target.style.boxShadow = 'none';
            }}
          >
            Create Account
          </button>
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid var(--border)', padding: '1rem', display: 'flex', justifyContent: 'space-between', color: 'var(--dim)', fontSize: '0.6rem' }}>
        <div>REF: IMAGE_METAMORPHIQUE_01</div>
        <div>©2024 NOMINAL SYSTEMS INC.</div>
      </div>
    </>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };
  
  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '500px', margin: '0 auto', minHeight: '70vh' }}>
      <h1 style={{ ...customStyles.h1, fontSize: '3rem', marginBottom: '3rem' }}>
        ACCESS<br />TERMINAL
      </h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--dim)' }}>
            EMAIL ADDRESS
          </label>
          <input 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: 'transparent', 
              border: '1px solid var(--border)', 
              color: 'var(--fg)', 
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem'
            }}
            placeholder="user@nominal.systems"
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--dim)' }}>
            PASSWORD
          </label>
          <input 
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: 'transparent', 
              border: '1px solid var(--border)', 
              color: 'var(--fg)', 
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem'
            }}
            placeholder="••••••••"
          />
        </div>
        
        <button 
          type="submit"
          style={{ 
            background: 'transparent', 
            border: '1px solid var(--fg)', 
            color: 'var(--fg)', 
            padding: '1rem 2rem', 
            fontFamily: 'var(--font-mono)', 
            textTransform: 'uppercase', 
            fontSize: '0.9rem', 
            cursor: 'pointer', 
            transition: 'all 0.2s',
            width: '100%'
          }}
          onMouseEnter={(e) => { 
            e.target.style.background = 'var(--fg)'; 
            e.target.style.color = 'var(--bg)'; 
          }}
          onMouseLeave={(e) => { 
            e.target.style.background = 'transparent'; 
            e.target.style.color = 'var(--fg)'; 
          }}
        >
          Initialize Login
        </button>
        
        <p style={{ marginTop: '2rem', color: 'var(--dim)', fontSize: '0.7rem', textAlign: 'center' }}>
          <Link to="/signup" style={{ color: 'var(--fg)', textDecoration: 'underline' }}>Create New Account</Link>
        </p>
      </form>
    </div>
  );
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', company: '', password: '' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };
  
  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '500px', margin: '0 auto', minHeight: '70vh' }}>
      <h1 style={{ ...customStyles.h1, fontSize: '3rem', marginBottom: '3rem' }}>
        CREATE<br />ACCOUNT
      </h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--dim)' }}>
            FULL NAME
          </label>
          <input 
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: 'transparent', 
              border: '1px solid var(--border)', 
              color: 'var(--fg)', 
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem'
            }}
            placeholder="Jane Smith"
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--dim)' }}>
            EMAIL ADDRESS
          </label>
          <input 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: 'transparent', 
              border: '1px solid var(--border)', 
              color: 'var(--fg)', 
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem'
            }}
            placeholder="jane@company.com"
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--dim)' }}>
            COMPANY NAME
          </label>
          <input 
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: 'transparent', 
              border: '1px solid var(--border)', 
              color: 'var(--fg)', 
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem'
            }}
            placeholder="Acme Corp"
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--dim)' }}>
            PASSWORD
          </label>
          <input 
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: 'transparent', 
              border: '1px solid var(--border)', 
              color: 'var(--fg)', 
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem'
            }}
            placeholder="••••••••"
          />
        </div>
        
        <button 
          type="submit"
          style={{ 
            background: 'transparent', 
            border: '1px solid var(--fg)', 
            color: 'var(--fg)', 
            padding: '1rem 2rem', 
            fontFamily: 'var(--font-mono)', 
            textTransform: 'uppercase', 
            fontSize: '0.9rem', 
            cursor: 'pointer', 
            transition: 'all 0.2s',
            width: '100%'
          }}
          onMouseEnter={(e) => { 
            e.target.style.background = 'var(--fg)'; 
            e.target.style.color = 'var(--bg)'; 
          }}
          onMouseLeave={(e) => { 
            e.target.style.background = 'transparent'; 
            e.target.style.color = 'var(--fg)'; 
          }}
        >
          Create Account
        </button>
        
        <p style={{ marginTop: '2rem', color: 'var(--dim)', fontSize: '0.7rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--fg)', textDecoration: 'underline' }}>Login</Link>
        </p>
      </form>
    </div>
  );
};

const DocsPage = () => {
  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '70vh' }}>
      <h1 style={{ ...customStyles.h1, fontSize: '3rem', marginBottom: '3rem' }}>
        SYSTEM<br />DOCUMENTATION
      </h1>
      
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem' }}>Quick Start</h2>
        <p style={{ color: 'var(--dim)', marginBottom: '1rem' }}>
          Integration with Nominal requires three simple steps:
        </p>
        <ol style={{ color: 'var(--dim)', paddingLeft: '2rem', lineHeight: '2' }}>
          <li>Connect your financial data source (CSV, QBO, or Plaid API)</li>
          <li>Configure deduction rules and tax jurisdictions</li>
          <li>Activate auto-filing for continuous compliance</li>
        </ol>
      </div>
      
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem' }}>API Reference</h2>
        <div style={{ background: '#0a0a0a', padding: '1rem', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
          <div style={{ color: 'var(--dim)' }}>POST /api/v1/ingest</div>
          <div style={{ color: 'var(--dim)' }}>GET /api/v1/filings/:id</div>
          <div style={{ color: 'var(--dim)' }}>PUT /api/v1/deductions</div>
        </div>
      </div>
      
      <div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem' }}>Support</h2>
        <p style={{ color: 'var(--dim)' }}>
          For technical assistance, contact support@nominal.systems
        </p>
      </div>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const styleContent = `
      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
      }
      
      @media (max-width: 768px) {
        header { grid-template-columns: 1fr 1fr !important; }
        header > div:nth-child(2) { display: none !important; }
        .hero-grid { grid-template-columns: 1fr !important; }
        .visual-container { height: 300px !important; border-left: none !important; border-top: 1px solid var(--border) !important; }
        h1 { font-size: 2.5rem !important; }
        .certifications { grid-template-columns: 1fr 1fr !important; justify-items: center !important; }
        .cta-section { flex-direction: column !important; align-items: flex-start !important; gap: 2rem !important; }
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = styleContent;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <Router basename="/">
      <div style={customStyles.root}>
        <div style={customStyles.body}>
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.02), transparent)', 
            pointerEvents: 'none', 
            animation: 'scanline 8s linear infinite', 
            zIndex: 10 
          }}></div>
          
          <div style={customStyles.container}>
            <Ticker />
            <Header />
            
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/docs" element={<DocsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;