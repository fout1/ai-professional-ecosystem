
import React from 'react';
import { Brain, FileText, Globe, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface BrainAIProps {
  snippets: number;
  websites: number;
  files: number;
  name: string;
}

const BrainAI = ({ snippets, websites, files, name }: BrainAIProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Brain className="w-6 h-6 text-brand-purple" />
          <span>Brain AI</span>
        </h2>
        <button className="text-gray-500 hover:text-gray-700">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      <div className="bg-brand-violet rounded-xl p-5 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 flex items-center">
          <img 
            src="/lovable-uploads/5ff2a73b-e899-4ad0-bf0b-a3313f5f8b2c.png" 
            alt="Brain visualization" 
            className="w-32 h-32 object-contain opacity-80"
          />
        </div>
        
        <div className="flex flex-col text-white z-10 relative">
          <h3 className="font-semibold text-lg">{name}</h3>
          
          <div className="flex space-x-6 mt-6">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">{snippets}</span>
              <span className="text-xs text-white/70">Snippets</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">{websites}</span>
              <span className="text-xs text-white/70">Websites</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">{files}</span>
              <span className="text-xs text-white/70">Files</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border border-gray-200 rounded-lg flex items-center">
        <div className="flex-1">
          <h4 className="text-sm font-medium">Invite Team</h4>
          <p className="text-xs text-gray-500">Share Brain AI Workspace with others</p>
        </div>
        <div className="ml-auto">
          <img 
            src="/lovable-uploads/bda55609-a29a-4f13-a7ec-1aa2dd23bc93.png" 
            alt="Team members" 
            className="w-12 h-8 object-contain"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">Brain AI Integrations</h3>
          <div className="flex space-x-2">
            <button className="p-1 rounded border border-gray-200 text-gray-500">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded border border-gray-200 text-gray-500">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex space-x-4 overflow-hidden">
          <div className="p-3 border border-gray-200 rounded-lg w-32 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <img src="/placeholder.svg" alt="LinkedIn" className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-medium">LinkedIn</h4>
            <p className="text-[10px] text-gray-500 mt-1">Connect your account</p>
          </div>
          
          <div className="p-3 border border-gray-200 rounded-lg w-32 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <img src="/placeholder.svg" alt="Gmail" className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-medium">Gmail</h4>
            <p className="text-[10px] text-gray-500 mt-1">Import emails & contacts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainAI;
