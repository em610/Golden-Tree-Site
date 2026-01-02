
import React, { useState, useEffect } from 'react';
import { googleDriveService } from '../services/googleDriveService';
import { DriveFile } from '../types';

interface GoogleDrivePickerProps {
  onFileSelected: (file: DriveFile) => void;
  onClose: () => void;
}

const GoogleDrivePicker: React.FC<GoogleDrivePickerProps> = ({ onFileSelected, onClose }) => {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    handleConnect();
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    const success = await googleDriveService.authenticate();
    if (success) {
      setAuthenticated(true);
      const driveFiles = await googleDriveService.listFiles();
      setFiles(driveFiles);
    }
    setLoading(false);
  };

  const getIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return 'fa-file-pdf text-red-500';
    if (mimeType.includes('spreadsheet') || mimeType.includes('csv')) return 'fa-file-excel text-emerald-500';
    if (mimeType.includes('text')) return 'fa-file-lines text-cyan-500';
    return 'fa-file text-slate-600';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      {/* Background HUD decorative lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="h-px w-full bg-cyan-500 absolute top-1/4"></div>
         <div className="h-px w-full bg-cyan-500 absolute top-3/4"></div>
         <div className="w-px h-full bg-cyan-500 absolute left-1/4"></div>
         <div className="w-px h-full bg-cyan-500 absolute left-3/4"></div>
      </div>

      <div className="cyber-panel w-full max-w-2xl border-cyan-500/30 overflow-hidden flex flex-col max-h-[85vh] relative">
        <div className="px-8 py-6 border-b border-cyan-500/20 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-4">
            <i className="fab fa-google-drive text-2xl text-cyan-500"></i>
            <div>
               <h3 className="font-bold text-cyan-400 mono text-sm tracking-widest">GDRIVE_ACCESS_PROTOCOL</h3>
               <p className="text-[8px] mono text-cyan-900 uppercase">Authenticated_Uplink: ACTIVE</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cyan-900 hover:text-cyan-500 transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-black/20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
              <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
              <p className="text-cyan-900 font-bold mono text-[10px] tracking-widest uppercase animate-pulse">Scanning_Cloud_Sectors...</p>
            </div>
          ) : !authenticated ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <i className="fas fa-lock text-5xl text-slate-800 mb-8"></i>
              <p className="text-slate-500 mb-10 mono text-xs uppercase tracking-widest">ACCESS_DENIED: AUTH_REQUIRED</p>
              <button 
                onClick={handleConnect}
                className="bg-cyan-500/10 border border-cyan-500 text-cyan-400 px-10 py-3 font-bold mono text-xs hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_15px_rgba(0,243,255,0.2)]"
              >
                INITIALIZE_AUTH
              </button>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-24">
              <i className="fas fa-search-minus text-5xl text-slate-800 mb-6"></i>
              <p className="text-cyan-900 mono text-xs uppercase">ZERO_RESULTS_IN_SPECIFIED_ARCHIVE</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => onFileSelected(file)}
                  className="w-full flex items-center gap-6 p-5 border border-cyan-500/10 bg-slate-900/40 hover:border-cyan-500 hover:bg-cyan-500/5 transition-all text-left group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-950 group-hover:bg-cyan-500 transition-colors"></div>
                  <div className="w-12 h-12 border border-slate-800 bg-black/40 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors shadow-inner">
                    <i className={`fas ${getIcon(file.mimeType)} text-xl opacity-60 group-hover:opacity-100`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-300 mono text-xs truncate group-hover:text-cyan-400 uppercase tracking-tighter">{file.name}</p>
                    <p className="text-[8px] mono text-slate-600 mt-1 uppercase">
                      MOD: {new Date(file.modifiedTime).toLocaleDateString()} // SIZE: {file.size || 'UNKNOWN'}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                     <i className="fas fa-chevron-right text-cyan-500 text-xs"></i>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-8 py-4 bg-black/60 border-t border-cyan-500/20 flex justify-between items-center">
          <p className="text-[8px] text-cyan-900 font-bold mono uppercase">Filter: construction_only // mode: read_only</p>
          <button onClick={onClose} className="text-xs text-slate-500 mono font-bold hover:text-cyan-500 transition-colors uppercase tracking-widest">
            TERMINATE_SESSION
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleDrivePicker;
