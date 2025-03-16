
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

interface AIEmployeeProps {
  name: string;
  role: string;
  avatarSrc: string;
  bgColor: string;
  onClick?: () => void;
}

const AIEmployee = ({ name, role, avatarSrc, bgColor, onClick }: AIEmployeeProps) => {
  return (
    <motion.div 
      className={cn(
        "rounded-xl p-5 h-[230px] w-full cursor-pointer relative overflow-hidden group",
        bgColor
      )}
      onClick={onClick}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/0 via-black/0 to-black/40 pointer-events-none"></div>
      
      {/* Particle effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/80"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              transform: `scale(${Math.random() * 1 + 0.5})`,
              animation: `float ${Math.random() * 8 + 12}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      <div className="flex flex-col h-full relative z-10">
        <div className="mb-2">
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <p className="text-sm text-white/70">{role}</p>
        </div>
        
        <div className="mt-auto flex justify-center">
          <img 
            src={avatarSrc || "/placeholder.svg"} 
            alt={`${name} AI avatar`} 
            className="w-28 h-28 object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110" 
          />
        </div>
        
        <motion.button 
          className="absolute bottom-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageSquare className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AIEmployee;
