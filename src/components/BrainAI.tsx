
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, FileText, Globe, Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import aiService from '@/services/aiService';
import { toast } from 'sonner';

// Keep missing state variables that caused errors
const BrainAI = ({ snippets, websites, files, name }: { snippets: number; websites: number; files: number; name: string }) => {
  const [activeTab, setActiveTab] = useState('snippets');
  const [brainItems, setBrainItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // Adding previously missing state variables
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const loadBrainItems = () => {
    const items = aiService.getBrainItems('current-user');
    setBrainItems(items);
  };
  
  React.useEffect(() => {
    loadBrainItems();
  }, []);
  
  const filteredItems = brainItems.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab.slice(0, -1); // Remove 's' from the end
  });
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleAddItem = (type: string, data: any) => {
    try {
      aiService.addBrainItem({
        ...data,
        type,
        date: new Date(),
        userId: 'current-user'
      });
      
      loadBrainItems();
      setIsAddDialogOpen(false);
      toast.success(`Added new ${type} to your knowledge base`);
    } catch (error) {
      console.error('Error adding brain item:', error);
      toast.error('Failed to add item');
    }
  };
  
  const handleViewItem = (item: any) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };
  
  const handleDeleteItem = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedItem) {
      try {
        aiService.deleteBrainItem('current-user', selectedItem.id);
        loadBrainItems();
        setIsDeleteDialogOpen(false);
        toast.success('Item removed from your knowledge base');
      } catch (error) {
        console.error('Error removing brain item:', error);
        toast.error('Failed to remove item');
      }
    }
  };
  
  const AddItemDialog = () => (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="bg-[#1A0D3A] text-white border-white/10">
        <DialogHeader>
          <DialogTitle>Add to Knowledge Base</DialogTitle>
          <DialogDescription className="text-purple-300">
            Add information to your AI's knowledge base
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="snippet">
          <TabsList className="bg-white/5">
            <TabsTrigger value="snippet" className="data-[state=active]:bg-white/10">Text Snippet</TabsTrigger>
            <TabsTrigger value="website" className="data-[state=active]:bg-white/10">Website</TabsTrigger>
            <TabsTrigger value="file" className="data-[state=active]:bg-white/10">File</TabsTrigger>
          </TabsList>
          
          <TabsContent value="snippet" className="mt-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              handleAddItem('snippet', {
                title: formData.get('title') as string,
                content: formData.get('content') as string
              });
            }}>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea 
                    id="content" 
                    name="content" 
                    className="bg-white/5 border-white/10 text-white min-h-[150px]" 
                    placeholder="Enter text, code, or any information you want your AI to learn"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    Add to Knowledge Base
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="website" className="mt-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              handleAddItem('website', {
                title: formData.get('title') as string,
                url: formData.get('url') as string
              });
            }}>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <Label htmlFor="url">Website URL</Label>
                  <Input 
                    id="url" 
                    name="url" 
                    className="bg-white/5 border-white/10 text-white" 
                    placeholder="https://example.com"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    Add to Knowledge Base
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="file" className="mt-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              handleAddItem('file', {
                title: formData.get('title') as string,
                filename: formData.get('filename') as string,
                content: "This is a placeholder for file content. In a real app, this would be the extracted text from the file."
              });
            }}>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <Label htmlFor="file">File</Label>
                  <Input 
                    id="filename" 
                    name="filename" 
                    className="bg-white/5 border-white/10 text-white" 
                    placeholder="example.pdf (demo only)"
                  />
                  <p className="text-xs text-purple-300 mt-1">
                    Note: File upload is simulated in this demo
                  </p>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    Add to Knowledge Base
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
  
  const ViewItemDialog = () => (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className="bg-[#1A0D3A] text-white border-white/10 max-w-2xl">
        <DialogHeader>
          <DialogTitle>{selectedItem?.title}</DialogTitle>
          <DialogDescription className="text-purple-300">
            Added on {selectedItem?.date.toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="bg-white/5 text-purple-300 border-purple-500/30">
              {selectedItem?.type}
            </Badge>
            
            {selectedItem?.type === 'website' && (
              <Badge variant="outline" className="bg-white/5 text-blue-300 border-blue-500/30">
                <a href={selectedItem.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Visit
                </a>
              </Badge>
            )}
          </div>
          
          <ScrollArea className="h-[300px] rounded-md border border-white/10 p-4 bg-black/20">
            {selectedItem?.type === 'snippet' && (
              <pre className="text-sm text-white whitespace-pre-wrap font-mono">
                {selectedItem.content}
              </pre>
            )}
            
            {selectedItem?.type === 'website' && (
              <div>
                <p className="text-sm text-white mb-2">URL: {selectedItem.url}</p>
                <p className="text-sm text-purple-300">
                  In a full implementation, this would show extracted content from the website.
                </p>
              </div>
            )}
            
            {selectedItem?.type === 'file' && (
              <div>
                <p className="text-sm text-white mb-2">Filename: {selectedItem.filename}</p>
                <p className="text-sm text-purple-300 mb-4">
                  In a full implementation, this would show extracted content from the file.
                </p>
                <p className="text-sm text-white whitespace-pre-wrap">
                  {selectedItem.content}
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
        
        <DialogFooter>
          <Button 
            variant="destructive" 
            onClick={() => {
              setIsViewDialogOpen(false);
              setIsDeleteDialogOpen(true);
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
          <Button 
            onClick={() => setIsViewDialogOpen(false)}
            className="bg-white/10 hover:bg-white/20"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  const DeleteItemDialog = () => (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent className="bg-[#1A0D3A] text-white border-white/10">
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>
          <DialogDescription className="text-purple-300">
            Are you sure you want to delete this item from your knowledge base?
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-2 mb-4">
          <p className="text-white font-medium">{selectedItem?.title}</p>
          <p className="text-sm text-purple-300">This action cannot be undone.</p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsDeleteDialogOpen(false)}
            className="bg-transparent border-white/10 hover:bg-white/5 text-white"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={confirmDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  return (
    <>
      <Card className="bg-[#1A0D3A] text-white border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            {name} Knowledge Base
          </CardTitle>
          <CardDescription className="text-purple-300">
            Manage your AI's knowledge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="bg-white/5">
                <TabsTrigger value="all" className="data-[state=active]:bg-white/10">
                  All
                </TabsTrigger>
                <TabsTrigger value="snippets" className="data-[state=active]:bg-white/10">
                  Snippets
                </TabsTrigger>
                <TabsTrigger value="websites" className="data-[state=active]:bg-white/10">
                  Websites
                </TabsTrigger>
                <TabsTrigger value="files" className="data-[state=active]:bg-white/10">
                  Files
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-2">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors flex items-center justify-between"
                  onClick={() => handleViewItem(item)}
                >
                  <div className="flex items-center">
                    {item.type === 'snippet' && <FileText className="w-4 h-4 mr-2 text-purple-400" />}
                    {item.type === 'website' && <Globe className="w-4 h-4 mr-2 text-blue-400" />}
                    {item.type === 'file' && <FileText className="w-4 h-4 mr-2 text-amber-400" />}
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-purple-300">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white/5 text-purple-300 border-purple-500/30">
                    {item.type}
                  </Badge>
                </motion.div>
              ))
            ) : (
              <div className="p-8 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center">
                <Sparkles className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-white font-medium mb-2">No items yet</h3>
                <p className="text-purple-300 text-sm mb-4">Add your first knowledge item to get started</p>
                <Button
                  variant="outline"
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add item
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-2xl font-semibold text-white">{snippets}</p>
              <p className="text-xs text-purple-300">Snippets</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-2xl font-semibold text-white">{websites}</p>
              <p className="text-xs text-purple-300">Websites</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-2xl font-semibold text-white">{files}</p>
              <p className="text-xs text-purple-300">Files</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <AddItemDialog />
      {selectedItem && <ViewItemDialog />}
      {selectedItem && <DeleteItemDialog />}
    </>
  );
};

export default BrainAI;
