
import React from 'react';
import { CircleCheck, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const completedTasks = tasks.filter(task => task.completed).length;

  const handleAddTask = () => {
    toast.info("In a full implementation, this would open a form to add a new task");
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="flex items-center space-x-2">
          <CircleCheck className="w-5 h-5 text-brand-purple" />
          <h2 className="font-semibold text-lg">Daily Tasks</h2>
        </div>
        <div className="ml-auto text-sm text-gray-500">
          {completedTasks}/{tasks.length}
        </div>
      </div>
      
      {tasks.length > 0 ? (
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
      ) : (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <p className="text-gray-500 mb-4">No tasks yet. Create your first task.</p>
          <Button
            onClick={handleAddTask}
            className="bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple flex items-center"
            variant="outline"
            size="sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium">Goal</span>
            <p className="text-xs text-gray-500">{tasks.length > 0 ? "Complete all tasks" : "Add your first task"}</p>
          </div>
          <button 
            className="text-xs text-brand-purple hover:underline"
            onClick={handleAddTask}
          >
            View all
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyTasks;
