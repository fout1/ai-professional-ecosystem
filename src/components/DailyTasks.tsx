
import React from 'react';
import { CircleCheck } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  icon: string;
  description: string;
  completed: boolean;
}

interface DailyTasksProps {
  tasks: Task[];
}

const DailyTasks = ({ tasks }: DailyTasksProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="flex items-center space-x-2">
          <CircleCheck className="w-5 h-5 text-brand-purple" />
          <h2 className="font-semibold text-lg">Daily Tasks</h2>
        </div>
        <div className="ml-auto text-sm text-gray-500">
          0/3
        </div>
      </div>
      
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center mr-3">
              <img src={task.icon} alt="" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-sm">{task.title}</h3>
              <p className="text-xs text-gray-500">{task.description}</p>
            </div>
            <div className="ml-auto">
              <input 
                type="checkbox" 
                checked={task.completed} 
                className="w-4 h-4 accent-brand-purple rounded" 
                readOnly
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium">Goal</span>
            <p className="text-xs text-gray-500">100 users</p>
          </div>
          <button className="text-xs text-brand-purple hover:underline">
            View all
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyTasks;
