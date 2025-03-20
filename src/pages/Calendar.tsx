
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  PlusCircle, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  attendees: string[];
  type: 'meeting' | 'reminder' | 'task';
}

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'event-1',
      title: 'Team Meeting',
      date: new Date(),
      time: '10:00 AM',
      attendees: ['You', 'AI Assistant'],
      type: 'meeting'
    },
    {
      id: 'event-2',
      title: 'Project Review',
      date: addDays(new Date(), 2),
      time: '02:00 PM',
      attendees: ['You', 'Client'],
      type: 'meeting'
    }
  ]);
  
  const handleAddEvent = () => {
    // Create a new event and add it to the events array
    const newEvent: CalendarEvent = {
      id: `event-${events.length + 1}`,
      title: "New Event",
      date: selectedDate,
      time: "09:00 AM",
      attendees: ["You"],
      type: "meeting"
    };
    
    setEvents([...events, newEvent]);
    toast.success("Event added successfully!");
  };
  
  const getEventsForSelectedDate = () => {
    return events.filter(event => 
      event.date.getDate() === selectedDate.getDate() &&
      event.date.getMonth() === selectedDate.getMonth() &&
      event.date.getFullYear() === selectedDate.getFullYear()
    );
  };
  
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
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Calendar</h1>
              <p className="text-purple-300">{format(selectedDate, 'MMMM yyyy')}</p>
            </div>
            <Button 
              onClick={handleAddEvent}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <h2 className="text-lg font-semibold text-white">
                    {format(selectedDate, 'MMMM yyyy')}
                  </h2>
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border border-white/10 p-4 bg-white/5"
                />
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Events for selected date */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="bg-white/5 border-white/10 h-full">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-purple-400" />
                  {format(selectedDate, 'MMMM d, yyyy')}
                </h2>
                
                <div className="space-y-4">
                  {getEventsForSelectedDate().length > 0 ? (
                    getEventsForSelectedDate().map((event) => (
                      <div 
                        key={event.id}
                        className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition cursor-pointer"
                      >
                        <h3 className="font-medium text-white">{event.title}</h3>
                        <div className="flex items-center text-sm text-purple-300 mt-2">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-purple-300 mt-1">
                          <Users className="h-3.5 w-3.5 mr-1.5" />
                          <span>{event.attendees.join(', ')}</span>
                        </div>
                        <div className="mt-2 text-xs">
                          <span className={`px-2 py-1 rounded-full ${
                            event.type === 'meeting' ? 'bg-blue-500/20 text-blue-300' :
                            event.type === 'reminder' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-purple-300 mb-3">No events scheduled for this date</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                        onClick={handleAddEvent}
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
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
