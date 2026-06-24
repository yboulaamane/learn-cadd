"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Terminal, Play } from "lucide-react";

interface CollapsibleCodeProps {
  code: string;
  title?: string;
}

function highlightCode(code: string): string {
  // Escape HTML entities to prevent rendering tags
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Tokenizer pattern for Comments, Strings, Keywords, Libraries/APIs, and Numbers
  const tokenRegex = /(#.*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b(?:def|return|if|else|for|in|from|import|print|as|list|len|sorted|max|gmx|grompp|mdrun|trjconv|mpirun|gmx_mpi)\b)|(\b(?:Chem|AllChem|inchi|Recap|BRICS|DataStructs|np|shap|RandomForestClassifier|TreeExplainer|StereoEnumerationOptions|EnumerateStereoisomers|TautomerEnumerator|Uncharger|FragmentParent|IsotopeParent|Canonicalize|GetMorganFingerprintAsBitVect|BulkTanimotoSimilarity)\b)|(\b\d+(?:\.\d+)?\b)/g;

  html = html.replace(tokenRegex, (match, comment, string, keyword, library, number) => {
    if (comment) {
      // Classic readable dark green for comments
      return `<span class="text-emerald-800 font-normal italic">${comment}</span>`;
    }
    if (string) {
      // Warm dark amber for strings
      return `<span class="text-amber-800 font-medium">${string}</span>`;
    }
    if (keyword) {
      // Classic bold blue for coding keywords
      return `<span class="text-blue-700 font-bold">${keyword}</span>`;
    }
    if (library) {
      // Distinct bold teal for classes/modules
      return `<span class="text-teal-700 font-bold">${library}</span>`;
    }
    if (number) {
      // Indigo for numeric values
      return `<span class="text-indigo-650 font-semibold">${number}</span>`;
    }
    return match;
  });

  return html;
}

export function CollapsibleCode({ code, title = "Python Programming Guide" }: CollapsibleCodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const highlighted = highlightCode(code);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden my-4 bg-white shadow-sm transition-all duration-150">
      <div className="flex items-center justify-between p-3.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-slate-600" />
          <span className="font-bold text-xs text-slate-800">{title}</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-all cursor-pointer"
        >
          {isOpen ? (
            <>
              <span>Hide Code Details</span>
              <ChevronUp size={14} className="text-slate-500" />
            </>
          ) : (
            <>
              <Play size={10} className="text-emerald-600 fill-emerald-600" />
              <span>Show Code Implementation</span>
              <ChevronDown size={14} className="text-slate-500" />
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="bg-white p-4 border-t border-slate-200 transition-all">
          <pre 
            className="text-xs font-mono text-slate-900 overflow-x-auto leading-relaxed max-h-[450px] scrollbar-thin whitespace-pre"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      )}
    </div>
  );
}
