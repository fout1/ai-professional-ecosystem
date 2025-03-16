
import React, { useState } from 'react';
import { Brain, FileText, Globe, Plus, ChevronLeft, ChevronRight, Upload, Search, File } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BrainAIProps {
  snippets: number;
  websites: number;
  files: number;
  name: string;
}

interface BrainItem {
  id: string;
  type: 'pdf' | 'doc' | 'website';
  name: string;
  date: string;
}

const BrainAI = ({ snippets, websites, files, name }: BrainAIProps) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadType, setUploadType] = useState<'file' | 'website'>('file');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [brainItems, setBrainItems] = useState<BrainItem[]>([
    { id: '1', type: 'pdf', name: 'Financial Report.pdf', date: '2 days ago' },
    { id: '2', type: 'doc', name: 'Project Plan.docx', date: '1 week ago' },
    { id: '3', type: 'website', name: 'industry-news.com', date: 'Yesterday' },
  ]);
  
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadFile(files[0]);
    }
  };
  
  const handleUpload = () => {
    if (uploadType === 'website' && uploadUrl) {
      // In a real app, this would upload the website to the backend
      const newItem: BrainItem = {
        id: crypto.randomUUID(),
        type: 'website',
        name: uploadUrl.replace(/^https?:\/\//, ''),
        date: 'Just now'
      };
      
      setBrainItems([newItem, ...brainItems]);
      toast.success("Website added to Brain successfully!");
      setShowUploadDialog(false);
      setUploadUrl('');
    } else if (uploadType === 'file' && uploadFile) {
      // In a real app, this would upload the file to the backend
      const fileType = uploadFile.name.endsWith('.pdf') ? 'pdf' : 'doc';
      
      const newItem: BrainItem = {
        id: crypto.randomUUID(),
        type: fileType,
        name: uploadFile.name,
        date: 'Just now'
      };
      
      setBrainItems([newItem, ...brainItems]);
      toast.success("File added to Brain successfully!");
      setShowUploadDialog(false);
      setUploadFile(null);
    } else {
      toast.error("Please provide a valid URL or file");
    }
  };
  
  const handleViewContent = (item: BrainItem) => {
    toast.info(`Viewing content of ${item.name}`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold flex items-center space-x-2 text-white">
          <Brain className="w-6 h-6 text-purple-400" />
          <span>Brain AI</span>
        </h2>
        <button 
          className="text-purple-400 hover:text-white p-1 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setShowUploadDialog(true)}
        >
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
              onClick={() => setShowUploadDialog(true)}
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
              onChange={() => toast.info("Search functionality would be implemented with a backend")}
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
          {brainItems.map((item, index) => (
            <motion.div 
              key={item.id}
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
                  <button 
                    className="w-full text-[10px] py-1 bg-white/10 hover:bg-white/20 rounded text-center text-white/80"
                    onClick={() => handleViewContent(item)}
                  >
                    View content
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="bg-[#1A0D3A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Add to Brain</DialogTitle>
            <DialogDescription className="text-purple-300">
              Upload a file or website to your Brain AI knowledge base.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex space-x-2 mt-2">
            <Button
              variant="outline"
              className={`flex-1 ${uploadType === 'file' ? 'bg-white/10' : 'bg-transparent'} border-white/10 text-white`}
              onClick={() => setUploadType('file')}
            >
              <FileText className="w-4 h-4 mr-2" />
              File
            </Button>
            <Button
              variant="outline"
              className={`flex-1 ${uploadType === 'website' ? 'bg-white/10' : 'bg-transparent'} border-white/10 text-white`}
              onClick={() => setUploadType('website')}
            >
              <Globe className="w-4 h-4 mr-2" />
              Website
            </Button>
          </div>
          
          {uploadType === 'file' ? (
            <div className="space-y-4 mt-4">
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 text-purple-400 mb-2" />
                <p className="text-sm text-center text-white mb-2">Drag and drop files here, or click to select</p>
                <p className="text-xs text-center text-purple-300 mb-4">Supports PDF, DOCX, TXT (max 10MB)</p>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="bg-white/10 hover:bg-white/20 text-white text-sm py-1 px-3 rounded">Select files</span>
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.docx,.txt"
                    onChange={handleFilesSelected}
                  />
                </label>
                {uploadFile && (
                  <div className="mt-4 text-sm text-white">
                    Selected: {uploadFile.name}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="website-url" className="text-white">Website URL</Label>
                <Input
                  id="website-url"
                  placeholder="https://example.com"
                  className="bg-white/5 border-white/10 text-white"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" className="border-white/10 text-white" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleUpload}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrainAI;
