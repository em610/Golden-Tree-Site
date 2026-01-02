
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import GoogleDrivePicker from './GoogleDrivePicker';
import { googleDriveService } from '../services/googleDriveService';
import { DriveFile, DetailedAnalysis } from '../types';

const Analysis: React.FC = () => {
  const [file, setFile] = useState<{ name: string; id?: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetailedAnalysis | null>(null);
  const [showDrivePicker, setShowDrivePicker] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile({ name: e.target.files[0].name.toUpperCase() });
      setResult(null);
    }
  };

  const handleDriveFileSelected = (driveFile: DriveFile) => {
    setFile({ name: driveFile.name.toUpperCase(), id: driveFile.id });
    setShowDrivePicker(false);
    setResult(null);
  };

  const runAnalysis = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      if (file.id) {
        const driveData = await googleDriveService.getFileContent(file.id);
        const analysis = await geminiService.analyzeConstructionDoc(driveData.content, driveData.name, driveData.mimeType);
        setResult(analysis);
      } else {
        const fileInput = document.getElementById('construction-upload') as HTMLInputElement;
        const localFile = fileInput?.files?.[0];
        if (localFile) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const content = e.target?.result as string;
            const analysis = await geminiService.analyzeConstructionDoc(content, localFile.name, localFile.type);
            setResult(analysis);
            setIsAnalyzing(false);
          };
          reader.readAsText(localFile);
          return;
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      if (file.id) setIsAnalyzing(false);
    }
  };

  const getLoopColor = (status: string) => {
    if (status === 'OPTIMAL') return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
    if (status === 'CRITICAL') return 'text-red-400 border-red-500/30 bg-red-500/5';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {showDrivePicker && (
        <GoogleDrivePicker 
          onFileSelected={handleDriveFileSelected} 
          onClose={() => setShowDrivePicker(false)} 
        />
      )}

      <div className="lg:col-span-1 space-y-6">
        <div className="cyber-panel p-6 border border-cyan-500/20">
          <h3 className="text-xs font-bold mb-6 text-cyan-400 mono tracking-[0.3em] uppercase flex items-center gap-2">
             <i className="fas fa-microchip"></i> INGESTION_SEQUENCE
          </h3>
          
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setShowDrivePicker(true)}
              className="flex-1 flex flex-col items-center justify-center p-5 border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500 transition-all group"
            >
              <i className="fab fa-google-drive text-xl text-cyan-700 group-hover:text-cyan-400 mb-2"></i>
              <span className="text-[9px] font-bold text-cyan-800 group-hover:text-cyan-500 mono">VAULT_UPLINK</span>
            </button>
            <button 
              onClick={() => document.getElementById('construction-upload')?.click()}
              className="flex-1 flex flex-col items-center justify-center p-5 border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500 transition-all group"
            >
              <i className="fas fa-hard-drive text-xl text-cyan-700 group-hover:text-cyan-400 mb-2"></i>
              <span className="text-[9px] font-bold text-cyan-800 group-hover:text-cyan-500 mono">LOCAL_READ</span>
            </button>
          </div>

          <div className="p-5 bg-black/60 border border-cyan-500/10 mb-8 relative">
             <p className="text-[9px] text-cyan-800 font-bold uppercase tracking-widest mb-3 mono">TARGET_SOURCE</p>
             <div className="flex items-center gap-3">
               <i className={`fas ${file ? 'fa-circle-check text-cyan-400 animate-pulse' : 'fa-circle-dot text-slate-800'} text-xs`}></i>
               <span className="text-[11px] font-bold text-slate-400 truncate mono uppercase">
                 {file ? file.name : 'WAITING_...'}
               </span>
             </div>
          </div>

          <input type="file" className="hidden" id="construction-upload" onChange={handleFileChange} accept=".txt,.csv,.json,.pdf" />

          <button
            onClick={runAnalysis}
            disabled={!file || isAnalyzing}
            className="w-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 py-4 font-bold text-xs mono tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            {isAnalyzing ? (
              <><i className="fas fa-spinner fa-spin"></i> NEURAL_MAPPING_...</>
            ) : (
              <><i className="fas fa-bolt"></i> EXECUTE_SITE_SCAN</>
            )}
          </button>
        </div>

        {result && (
          <div className="cyber-panel p-6 border-cyan-500/20 bg-cyan-500/5">
             <h4 className="text-[10px] mono text-cyan-400 font-bold uppercase tracking-[0.2em] mb-4">LUXURY_COMPLIANCE_SCORE</h4>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-cyan-500/20 bg-black/40">
                   <p className="text-[8px] text-cyan-800 mono">MOCKUP_STATUS</p>
                   <p className="text-[10px] font-bold text-cyan-400 mt-1 mono">{result.luxuryCompliance.mockupStatus}</p>
                </div>
                <div className="p-3 border border-cyan-500/20 bg-black/40">
                   <p className="text-[8px] text-cyan-800 mono">HOLD_POINTS</p>
                   <p className="text-[10px] font-bold text-amber-500 mt-1 mono">{result.luxuryCompliance.holdPointsDetected.length} DETECTED</p>
                </div>
             </div>
             {result.luxuryCompliance.protectionWarning && (
                <div className="mt-4 p-3 border border-amber-500/30 bg-amber-500/5 text-amber-500 text-[10px] mono animate-pulse">
                   <i className="fas fa-exclamation-triangle mr-2"></i>
                   {result.luxuryCompliance.protectionWarning}
                </div>
             )}
          </div>
        )}
      </div>

      <div className="lg:col-span-2">
        {!result && !isAnalyzing ? (
          <div className="h-full flex flex-col items-center justify-center p-12 cyber-panel border border-cyan-500/10 border-dashed relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-20"></div>
            <div className="w-20 h-20 border border-cyan-500/20 flex items-center justify-center mb-8">
               <i className="fas fa-building-circle-check text-4xl text-cyan-900"></i>
            </div>
            <h3 className="text-sm font-bold text-cyan-700 mono tracking-[0.3em] uppercase">SYSTEM_READY_FOR_TELEMETRY</h3>
            <p className="max-w-md text-slate-700 mt-4 text-center text-[10px] mono leading-loose uppercase">
              PROVIDE DOCUMENTATION TO TRIGGER THE 6-LOOP INDUSTRIAL SITE CONTROL ANALYSIS.
            </p>
          </div>
        ) : isAnalyzing ? (
          <div className="h-full flex flex-col items-center justify-center p-12 cyber-panel bg-black relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_#00f3ff] animate-[scan_3s_ease-in-out_infinite] z-20"></div>
             <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
                <div className="absolute inset-0 border border-cyan-500/20 rounded-full border-dashed animate-spin"></div>
                <i className="fas fa-microchip text-4xl text-cyan-500 animate-pulse"></i>
             </div>
             <h3 className="text-sm font-bold text-cyan-400 mono tracking-[0.5em] uppercase">EXTRAPOLATING_RISK_VECTORS</h3>
             <p className="text-slate-600 mt-4 text-center text-[10px] mono animate-pulse">MAPPING SCOPE ↔ QUALITY ↔ SCHEDULE ↔ COST</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="cyber-panel p-10 border border-cyan-500/20 relative">
              <div className="flex justify-between items-start mb-10 border-b border-cyan-500/10 pb-8">
                <div>
                  <h2 className="text-xl font-bold text-cyan-400 tracking-widest mono">SITE_INTELLIGENCE_MANIFEST</h2>
                  <p className="text-[9px] text-cyan-900 mono mt-1">ENGINE: NEURAL_GEN_3_PRO // REVISION: LUX_2049</p>
                </div>
                <div className="text-right">
                  <div className="bg-cyan-500 text-black px-4 py-1 text-[10px] font-bold mono shadow-[0_0_15px_#00f3ff]">SYSTEM_VERIFIED</div>
                  <p className="text-[8px] mono text-cyan-800 mt-1 uppercase">Confidence: 98.4%</p>
                </div>
              </div>

              <div className="mb-10">
                <p className="text-slate-400 leading-relaxed border-l-2 border-cyan-500/30 pl-8 py-4 bg-cyan-500/5 italic text-sm mono tracking-tight">
                  {result.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {result.loops.map((loop, i) => (
                  <div key={i} className={`p-5 border transition-all ${getLoopColor(loop.status)}`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold mono tracking-[0.2em]">{loop.loop.toUpperCase()}_LOOP</span>
                      <span className="text-[8px] mono font-bold">[{loop.status}]</span>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {loop.findings.map((f, idx) => (
                        <li key={idx} className="text-[10px] mono opacity-80 flex gap-2">
                           <span className="text-cyan-500">→</span> {f}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-3 border-t border-current opacity-30">
                       <p className="text-[9px] mono font-bold"><span className="opacity-50">RECOMMENDATION:</span> {loop.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-cyan-500/10">
                <h3 className="text-[10px] font-bold text-red-500 mono uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <i className="fas fa-radiation animate-pulse"></i> CRITICAL_VULNERABILITIES
                </h3>
                <div className="space-y-4">
                   {result.risks.map((risk, i) => (
                      <div key={i} className="p-4 bg-red-500/5 border border-red-500/20 flex justify-between items-center">
                         <div className="max-w-[70%]">
                            <p className="text-xs font-bold text-slate-100 mono mb-1">{risk.description}</p>
                            <p className="text-[9px] text-slate-500 mono uppercase">MITIGATION: {risk.mitigation}</p>
                         </div>
                         <div className="px-3 py-1 border border-red-500 text-red-500 text-[8px] mono font-bold">{risk.severity}</div>
                      </div>
                   ))}
                </div>
              </div>
              
              <div className="mt-12 flex justify-between items-center text-[8px] mono text-cyan-900 tracking-widest uppercase">
                <span>BUILDSENSE_CORE // DATA_VERITY: 1.0</span>
                <button className="text-cyan-600 hover:text-cyan-400">DOWNLOAD_TELEMETRY_STREAM <i className="fas fa-download ml-2"></i></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
