"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Phone, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  Copy,
  Share2,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types for meetings
interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'video' | 'audio' | 'in-person';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  participants: string[];
  host: string;
  meetingLink?: string;
  location?: string;
  agenda: string[];
  notes?: string;
  recordingUrl?: string;
  createdAt: string;
}

// Mock data for meetings
const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Weekly Market Analysis Review',
    description: 'Review of last week\'s market performance and outlook for the coming week',
    date: '2024-03-20',
    time: '10:00',
    duration: 60,
    type: 'video',
    status: 'scheduled',
    participants: ['Rahul Sharma', 'Priya Patel', 'Vikram Singh', 'Anjali Desai'],
    host: 'Rahul Sharma',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    agenda: [
      'Review last week\'s market performance',
      'Discuss key economic indicators',
      'Identify trading opportunities for the week',
      'Q&A session'
    ],
    createdAt: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Options Trading Strategy Session',
    description: 'Advanced options trading strategies and risk management',
    date: '2024-03-18',
    time: '14:30',
    duration: 90,
    type: 'video',
    status: 'completed',
    participants: ['Vikram Singh', 'Neha Sharma', 'Rajiv Kumar'],
    host: 'Vikram Singh',
    meetingLink: 'https://meet.google.com/xyz-uvw-rst',
    agenda: [
      'Options basics review',
      'Advanced strategies demonstration',
      'Risk management techniques',
      'Live trading examples'
    ],
    notes: 'Great session! Participants showed strong understanding of options strategies.',
    recordingUrl: 'https://drive.google.com/recording1',
    createdAt: '2024-03-10T14:30:00Z'
  },
  {
    id: '3',
    title: 'Technical Analysis Workshop',
    description: 'Hands-on workshop on technical analysis tools and indicators',
    date: '2024-03-22',
    time: '09:00',
    duration: 120,
    type: 'in-person',
    status: 'scheduled',
    participants: ['Anjali Desai', 'Priya Patel', 'Rahul Sharma'],
    host: 'Anjali Desai',
    location: 'Conference Room A, Varaahi Office',
    agenda: [
      'Chart pattern recognition',
      'Technical indicators deep dive',
      'Practical exercises',
      'Group discussion'
    ],
    createdAt: '2024-03-16T09:00:00Z'
  },
  {
    id: '4',
    title: 'Portfolio Review Session',
    description: 'Monthly portfolio performance review and rebalancing discussion',
    date: '2024-03-25',
    time: '16:00',
    duration: 45,
    type: 'audio',
    status: 'scheduled',
    participants: ['Rahul Sharma', 'Vikram Singh'],
    host: 'Rahul Sharma',
    meetingLink: 'https://zoom.us/j/123456789',
    agenda: [
      'Portfolio performance review',
      'Asset allocation analysis',
      'Rebalancing recommendations',
      'Risk assessment'
    ],
    createdAt: '2024-03-17T16:00:00Z'
  }
];

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>(mockMeetings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    type: 'video' as Meeting['type'],
    participants: [] as string[],
    host: '',
    location: '',
    agenda: [] as string[]
  });

  // Filter meetings based on search and filters
  useEffect(() => {
    let filtered = meetings;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(meeting =>
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.host.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(meeting => meeting.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(meeting => meeting.type === typeFilter);
    }

    setFilteredMeetings(filtered);
  }, [meetings, searchTerm, statusFilter, typeFilter]);

  const handleCreateMeeting = () => {
    const meeting: Meeting = {
      id: Date.now().toString(),
      ...newMeeting,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    setMeetings([...meetings, meeting]);
    setNewMeeting({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: 60,
      type: 'video',
      participants: [],
      host: '',
      location: '',
      agenda: []
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditMeeting = () => {
    if (selectedMeeting) {
      setMeetings(meetings.map(meeting =>
        meeting.id === selectedMeeting.id ? selectedMeeting : meeting
      ));
      setIsEditDialogOpen(false);
      setSelectedMeeting(null);
    }
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter(meeting => meeting.id !== id));
  };

  const handleStatusChange = (meetingId: string, newStatus: Meeting['status']) => {
    setMeetings(meetings.map(meeting =>
      meeting.id === meetingId ? { ...meeting, status: newStatus } : meeting
    ));
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Meeting['type']) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Phone className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}:00`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-6 bg-gray-50 flex-grow">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
              <p className="text-gray-600">Schedule and manage your trading sessions</p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search meetings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="audio">Audio Call</SelectItem>
                  <SelectItem value="in-person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Meetings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeetings.map((meeting) => (
              <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{meeting.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(meeting.type)}
                        <span className="text-sm text-gray-600 capitalize">{meeting.type}</span>
                      </div>
                      <Badge className={getStatusColor(meeting.status)}>
                        {meeting.status}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedMeeting(meeting);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMeeting(meeting.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {meeting.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(meeting.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{formatTime(meeting.time)} ({meeting.duration} min)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{meeting.participants.length} participants</span>
                    </div>
                    {meeting.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{meeting.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {meeting.status === 'scheduled' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(meeting.id, 'ongoing')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(meeting.id, 'cancelled')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {meeting.status === 'ongoing' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(meeting.id, 'completed')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    {meeting.meetingLink && (
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMeetings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by scheduling your first meeting'}
              </p>
              {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Meeting Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule New Meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                placeholder="Meeting title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newMeeting.description}
                onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                placeholder="Meeting description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Time</label>
                <Input
                  type="time"
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Input
                  type="number"
                  value={newMeeting.duration}
                  onChange={(e) => setNewMeeting({...newMeeting, duration: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={newMeeting.type}
                  onValueChange={(value: Meeting['type']) => setNewMeeting({...newMeeting, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="audio">Audio Call</SelectItem>
                    <SelectItem value="in-person">In Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Host</label>
              <Input
                value={newMeeting.host}
                onChange={(e) => setNewMeeting({...newMeeting, host: e.target.value})}
                placeholder="Meeting host"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location (optional)</label>
              <Input
                value={newMeeting.location}
                onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
                placeholder="Meeting location"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateMeeting} className="flex-1">
                Schedule Meeting
              </Button>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Meeting Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Meeting</DialogTitle>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={selectedMeeting.title}
                  onChange={(e) => setSelectedMeeting({...selectedMeeting, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={selectedMeeting.description}
                  onChange={(e) => setSelectedMeeting({...selectedMeeting, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={selectedMeeting.date}
                    onChange={(e) => setSelectedMeeting({...selectedMeeting, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Time</label>
                  <Input
                    type="time"
                    value={selectedMeeting.time}
                    onChange={(e) => setSelectedMeeting({...selectedMeeting, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEditMeeting} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 