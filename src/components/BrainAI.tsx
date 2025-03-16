
import React, { useState } from 'react';
import { Brain, FileText, Globe, Plus, ChevronLeft, ChevronRight, Upload, Search, File } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface BrainAIProps {
  snippets: number;
  websites: number;
  files: number;
  name: string;
}

const BrainAI = ({ snippets, websites, files, name }: BrainAIProps) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold flex items-center space-x-2 text-white">
          <Brain className="w-6 h-6 text-purple-400" />
          <span>Brain AI</span>
        </h2>
        <button className="text-purple-400 hover:text-white p-1 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      <motion.div 
        className="bg-gradient-to-br from-violet-600 to-purple-800 rounded-xl p-5 relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center">
          <motion.img 
            src="/lovable-uploads/5ff2a73b-e899-4ad0-bf0b-a3313f5f8b2c.png" 
            alt="Brain visualization" 
            className="w-32 h-32 object-contain drop-shadow-lg"
            animate={{ 
              rotateZ: [0, 5, 0, -5, 0], 
              y: [0, -5, 0, 5, 0] 
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </div>
        
        <div className="flex flex-col text-white z-10 relative">
          <h3 className="font-semibold text-lg flex items-center">
            <span className="mr-2">{name}</span>
            <span className="px-1.5 py-0.5 bg-white/20 rounded-md text-xs">Pro</span>
          </h3>
          
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
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white text-xs"
              size="sm"
            >
              <Upload className="w-3 h-3 mr-1" />
              Add to Brain
            </Button>
          </div>
        </div>
      </motion.div>
      
      <div className="p-4 border border-white/10 rounded-lg bg-white/5 flex items-center text-white">
        <div className="flex-1">
          <h4 className="text-sm font-medium">Knowledge Database</h4>
          <p className="text-xs text-purple-300">Search through your Brain content</p>
        </div>
        <div className="w-32 h-8 flex">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-purple-400" />
            <input 
              type="text" 
              className="w-full h-full bg-white/10 rounded-lg border border-white/20 pl-7 pr-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm text-white">Recent Uploads</h3>
          <div className="flex space-x-2">
            <button className="p-1 rounded border border-white/10 text-purple-400 hover:bg-white/5">
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button className="p-1 rounded border border-white/10 text-purple-400 hover:bg-white/5">
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar">
          {[
            { type: 'pdf', name: 'Financial Report.pdf', date: '2 days ago' },
            { type: 'doc', name: 'Project Plan.docx', date: '1 week ago' },
            { type: 'website', name: 'industry-news.com', date: 'Yesterday' },
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="p-3 border border-white/10 bg-white/5 rounded-lg w-48 flex flex-col text-white/90"
              onMouseEnter={() => setHoveredSection(`upload-${index}`)}
              onMouseLeave={() => setHoveredSection(null)}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-white/10">
                  <File className="w-4 h-4 text-purple-400" />
                </div>
                <div className="ml-2 flex-1">
                  <h4 className="text-xs font-medium truncate w-32">{item.name}</h4>
                  <p className="text-[10px] text-purple-300">{item.date}</p>
                </div>
              </div>
              
              {hoveredSection === `upload-${index}` && (
                <motion.div 
                  className="mt-auto pt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <button className="w-full text-[10px] py-1 bg-white/10 hover:bg-white/20 rounded text-center text-white/80">
                    View content
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrainAI;
