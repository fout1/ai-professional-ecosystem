
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  User, Shield, Key, Bell, Monitor, Palette, 
  Save, RefreshCw, Trash2, AlertTriangle 
} from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const [user, setUser] = useState<any>(null);
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [environmentName, setEnvironmentName] = useState('');
  const [environmentColor, setEnvironmentColor] = useState('');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  
  // Theme settings
  const [darkMode, setDarkMode] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  // AI Settings
  const [aiModel, setAiModel] = useState('gpt-4o');
  const [temperature, setTemperature] = useState([0.7]);

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Load API key
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      // Mask the API key for display
      setApiKey('sk-****' + storedApiKey.substring(storedApiKey.length - 10));
    }
    
    // Load environment settings
    const envName = localStorage.getItem('environmentName');
    if (envName) {
      setEnvironmentName(envName);
    }
    
    const envColor = localStorage.getItem('environmentColor');
    if (envColor) {
      setEnvironmentColor(envColor);
    }
  }, []);
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    try {
      // Save environment settings
      localStorage.setItem('environmentName', environmentName);
      localStorage.setItem('environmentColor', environmentColor);
      
      // Save other settings in a real app would go to the database
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Settings saved successfully");
      }, 800);
    } catch (error) {
      setIsLoading(false);
      toast.error("Error saving settings");
    }
  };
  
  const handleResetApiKey = () => {
    if (window.confirm("Are you sure you want to reset your API key? This will require you to enter a new key.")) {
      localStorage.removeItem('openai_api_key');
      setApiKey('');
      toast.info("API key has been reset");
    }
  };
  
  const handleSaveApiKey = (newKey: string) => {
    if (newKey.startsWith('sk-')) {
      localStorage.setItem('openai_api_key', newKey);
      setApiKey('sk-****' + newKey.substring(newKey.length - 10));
      toast.success("API key saved successfully");
    } else {
      toast.error("Invalid API key format");
    }
  };
  
  const colors = [
    'from-indigo-500 to-blue-600',
    'from-purple-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-emerald-500 to-green-600',
    'from-rose-500 to-red-600',
    'from-cyan-500 to-blue-600',
  ];
  
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <Layout>
      <motion.div 
        className="max-w-4xl mx-auto"
        variants={containerVariant}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-6" variants={itemVariant}>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-purple-300">Customize your AI workspace</p>
        </motion.div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6 bg-white/5 border-b border-white/10 p-1">
            <TabsTrigger value="general" className="data-[state=active]:bg-white/10">
              <User className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-white/10">
              <Key className="w-4 h-4 mr-2" />
              API
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-white/10">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white/10">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-white/10">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>
          
          <motion.div variants={containerVariant}>
            <TabsContent value="general">
              <div className="space-y-6">
                <motion.div variants={itemVariant}>
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Account Information</CardTitle>
                      <CardDescription className="text-purple-300">
                        Manage your personal information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-white">Full Name</Label>
                        <Input 
                          id="name" 
                          value={user?.name || ''} 
                          onChange={(e) => setUser({...user, name: e.target.value})}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input 
                          id="email" 
                          value={user?.email || ''} 
                          readOnly
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariant}>
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Workspace Settings</CardTitle>
                      <CardDescription className="text-purple-300">
                        Customize your AI environment
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="environmentName" className="text-white">Workspace Name</Label>
                        <Input 
                          id="environmentName" 
                          value={environmentName} 
                          onChange={(e) => setEnvironmentName(e.target.value)}
                          placeholder="Professional"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-white mb-2 block">Workspace Color</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {colors.map((color, index) => (
                            <div 
                              key={index}
                              className={`h-10 rounded-md bg-gradient-to-br ${color} flex items-center justify-center cursor-pointer ${environmentColor === color ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-[#170E34]' : ''}`}
                              onClick={() => setEnvironmentColor(color)}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
            
            <TabsContent value="api">
              <motion.div variants={itemVariant}>
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">API Settings</CardTitle>
                    <CardDescription className="text-purple-300">
                      Manage your OpenAI API keys
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="apiKey" className="text-white">OpenAI API Key</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="apiKey" 
                          type="password"
                          value={apiKey} 
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="sk-..."
                          className="bg-white/5 border-white/10 text-white"
                        />
                        {apiKey && (
                          <Button variant="outline" size="icon" onClick={handleResetApiKey} className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-purple-300 mt-2">
                        {apiKey ? "Your API key is stored locally and never sent to our servers" : "Enter your OpenAI API key to use your own account"}
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="aiModel" className="text-white">Default AI Model</Label>
                      <select 
                        id="aiModel"
                        value={aiModel}
                        onChange={(e) => setAiModel(e.target.value)}
                        className="w-full p-2 rounded-md bg-white/5 border border-white/10 text-white"
                      >
                        <option value="gpt-4o">GPT-4o (Recommended)</option>
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label className="text-white">Temperature: {temperature[0]}</Label>
                      <Slider 
                        value={temperature} 
                        min={0} 
                        max={2} 
                        step={0.1}
                        onValueChange={setTemperature} 
                        className="mt-2"
                      />
                      <div className="flex justify-between mt-1 text-xs text-purple-300">
                        <span>More precise</span>
                        <span>More creative</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="security">
              <motion.div variants={itemVariant}>
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Security Settings</CardTitle>
                    <CardDescription className="text-purple-300">
                      Manage your account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                        Change Password
                      </Button>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10">
                      <h3 className="text-white font-medium mb-2">Danger Zone</h3>
                      <div className="bg-red-950/30 p-4 rounded-md border border-red-800/50">
                        <div className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-400 mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="text-red-400 font-medium">Delete Account</h4>
                            <p className="text-red-300/70 text-sm mb-3">
                              Once you delete your account, there is no going back. This action cannot be undone.
                            </p>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <motion.div variants={itemVariant}>
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Notification Settings</CardTitle>
                    <CardDescription className="text-purple-300">
                      Manage how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <h3 className="text-white font-medium">Email Notifications</h3>
                        <p className="text-sm text-purple-300">Receive notifications via email</p>
                      </div>
                      <Switch 
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-t border-white/10">
                      <div>
                        <h3 className="text-white font-medium">Push Notifications</h3>
                        <p className="text-sm text-purple-300">Receive browser push notifications</p>
                      </div>
                      <Switch 
                        checked={pushNotifications} 
                        onCheckedChange={setPushNotifications} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="appearance">
              <motion.div variants={itemVariant}>
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Appearance Settings</CardTitle>
                    <CardDescription className="text-purple-300">
                      Customize how the application looks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <h3 className="text-white font-medium">Dark Mode</h3>
                        <p className="text-sm text-purple-300">Use dark theme</p>
                      </div>
                      <Switch 
                        checked={darkMode} 
                        onCheckedChange={setDarkMode} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-t border-white/10">
                      <div>
                        <h3 className="text-white font-medium">Animations</h3>
                        <p className="text-sm text-purple-300">Enable UI animations</p>
                      </div>
                      <Switch 
                        checked={animationsEnabled} 
                        onCheckedChange={setAnimationsEnabled} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </motion.div>
        </Tabs>
        
        <motion.div variants={itemVariant} className="mt-8 flex justify-end">
          <Button 
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Settings;
