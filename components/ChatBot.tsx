
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '> BuildSense_AI Uplink Established.\n> Analyzing project telemetry...\n> Ready for strategic advisement.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `> USER_INQUIRY: ${input}`,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
      
      const response = await geminiService.getChatResponse(input, history);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `> ADVISOR_LOG: ${response || 'ERR_NULL_RESPONSE'}`,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col cyber-panel border border-cyan-500/20 overflow-hidden relative">
      {/* Glitch Overlay */}
      <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none opacity-20"></div>

      <div className="p-6 border-b border-cyan-500/20 flex items-center justify-between bg-black/40 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-cyan-500 flex items-center justify-center text-cyan-400 bg-cyan-500/10 shadow-[0_0_10px_rgba(0,243,255,0.2)]">
            <i className="fas fa-satellite-dish animate-pulse"></i>
          </div>
          <div>
            <p className="font-bold text-cyan-400 text-xs mono tracking-widest">COMMS_LINK_V4.9</p>
            <p className="text-[9px] text-emerald-500 mono flex items-center gap-1 uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              Neural_Core_Active
            </p>
          </div>
        </div>
        <div className="text-right">
           <p className="text-[9px] mono text-cyan-800 uppercase">SIGNAL_STRENGTH</p>
           <div className="flex gap-0.5 mt-1">
              {[1,2,3,4,5].map(i => <div key={i} className={`h-2 w-1 ${i <= 4 ? 'bg-cyan-500' : 'bg-slate-800'}`}></div>)}
           </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6 z-10 mono">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 border ${
              msg.role === 'user' 
                ? 'border-cyan-500/30 bg-cyan-500/5 text-cyan-100' 
                : 'border-slate-700 bg-slate-900/40 text-slate-300'
            } shadow-inner`}>
              <div className="flex justify-between items-center mb-3">
                 <span className={`text-[9px] font-bold tracking-tighter ${msg.role === 'user' ? 'text-cyan-500' : 'text-slate-500'}`}>
                   {msg.role === 'user' ? 'LOCAL_HOST' : 'REMOTE_AI'}
                 </span>
                 <span className="text-[8px] text-slate-600">
                   {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                 </span>
              </div>
              <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="border border-cyan-500/30 bg-cyan-500/5 p-4 flex flex-col gap-3">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 animate-ping"></div>
                  <span className="text-[10px] text-cyan-400 mono animate-pulse">DECRYPTING_NEURAL_STREAMS...</span>
               </div>
               <div className="h-1 w-48 bg-slate-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-500 animate-[loading_1.5s_infinite]"></div>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-cyan-500/20 bg-black/60 z-10">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type command or query..."
            className="w-full bg-slate-900/50 border border-cyan-500/20 rounded-none px-6 py-4 pr-16 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all resize-none h-20 text-xs mono text-cyan-300 placeholder:text-cyan-900"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-4 bottom-4 w-10 h-10 bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-all group-hover:border-cyan-500"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className="mt-3 flex justify-between items-center text-[8px] mono text-cyan-900 uppercase">
           <span>ENCRYPTION: AES-256-GCM</span>
           <span>LATENCY: 14MS</span>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
