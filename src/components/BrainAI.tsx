import React, { useState, useEffect } from 'react';
import { Brain, FileText, Globe, Plus, ChevronLeft, ChevronRight, Upload, Search, File, X, Link, Scissors, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import aiService, { BrainItem } from '@/services/aiService';

interface BrainAIProps {
  snippets: number;
  websites: number;
  files: number;
  name: string;
}

const BrainAI = ({ snippets, websites, files, name }: BrainAIProps) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadType, setUploadType] = useState<'file' | 'website' | 'snippet'>('file');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetContent, setSnippetContent] = useState('');
  const [brainItems, setBrainItems] = useState<BrainItem[]>([]);
  const [viewItemDialog, setViewItemDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<BrainItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('knowledge');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<BrainItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadBrainItems();
  }, []);

  const loadBrainItems = () => {
    const items = aiService.getBrainItems('current-user');
    setBrainItems(items);
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadFile(files[0]);
    }
  };

  const handleUpload = () => {
    try {
      if (uploadType === 'website' && uploadUrl) {
        const newItem = aiService.addBrainItem({
          type: 'website',
          content: uploadUrl,
          title: uploadUrl.replace(/^https?:\/\//, ''),
          date: new Date(),
          userId: 'current-user',
        });
        
        setBrainItems(prev => [newItem, ...prev]);
        toast.success("Website added to Brain successfully!");
        setShowUploadDialog(false);
        setUploadUrl('');
      } else if (uploadType === 'file' && uploadFile) {
        const fileType = uploadFile.name.endsWith('.pdf') ? 'pdf' : 'doc';
        
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const fileContent = uploadFile.name + ": This is simulated content for " + uploadFile.name;
            
            const newItem = aiService.addBrainItem({
              type: 'file',
              content: fileContent,
              title: uploadFile.name,
              date: new Date(),
              userId: 'current-user',
              fileUrl: 'simulated-url://' + uploadFile.name,
              fileType
            });
            
            setBrainItems(prev => [newItem, ...prev]);
            toast.success("File added to Brain successfully!");
          }
        };
        reader.readAsText(uploadFile);
        
        setShowUploadDialog(false);
        setUploadFile(null);
      } else if (uploadType === 'snippet' && snippetTitle && snippetContent) {
        const newItem = aiService.addBrainItem({
          type: 'snippet',
          content: snippetContent,
          title: snippetTitle,
          date: new Date(),
          userId: 'current-user',
        });
        
        setBrainItems(prev => [newItem, ...prev]);
        toast.success("Snippet added to Brain successfully!");
        setShowUploadDialog(false);
        setSnippetTitle('');
        setSnippetContent('');
      } else {
        toast.error("Please provide valid information");
      }
    } catch (error) {
      console.error("Error adding to brain:", error);
      toast.error("Failed to add to Brain. Please try again.");
    }
  };

  const handleViewContent = (item: BrainItem) => {
    setCurrentItem(item);
    setViewItemDialog(true);
    setIsEditing(false);
  };

  const handleSaveEdits = () => {
    if (!currentItem) return;
    
    try {
      const updatedItem = aiService.updateBrainItem(currentItem.id, {
        title: currentItem.title,
        content: currentItem.content
      });
      
      if (updatedItem) {
        toast.success("Changes saved successfully");
        setIsEditing(false);
        loadBrainItems(); // Refresh the list
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    }
  };

  const handleDeleteItem = () => {
    if (!currentItem) return;
    
    try {
      aiService.deleteBrainItem(currentItem.id);
      toast.success("Item deleted successfully");
      setViewItemDialog(false);
      setCurrentItem(null);
      loadBrainItems(); // Refresh the list
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      loadBrainItems(); // Reset to show all items
      return;
    }
    
    const results = aiService.searchBrainItems('current-user', searchQuery);
    setBrainItems(results);
    toast.success(`Found ${results.length} items matching "${searchQuery}"`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <FileText className="w-4 h-4 text-purple-400" />;
      case 'website':
        return <Globe className="w-4 h-4 text-purple-400" />;
      case 'snippet':
        return <Scissors className="w-4 h-4 text-purple-400" />;
      default:
        return <File className="w-4 h-4 text-purple-400" />;
    }
  };

  const addWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!websiteUrl) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const websiteData = {
        type: 'website' as const,
        title: websiteUrl,
        content: `Content from ${websiteUrl} would be extracted and stored here.`,
        date: new Date(),
        userId: 'current-user',
        fileUrl: websiteUrl
      };
      
      aiService.addBrainItem(websiteData);
      
      toast.success('Website added to your knowledge base');
      setWebsiteUrl('');
      setActiveTab('knowledge');
      loadBrainItems();
    } catch (error) {
      console.error('Error adding website:', error);
      toast.error('Failed to add website');
    } finally {
      setIsSubmitting(false);
    }
  };

  const editKnowledgeItem = async (item: BrainItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditContent(item.content);
    setIsEditModalOpen(true);
  };

  const saveEditedItem = async () => {
    if (!editingItem) return;
    
    setIsSaving(true);
    
    try {
      await aiService.updateBrainItem(editingItem.id, {
        title: editTitle,
        content: editContent
      });
      
      toast.success('Knowledge item updated');
      setIsEditModalOpen(false);
      loadBrainItems();
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteKnowledgeItem = async (id: string) => {
    try {
      await aiService.deleteBrainItem(id);
      toast.success('Item deleted from knowledge base');
      loadBrainItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
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
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-purple-400" />
            <input 
              type="text" 
              className="w-32 h-8 bg-white/10 rounded-lg border border-white/20 pl-7 pr-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 bg-white/10 border-white/20 hover:bg-white/20 text-white text-xs"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm text-white">Recent Knowledge</h3>
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
          {brainItems.length > 0 ? (
            brainItems.map((item, index) => (
              <motion.div 
                key={item.id}
                className="p-3 border border-white/10 bg-white/5 rounded-lg w-48 flex flex-col text-white/90"
                onMouseEnter={() => setHoveredSection(`upload-${index}`)}
                onMouseLeave={() => setHoveredSection(null)}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-white/10">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="ml-2 flex-1">
                    <h4 className="text-xs font-medium truncate w-32">{item.title}</h4>
                    <p className="text-[10px] text-purple-300">
                      {new Date(item.date).toLocaleDateString()} 
                    </p>
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
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full p-8 border border-dashed border-white/10 rounded-lg">
              <Brain className="h-8 w-8 text-purple-400 mb-2 opacity-50" />
              <p className="text-sm text-white/50 text-center">Your Brain is empty. Add some knowledge!</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="bg-[#1A0D3A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Add to Brain</DialogTitle>
            <DialogDescription className="text-purple-300">
              Upload knowledge to your Brain AI database.
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
            <Button
              variant="outline"
              className={`flex-1 ${uploadType === 'snippet' ? 'bg-white/10' : 'bg-transparent'} border-white/10 text-white`}
              onClick={() => setUploadType('snippet')}
            >
              <Scissors className="w-4 h-4 mr-2" />
              Snippet
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
          ) : uploadType === 'website' ? (
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
          ) : (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="snippet-title" className="text-white">Snippet Title</Label>
                <Input
                  id="snippet-title"
                  placeholder="Title for your snippet"
                  className="bg-white/5 border-white/10 text-white"
                  value={snippetTitle}
                  onChange={(e) => setSnippetTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="snippet-content" className="text-white">Snippet Content</Label>
                <Textarea
                  id="snippet-content"
                  placeholder="Enter your knowledge snippet here..."
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                  value={snippetContent}
                  onChange={(e) => setSnippetContent(e.target.value)}
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
      
      {/* View/Edit Item Dialog */}
      <Dialog open={viewItemDialog} onOpenChange={setViewItemDialog}>
        <DialogContent className="bg-[#1A0D3A] border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          {currentItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  {getTypeIcon(currentItem.type)}
                  <span className="ml-2">
                    {isEditing ? 'Edit' : 'View'} {currentItem.type.charAt(0).toUpperCase() + currentItem.type.slice(1)}
                  </span>
                </DialogTitle>
                <DialogDescription className="text-purple-300">
                  {new Date(currentItem.date).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-2">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="edit-title" className="text-white">Title</Label>
                      <Input
                        id="edit-title"
                        value={currentItem.title}
                        onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-content" className="text-white">Content</Label>
                      <Textarea
                        id="edit-content"
                        value={currentItem.content}
                        onChange={(e) => setCurrentItem({...currentItem, content: e.target.value})}
                        className="bg-white/5 border-white/10 text-white min-h-[200px]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">{currentItem.title}</h3>
                      {currentItem.type === 'website' ? (
                        <div className="flex items-center text-purple-300 mb-3">
                          <Link className="w-4 h-4 mr-1" />
                          <a 
                            href={currentItem.content.startsWith('http') ? currentItem.content : `https://${currentItem.content}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm hover:underline"
                          >
                            {currentItem.content}
                          </a>
                        </div>
                      ) : (
                        <pre className="whitespace-pre-wrap bg-white/5 p-4 rounded-lg text-sm text-purple-50 max-h-[300px] overflow-y-auto">
                          {currentItem.content}
                        </pre>
                      )}
                    </div>
                    
                    {currentItem.employeeId && (
                      <div className="text-sm text-purple-300 italic">
                        This knowledge is linked to an AI employee.
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <DialogFooter className="flex justify-between">
                <div>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteItem}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        className="border-white/10 text-white"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={handleSaveEdits}
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="border-white/10 text-white"
                        onClick={() => setViewItemDialog(false)}
                      >
                        Close
                      </Button>
                      <Button
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </Button>
                    </>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrainAI;
