
import React from 'react';
import { cn } from '@/lib/utils';

interface AIEmployeeProps {
  name: string;
  role: string;
  avatarSrc: string;
  bgColor: string;
  onClick?: () => void;
}

const AIEmployee = ({ name, role, avatarSrc, bgColor, onClick }: AIEmployeeProps) => {
  return (
    <div 
      className={cn(
        "rounded-xl p-5 h-[220px] w-[170px] cursor-pointer transition-all hover:scale-105 animate-float",
        bgColor
      )}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-sm text-white/70">{role}</p>
        </div>
        
        <div className="mt-auto flex justify-center">
          <img 
            src={avatarSrc || "/placeholder.svg"} 
            alt={`${name} AI avatar`} 
            className="w-28 h-28 object-contain" 
          />
        </div>
      </div>
    </div>
  );
};

export default AIEmployee;
