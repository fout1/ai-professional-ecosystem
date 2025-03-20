
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar as CalendarIcon, 
  PlusCircle, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { format, isSameDay } from 'date-fns';

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<{
    id: string;
    title: string;
    date: Date;
    time: string;
    attendees: string[];
    type: 'meeting' | 'reminder' | 'task';
  }[]>([
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(),
      time: '10:00 AM',
      attendees: ['John', 'Sarah', 'Mike'],
      type: 'meeting'
    }
  ]);
  
  const addNewEvent = () => {
    if (!date) return;
    
    // Add a demo event
    const newEvent = {
      id: `event-${events.length + 1}`,
      title: 'New Event',
      date: date,
      time: '09:00 AM',
      attendees: ['You'],
      type: Math.random() > 0.5 ? 'meeting' : 'reminder',
    } as const;
    
    setEvents([...events, newEvent]);
    toast.success("New event added");
  };
  
  // Filter events for the selected date
  const filteredEvents = events.filter(event => date && isSameDay(event.date, date));
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <Layout>
      <motion.div 
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center">
                <CalendarIcon className="w-6 h-6 mr-2 text-purple-400" />
                Calendar
              </h1>
              <p className="text-purple-300">Manage your schedule and events</p>
            </div>
            
            <Button 
              onClick={addNewEvent}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Calendar */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">
                  <div className="flex items-center justify-between">
                    <span>{date ? format(date, 'MMMM yyyy') : ''}</span>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                        onClick={() => {
                          if (date) {
                            const newDate = new Date(date);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setDate(newDate);
                          }
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                        onClick={() => {
                          if (date) {
                            const newDate = new Date(date);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setDate(newDate);
                          }
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="text-white"
                  classNames={{
                    day_selected: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
                    day_today: "bg-white/10 text-white font-bold",
                    cell: "text-white",
                    head_cell: "text-purple-300",
                    nav_button: "text-white hover:bg-white/10",
                    nav_button_previous: "text-white hover:bg-white/10",
                    nav_button_next: "text-white hover:bg-white/10",
                    caption: "text-white",
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Events for the day */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <Card className="bg-white/5 border-white/10 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">
                  {date ? format(date, 'EEEE, MMMM do, yyyy') : 'No date selected'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <div 
                        key={event.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          event.type === 'meeting' 
                            ? 'border-l-purple-500 bg-purple-500/10' 
                            : 'border-l-indigo-500 bg-indigo-500/10'
                        }`}
                      >
                        <h3 className="font-medium text-white">{event.title}</h3>
                        <div className="flex items-center mt-2 text-sm text-purple-300">
                          <Clock className="w-4 h-4 mr-1.5" />
                          <span>{event.time}</span>
                        </div>
                        {event.attendees.length > 0 && (
                          <div className="flex items-center mt-1 text-sm text-purple-300">
                            <Users className="w-4 h-4 mr-1.5" />
                            <span>{event.attendees.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <CalendarIcon className="w-12 h-12 text-purple-300/50 mb-4" />
                      <h3 className="text-white font-medium mb-1">No events scheduled</h3>
                      <p className="text-sm text-purple-300 mb-4">
                        Add your first event for this day
                      </p>
                      <Button
                        onClick={addNewEvent}
                        variant="outline"
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                        size="sm"
                      >
                        <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                        Add Event
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Calendar;
