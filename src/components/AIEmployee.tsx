
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { MessageSquare, Brain, Sparkles, Zap, Settings } from 'lucide-react';

interface AIEmployeeProps {
  id: string;
  name: string;
  role: string;
  avatarSrc: string;
  bgColor: string;
  onClick?: (id: string) => void;
}

const AIEmployee = ({ id, name, role, avatarSrc, bgColor, onClick }: AIEmployeeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className={cn(
        "rounded-xl p-5 h-[260px] w-full cursor-pointer relative overflow-hidden group",
        bgColor
      )}
      onClick={() => onClick && onClick(id)}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/0 via-black/0 to-black/40 pointer-events-none"></div>
      
      {/* Particle effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/80"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              y: [0, Math.random() * 30 - 15],
              x: [0, Math.random() * 30 - 15],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Energy waves animation - only visible on hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`wave-${i}`}
              className="absolute top-1/2 left-1/2 rounded-full border border-white/20"
              initial={{ width: 10, height: 10, x: -5, y: -5, opacity: 0.7 }}
              animate={{ 
                width: [10, 140 + i * 30], 
                height: [10, 140 + i * 30], 
                x: [-5, -70 - i * 15], 
                y: [-5, -70 - i * 15],
                opacity: [0.7, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
      
      <div className="flex flex-col h-full relative z-10">
        <div className="mb-2">
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <p className="text-sm text-white/70">{role}</p>
          
          {/* Status indicator */}
          <div className="flex items-center mt-1">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></span>
            <span className="text-xs text-green-300">Active</span>
          </div>
        </div>
        
        <div className="relative flex-1 flex justify-center items-center">
          {/* Character avatar */}
          <motion.div
            className="relative"
            animate={isHovered ? {
              y: [0, -10, 0],
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <motion.img 
              src={avatarSrc || "/placeholder.svg"} 
              alt={`${name} AI avatar`} 
              className="w-28 h-28 object-contain drop-shadow-lg z-10 relative"
            />
            
            {/* Glow effect under the avatar */}
            <motion.div 
              className="absolute -bottom-5 left-1/2 w-16 h-3 bg-white/30 rounded-full blur-md"
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                width: isHovered ? [16, 20, 16] : [16, 18, 16]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ transform: 'translateX(-50%)' }}
            />
          </motion.div>
          
          {/* Tech/AI elements floating around the character when hovered */}
          {isHovered && (
            <>
              <motion.div 
                className="absolute top-0 right-0 w-8 h-8 text-white"
                initial={{ opacity: 0, y: 20, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
              
              <motion.div 
                className="absolute bottom-5 left-5 w-8 h-8 text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              >
                <Brain className="w-5 h-5 text-purple-300" />
              </motion.div>
              
              <motion.div 
                className="absolute top-10 left-0 w-8 h-8 text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0, rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <Zap className="w-5 h-5 text-blue-300" />
              </motion.div>
            </>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="absolute bottom-3 right-3 flex space-x-2">
          <motion.button 
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(id);
            }}
          >
            <Settings className="w-4 h-4" />
          </motion.button>
          
          <motion.button 
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              // This would open a chat window in a real implementation
              onClick && onClick(id);
            }}
          >
            <MessageSquare className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIEmployee;
