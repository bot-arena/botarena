import React, { useState, useEffect } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const [scanProgress, setScanProgress] = useState(33);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap');
      
      body {
        font-family: 'Roboto Mono', monospace;
        background-color: #d1d5db; 
      }
      
      .grid-lines {
        background-image: linear-gradient(to right, rgba(165, 42, 42, 0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(165, 42, 42, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
      }
      
      .offset-box {
        position: relative;
      }
      
      .offset-box:after {
        content: '';
        position: absolute;
        top: 4px;
        left: 4px;
        right: -4px;
        bottom: -4px;
        border: 1px solid #4a4a4a;
        background-color: #b45309; 
        z-index: -1;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const handleScanClick = () => {
    setScanProgress(0);
    setIsScanning(true);
  };

  const ScanView = () => (
    <>
      <div className="mt-4 relative">
        <div className="bg-[#1a1a1a] h-64 w-full relative overflow-hidden border-2 border-[#4a4a4a]">
          <div className="absolute inset-0 flex items-center justify-center text-[#eab308] opacity-80 uppercase text-xs tracking-wide">
            CAMERA VIEWFINDER
          </div>
          
          <div className="absolute inset-0 border border-[#eab308] border-opacity-30 flex">
            <div className="w-1/3 h-full border-r border-[#eab308] border-opacity-30"></div>
            <div className="w-1/3 h-full border-r border-[#eab308] border-opacity-30"></div>
            <div className="w-1/3 h-full"></div>
            <div className="absolute inset-0 flex flex-col">
              <div className="h-1/3 w-full border-b border-[#eab308] border-opacity-30"></div>
              <div className="h-1/3 w-full border-b border-[#eab308] border-opacity-30"></div>
              <div className="h-1/3 w-full"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-4 -right-2">
          <div className="offset-box bg-[#fefce8] border border-[#4a4a4a] p-2">
            <div className="uppercase text-[10px] font-bold tracking-wide text-[#b45309]">
              SCAN PROGRESS
            </div>
            <div className="w-32 h-2 mt-1 bg-[#d1d5db] border border-[#4a4a4a]">
              <div className="h-full bg-[#b45309] transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="uppercase text-xs font-bold tracking-wide mb-2 text-[#4a4a4a]">
          DETECTION RESULTS
        </div>
        
        <div className="offset-box bg-[#fefce8] border border-[#4a4a4a] p-3 mb-6">
          <div className="uppercase text-[10px] font-bold tracking-wide mb-1 text-[#b45309]">
            MOLD TYPES
          </div>
          <div className="text-[10px] leading-tight text-[#4a4a4a]">
            <div className="flex justify-between">
              <span>ASPERGILLUS</span>
              <span className="font-bold text-[#b45309]">67%</span>
            </div>
            <div className="flex justify-between">
              <span>CLADOSPORIUM</span>
              <span className="font-bold text-[#b45309]">12%</span>
            </div>
            <div className="flex justify-between">
              <span>STACHYBOTRYS</span>
              <span className="font-bold text-[#b45309]">0%</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="offset-box bg-[#fefce8] border border-[#4a4a4a] p-3">
            <div className="uppercase text-[10px] font-bold tracking-wide mb-1 text-[#4a4a4a]">
              HUMIDITY
            </div>
            <div className="text-[10px] leading-tight">
              <div className="flex justify-between">
                <span>CURRENT</span>
                <span className="text-[#b45309]">68%</span>
              </div>
              <div className="flex justify-between">
                <span>OPTIMAL</span>
                <span className="text-[#4a4a4a]">&lt; 60%</span>
              </div>
            </div>
          </div>
          
          <div className="offset-box bg-[#fefce8] border border-[#4a4a4a] p-3">
            <div className="uppercase text-[10px] font-bold tracking-wide mb-1 text-[#4a4a4a]">
              TEMPERATURE
            </div>
            <div className="text-[10px] leading-tight">
              <div className="flex justify-between">
                <span>CURRENT</span>
                <span className="text-[#b45309]">72°F</span>
              </div>
              <div className="flex justify-between">
                <span>OPTIMAL</span>
                <span className="text-[#4a4a4a]">68-72°F</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="uppercase text-xs font-bold tracking-wide mb-2 text-[#4a4a4a]">
          PREVIOUS SCANS
        </div>
        
        <div className="space-y-3">
          <div className="flex">
            <div className="w-1/3 bg-[#4a4a4a] text-[#eab308] text-[10px] uppercase p-2 border-r border-[#d1d5db]">
              BATHROOM
            </div>
            <div className="w-2/3 border border-[#4a4a4a] bg-[#e5e7eb] text-[10px] p-2">
              <div className="flex justify-between">
                <span>RISK LEVEL</span>
                <span className="text-[#b45309] font-bold">MEDIUM</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>DATE</span>
                <span>10/12/23</span>
              </div>
            </div>
          </div>
          
          <div className="flex">
            <div className="w-1/3 bg-[#4a4a4a] text-[#eab308] text-[10px] uppercase p-2 border-r border-[#d1d5db]">
              KITCHEN
            </div>
            <div className="w-2/3 border border-[#4a4a4a] bg-[#e5e7eb] text-[10px] p-2">
              <div className="flex justify-between">
                <span>RISK LEVEL</span>
                <span className="text-[#166534] font-bold">LOW</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>DATE</span>
                <span>10/10/23</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const HistoryView = () => (
    <div className="mt-4">
      <div className="uppercase text-xs font-bold tracking-wide mb-4 text-[#4a4a4a]">
        SCAN HISTORY
      </div>
      
      <div className="space-y-4">
        <div className="offset-box bg-[#fefce8] border border-[#4a4a4a] p-3">
          <div className="flex justify-between items-start mb-2">
            <div className="uppercase text-[10px] font-bold tracking-wide text-[#b45309]">
              BATHROOM
            </div>
            <div className="text-[10px] text-[#4a4a4a] opacity-70">
              10/12/23
            </div>
          </div>
          <div className="text-[10px] leading-tight text-[#4a4a4a]">
            <div className="flex justify-between">
              <span>RISK LEVEL</span>
              <span className="font-bold text-[#b45309]">MEDIUM</span>
            </div>
            <div className="flex justify-between">
              <span>ASPERGILLUS</span>
              <span className="text-[#b45309]">67%</span>
            </div>
            <div className="flex justify-between">
              <span>HUMIDITY</span>
              <span className="text-[#b45309]">68%</span>
            </div>
          </div>
        </div>

        <div className="offset-box bg-[#fefce8] border border-[#4a4a4a] p-3">
          <div className="flex justify-between items-start mb-2">
            <div className="uppercase text-[10px] font-bold tracking-wide text-[#b45309]">
              KITCHEN
            </div>
            <div className="text-[10px] text-[#4a4a4a] opacity-70">
              10/10/23
            </div>
          </div>
          <div className="text-[10px] leading-tight text-[#4a4a4a]">
            <div className="flex justify-between">
              <span>RISK LEVEL</span>
              <span className="font-bold text-[#166534]">LOW</span>
            </div>
            <div className="flex justify-between">
              <span>ASPERGILLUS</span>
              <span className="text-[#4a4a4a]">12%</span>
            </div>
            <div className="flex justify-between">
              <span>HUMIDITY</span>
              <span className="text-[#4a4a4a]">45%</span>
            </div>
          </div>
        </div>

        <div className="offset-box bg-[#fefce8] border border-[#4a4a4a] p-3">
          <div className="flex justify-between items-start mb-2">
            <div className="uppercase text-[10px] font-bold tracking-wide text-[#b45309]">
              BASEMENT
            </div>
            <div className="text-[10px] text-[#4a4a4a] opacity-70">
              10/08/23
            </div>
          </div>
          <div className="text-[10px] leading-tight text-[#4a4a4a]">
            <div className="flex justify-between">
              <span>RISK LEVEL</span>
              <span className="font-bold text-[#dc2626]">HIGH</span>
            </div>
            <div className="flex justify-between">
              <span>STACHYBOTRYS</span>
              <span className="text-[#dc2626]">45%</span>
            </div>
            <div className="flex justify-between">
              <span>HUMIDITY</span>
              <span className="text-[#dc2626]">82%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ReportView = () => (
    <div className="mt-4">
      <div className="uppercase text-xs font-bold tracking-wide mb-4 text-[#4a4a4a]">
        GENERATE REPORT
      </div>
      
      <div className="offset-box bg-[#fefce8] border border-[#4a4a4a] p-4 mb-4">
        <div className="uppercase text-[10px] font-bold tracking-wide mb-3 text-[#b45309]">
          REPORT OPTIONS
        </div>
        
        <div className="space-y-3 text-[10px]">
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" className="mr-2" defaultChecked />
            <span>INCLUDE ALL SCANS</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" className="mr-2" defaultChecked />
            <span>DETAILED ANALYSIS</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" className="mr-2" />
            <span>RECOMMENDATIONS</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" className="mr-2" />
            <span>PROFESSIONAL ASSESSMENT</span>
          </label>
        </div>
      </div>

      <div className="offset-box bg-[#fefce8] border border-[#4a4a4a] p-4 mb-4">
        <div className="uppercase text-[10px] font-bold tracking-wide mb-3 text-[#b45309]">
          REPORT FORMAT
        </div>
        
        <div className="space-y-2 text-[10px]">
          <label className="flex items-center cursor-pointer">
            <input type="radio" name="format" className="mr-2" defaultChecked />
            <span>PDF DOCUMENT</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input type="radio" name="format" className="mr-2" />
            <span>EMAIL SUMMARY</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input type="radio" name="format" className="mr-2" />
            <span>PRINT FRIENDLY</span>
          </label>
        </div>
      </div>

      <button className="w-full offset-box bg-[#b45309] text-[#fefce8] border border-[#4a4a4a] p-4 uppercase text-xs font-bold tracking-wide hover:bg-[#92400e] transition-colors">
        GENERATE REPORT
      </button>

      <div className="mt-6 offset-box bg-[#e5e7eb] border border-[#4a4a4a] p-3">
        <div className="uppercase text-[10px] font-bold tracking-wide mb-2 text-[#4a4a4a]">
          RECENT REPORTS
        </div>
        <div className="text-[10px] space-y-2">
          <div className="flex justify-between items-center py-1 border-b border-[#4a4a4a] border-opacity-20">
            <span>FULL_REPORT_10_12_23.PDF</span>
            <span className="text-[#b45309] cursor-pointer hover:underline">VIEW</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span>SUMMARY_10_10_23.PDF</span>
            <span className="text-[#b45309] cursor-pointer hover:underline">VIEW</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#d1d5db]">
      <div className="relative min-h-screen grid-lines text-[#2d2d2d]">
        <header className="fixed top-0 left-0 right-0 bg-[#e5e7eb] z-10">
          <div className="px-4 py-3 border-b-2 border-[#4a4a4a] flex justify-between items-center">
            <div className="uppercase text-xs font-bold tracking-wide text-[#b45309]">
              FUNGISCAN
            </div>
            <div className="uppercase text-xs font-bold tracking-wide text-[#4a4a4a]">
              {activeTab === 'scan' ? 'SCAN MODE' : activeTab === 'history' ? 'HISTORY' : 'REPORT'}
            </div>
          </div>
        </header>

        <main className="pt-12 pb-24 px-4">
          {activeTab === 'scan' && <ScanView />}
          {activeTab === 'history' && <HistoryView />}
          {activeTab === 'report' && <ReportView />}
        </main>

        <footer className="fixed bottom-0 left-0 right-0 bg-[#e5e7eb] border-t-2 border-[#4a4a4a]">
          <div className="grid grid-cols-3 uppercase text-[10px] font-bold tracking-wide">
            <button 
              onClick={() => {
                setActiveTab('scan');
                handleScanClick();
              }}
              className={`py-4 border-r border-[#4a4a4a] flex flex-col items-center ${activeTab === 'scan' ? 'bg-[#fefce8] text-[#b45309]' : 'hover:bg-[#d1d5db]'}`}
            >
              <span>SCAN</span>
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`py-4 border-r border-[#4a4a4a] flex flex-col items-center ${activeTab === 'history' ? 'bg-[#fefce8] text-[#b45309]' : 'hover:bg-[#d1d5db]'}`}
            >
              <span>HISTORY</span>
            </button>
            <button 
              onClick={() => setActiveTab('report')}
              className={`py-4 flex flex-col items-center ${activeTab === 'report' ? 'bg-[#fefce8] text-[#b45309]' : 'hover:bg-[#d1d5db]'}`}
            >
              <span>REPORT</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;