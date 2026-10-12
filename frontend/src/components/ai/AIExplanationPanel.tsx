import React from 'react';
import { AIAnalysisResponse } from '../../types';
import { Card } from '../ui/Card';
import { Bot, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

interface AIExplanationPanelProps {
  analysis?: AIAnalysisResponse | any;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const AIExplanationPanel: React.FC<AIExplanationPanelProps> = ({ analysis, isLoading, onRefresh }) => {
  if (isLoading) {
    return (
      <Card className="border-blue-500/30 bg-slate-900/80 p-8 text-center">
        <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-3 animate-spin" />
        <h4 className="text-sm font-semibold text-slate-200">Synthesizing AI Threat Intelligence...</h4>
        <p className="text-xs text-slate-400 mt-1">Analyzing graph topology, credential exposure, and traversal paths.</p>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="border-slate-800 bg-slate-900/60 p-6 text-center">
        <Bot className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-xs text-slate-400">Run a simulation and click "Generate AI Explanation" to inspect automated defensive reasoning.</p>
      </Card>
    );
  }

  const isLocal = analysis.provider ? analysis.provider === 'local' : true;
  const weaknesses = analysis.security_weaknesses || analysis.security_weakness_analysis || [];
  const recommendations = analysis.recommendations || [];

  return (
    <Card className="border-blue-500/20 bg-slate-900/90 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-slate-100 text-base">AI Security Analyst Assessment</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={clsx(
            "text-[11px] font-mono px-2.5 py-0.5 rounded border font-semibold flex items-center gap-1",
            isLocal ? "bg-slate-800 text-cyan-300 border-cyan-500/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          )}>
            <Sparkles className="w-3 h-3" />
            AI Provider: {isLocal ? 'Local Simulation Engine' : 'OpenAI GPT-4o'}
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Regenerate
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-1">
        <div className="text-xs font-mono uppercase text-slate-400 font-semibold">Executive Threat Summary</div>
        <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          {analysis.summary || 'Attack simulation executed across virtual topology.'}
        </p>
      </div>

      {/* Path Explanation */}
      <div className="space-y-1">
        <div className="text-xs font-mono uppercase text-slate-400 font-semibold">Why This Attack Path Exists</div>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          {analysis.attack_path_explanation || analysis.affected_assets_analysis || 'Path traversed based on permitted network connectivity.'}
        </p>
      </div>

      {/* Weaknesses & Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {/* Identified Weaknesses */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase text-amber-400 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Identified Vulnerabilities & Weaknesses
          </div>
          <div className="space-y-1.5">
            {Array.isArray(weaknesses) && weaknesses.length > 0 ? (
              weaknesses.map((weakness: any, i: number) => (
                <div key={i} className="text-xs text-amber-200/90 bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-lg flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{typeof weakness === 'string' ? weakness : JSON.stringify(weakness)}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 p-2 bg-slate-950/40 rounded border border-slate-800">
                Overly permissive internal lateral trust edges detected.
              </div>
            )}
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase text-emerald-400 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Recommended Defensive Mitigations
          </div>
          <div className="space-y-1.5">
            {Array.isArray(recommendations) && recommendations.length > 0 ? (
              recommendations.map((rec: any, i: number) => (
                <div key={i} className="text-xs text-emerald-200/90 bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-lg flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{typeof rec === 'string' ? rec : rec.title || rec.description || JSON.stringify(rec)}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 p-2 bg-slate-950/40 rounded border border-slate-800">
                Apply network segmentation and strict access control policies.
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
