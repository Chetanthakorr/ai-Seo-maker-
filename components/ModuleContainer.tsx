import React, { useState } from 'react';
import { ModuleType, AnalysisResult } from '../types';
import { runAnalysis } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ArrowRight, Loader2, Link2 } from 'lucide-react';

interface InputField {
  name: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'textarea' | 'url';
}

interface ModuleContainerProps {
  module: ModuleType;
  title: string;
  description: string;
  inputs: InputField[];
}

export const ModuleContainer: React.FC<ModuleContainerProps> = ({ module, title, description, inputs }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [streamText, setStreamText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setStreamText("");

    try {
      const finalResult = await runAnalysis(module, formData, (text) => {
        setStreamText(text);
      });
      setResult(finalResult);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const displayContent = loading ? streamText : (result?.markdown || streamText);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400 text-lg">{description}</p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
        <div className="grid gap-6 md:grid-cols-2">
          {inputs.map((field) => (
            <div key={field.name} className={`${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-32"
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-8 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Analyzing...
              </>
            ) : (
              <>
                Generate Report
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-800 text-red-300 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Results Area */}
      {(displayContent) && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
               <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                 <span className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 ${!loading ? 'hidden' : ''}`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${loading ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                  </span>
                 Analysis Report
               </h3>
               {loading && <span className="text-xs text-slate-500 animate-pulse">Streaming from Gemini...</span>}
            </div>
            
            <MarkdownRenderer content={displayContent} />
          </div>

          {/* Grounding Sources */}
          {result?.groundingSources && result.groundingSources.length > 0 && (
             <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
               <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Link2 className="w-4 h-4" />
                 Sources Used
               </h4>
               <div className="grid gap-3 sm:grid-cols-2">
                 {result.groundingSources.map((source, idx) => (
                   <a 
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 p-3 rounded-lg bg-slate-950 hover:bg-slate-800 transition-colors border border-slate-800 group"
                   >
                     <div className="min-w-[4px] h-full bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                     <span className="text-sm text-blue-300 hover:underline truncate block w-full">
                       {source.title || source.uri}
                     </span>
                   </a>
                 ))}
               </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
};
