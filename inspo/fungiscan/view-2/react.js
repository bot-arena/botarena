import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const customStyles = {
  gridLines: {
    backgroundImage: `linear-gradient(to right, rgba(165, 42, 42, 0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(165, 42, 42, 0.1) 1px, transparent 1px)`,
    backgroundSize: '20px 20px'
  }
};

const FilterTag = ({ children, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`border border-[#4a4a4a] px-[6px] py-[2px] text-[9px] uppercase ${
        active ? 'bg-[#4a4a4a] text-[#eab308]' : 'bg-[#e5e7eb] text-[#2d2d2d]'
      }`}
    >
      {children}
    </button>
  );
};

const ScanCard = ({ location, date, threatLevel, percentage, opacity }) => {
  const getThreatColor = (level) => {
    if (level === 'CRITICAL') return 'text-red-700';
    if (level === 'MEDIUM') return 'text-[#b45309]';
    return 'text-[#166534]';
  };

  const getThreatBgColor = (level) => {
    if (level === 'CRITICAL') return 'bg-red-700';
    if (level === 'MEDIUM') return 'bg-[#b45309]';
    return 'bg-[#166534]';
  };

  const offsetBoxStyle = {
    position: 'relative'
  };

  const offsetBoxAfterRef = React.useRef(null);

  useEffect(() => {
    if (offsetBoxAfterRef.current) {
      const after = document.createElement('div');
      after.style.cssText = `
        content: '';
        position: absolute;
        top: 4px;
        left: 4px;
        right: -4px;
        bottom: -4px;
        border: 1px solid #4a4a4a;
        background-color: #b45309;
        z-index: -1;
        pointer-events: none;
      `;
      offsetBoxAfterRef.current.appendChild(after);
      return () => {
        if (offsetBoxAfterRef.current && offsetBoxAfterRef.current.contains(after)) {
          offsetBoxAfterRef.current.removeChild(after);
        }
      };
    }
  }, []);

  return (
    <div
      ref={offsetBoxAfterRef}
      style={offsetBoxStyle}
      className={`bg-[#fefce8] border border-[#4a4a4a] p-3 ${opacity ? 'opacity-60' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="uppercase text-[10px] font-bold text-[#b45309]">LOCATION</div>
          <div className="text-xs font-bold">{location}</div>
        </div>
        <div className="text-right">
          <div className="uppercase text-[10px] font-bold text-[#4a4a4a]">DATE</div>
          <div className="text-[10px]">{date}</div>
        </div>
      </div>
      <div className="border-t border-[#4a4a4a] pt-2 mt-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase font-bold text-[#4a4a4a]">THREAT_LEVEL:</span>
          <span className={`text-[10px] font-bold ${getThreatColor(threatLevel)}`}>
            {threatLevel} [{percentage}%]
          </span>
        </div>
        <div className="w-full h-1 bg-[#d1d5db] mt-1">
          <div className={`h-full ${getThreatBgColor(threatLevel)}`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#e5e7eb] z-10">
      <div className="px-4 py-3 border-b-2 border-[#4a4a4a] flex justify-between items-center">
        <div className="uppercase text-xs font-bold tracking-wide text-[#b45309]">
          FUNGISCAN
        </div>
        <div className="uppercase text-xs font-bold tracking-wide text-[#4a4a4a]">
          ARCHIVE_v1.0
        </div>
      </div>
    </header>
  );
};

const Footer = ({ activeTab }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#e5e7eb] border-t-2 border-[#4a4a4a] z-10">
      <div className="grid grid-cols-3 uppercase text-[10px] font-bold tracking-wide">
        <Link
          to="/scan"
          className={`py-4 border-r border-[#4a4a4a] flex flex-col items-center hover:bg-[#d1d5db] ${
            activeTab === 'scan' ? 'bg-[#fefce8] text-[#b45309]' : ''
          }`}
        >
          <span>SCAN</span>
        </Link>
        <Link
          to="/"
          className={`py-4 border-r border-[#4a4a4a] flex flex-col items-center hover:bg-[#d1d5db] ${
            activeTab === 'history' ? 'bg-[#fefce8] text-[#b45309]' : ''
          }`}
        >
          <span>HISTORY</span>
        </Link>
        <Link
          to="/report"
          className={`py-4 flex flex-col items-center hover:bg-[#d1d5db] ${
            activeTab === 'report' ? 'bg-[#fefce8] text-[#b45309]' : ''
          }`}
        >
          <span>REPORT</span>
        </Link>
      </div>
    </footer>
  );
};

const HistoryPage = () => {
  const [activeFilter, setActiveFilter] = useState('ALL SCANS');
  const [scans, setScans] = useState([
    { id: 1, location: 'BATHROOM_PRIMARY', date: '10/12/23', threatLevel: 'MEDIUM', percentage: 67 },
    { id: 2, location: 'KITCHEN_SINK', date: '10/10/23', threatLevel: 'LOW', percentage: 12 },
    { id: 3, location: 'BASEMENT_STORAGE', date: '10/05/23', threatLevel: 'CRITICAL', percentage: 92 },
    { id: 4, location: 'ATTIC_EAST', date: '09/28/23', threatLevel: 'SAFE', percentage: 5, opacity: true }
  ]);

  const filters = ['ALL SCANS', 'HIGH RISK', 'BATHROOM', 'KITCHEN', 'BASEMENT', 'LATEST 30D'];

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleLoadOlder = () => {
    const newScans = [
      { id: scans.length + 1, location: 'GARAGE_WEST', date: '09/20/23', threatLevel: 'LOW', percentage: 8, opacity: true },
      { id: scans.length + 2, location: 'LAUNDRY_ROOM', date: '09/15/23', threatLevel: 'MEDIUM', percentage: 45, opacity: true }
    ];
    setScans([...scans, ...newScans]);
  };

  return (
    <div className="relative min-h-screen text-[#2d2d2d] flex flex-col bg-[#d1d5db]" style={customStyles.gridLines}>
      <Header />

      <main className="pt-16 pb-24 px-4 flex-1">
        <div className="mb-6">
          <div className="uppercase text-xs font-bold tracking-wide mb-3 text-[#4a4a4a]">
            FILTER_PARAMETERS
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <FilterTag
                key={filter}
                active={activeFilter === filter}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </FilterTag>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {scans.map((scan) => (
            <ScanCard
              key={scan.id}
              location={scan.location}
              date={scan.date}
              threatLevel={scan.threatLevel}
              percentage={scan.percentage}
              opacity={scan.opacity}
            />
          ))}
        </div>

        <div className="mt-8 mb-4 flex justify-center">
          <button
            onClick={handleLoadOlder}
            className="border border-[#4a4a4a] bg-[#e5e7eb] px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-[#d1d5db]"
          >
            LOAD_OLDER_RECORDS
          </button>
        </div>
      </main>

      <Footer activeTab="history" />
    </div>
  );
};

const ScanPage = () => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScan = () => {
    setScanning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="relative min-h-screen text-[#2d2d2d] flex flex-col bg-[#d1d5db]" style={customStyles.gridLines}>
      <Header />

      <main className="pt-16 pb-24 px-4 flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <div className="uppercase text-xl font-bold tracking-wide text-[#b45309] mb-4">
            SCAN_INTERFACE
          </div>
          <div className="text-xs text-[#4a4a4a]">
            INITIATE NEW FUNGAL SCAN
          </div>
        </div>

        <button
          onClick={handleScan}
          disabled={scanning}
          className="border-2 border-[#4a4a4a] bg-[#e5e7eb] px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#d1d5db] disabled:opacity-50"
        >
          {scanning ? 'SCANNING...' : 'START_SCAN'}
        </button>

        {scanning && (
          <div className="mt-8 w-full max-w-xs">
            <div className="w-full h-2 bg-[#e5e7eb] border border-[#4a4a4a]">
              <div
                className="h-full bg-[#b45309] transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-center mt-2 text-xs font-bold text-[#4a4a4a]">
              PROGRESS: {progress}%
            </div>
          </div>
        )}

        {progress === 100 && !scanning && (
          <div className="mt-4 text-center text-xs font-bold text-[#166534]">
            SCAN_COMPLETE
          </div>
        )}
      </main>

      <Footer activeTab="scan" />
    </div>
  );
};

const ReportPage = () => {
  return (
    <div className="relative min-h-screen text-[#2d2d2d] flex flex-col bg-[#d1d5db]" style={customStyles.gridLines}>
      <Header />

      <main className="pt-16 pb-24 px-4 flex-1">
        <div className="text-center mb-8">
          <div className="uppercase text-xl font-bold tracking-wide text-[#b45309] mb-4">
            REPORT_GENERATOR
          </div>
          <div className="text-xs text-[#4a4a4a]">
            GENERATE COMPREHENSIVE ANALYSIS
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-[#4a4a4a] bg-[#e5e7eb] p-4">
            <div className="uppercase text-[10px] font-bold text-[#4a4a4a] mb-2">
              REPORT_TYPE
            </div>
            <select className="w-full border border-[#4a4a4a] bg-[#fefce8] px-3 py-2 text-xs font-bold">
              <option>FULL_ANALYSIS</option>
              <option>THREAT_SUMMARY</option>
              <option>LOCATION_BREAKDOWN</option>
            </select>
          </div>

          <div className="border border-[#4a4a4a] bg-[#e5e7eb] p-4">
            <div className="uppercase text-[10px] font-bold text-[#4a4a4a] mb-2">
              TIME_RANGE
            </div>
            <select className="w-full border border-[#4a4a4a] bg-[#fefce8] px-3 py-2 text-xs font-bold">
              <option>LAST_7_DAYS</option>
              <option>LAST_30_DAYS</option>
              <option>LAST_90_DAYS</option>
              <option>ALL_TIME</option>
            </select>
          </div>

          <button className="w-full border-2 border-[#4a4a4a] bg-[#b45309] text-[#fefce8] px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#92400e]">
            GENERATE_REPORT
          </button>
        </div>
      </main>

      <Footer activeTab="report" />
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap');
      body {
        font-family: 'Roboto Mono', monospace;
        background-color: #d1d5db;
        margin: 0;
        padding: 0;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<HistoryPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </Router>
  );
};

export default App;