import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar,
  Filter,
  Loader2,
  CheckCircle,
  Trophy,
  Image as ImageIcon,
  Users,
  Award,
  Mail,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Event {
  id: string;
  event_name: string;
  event_type: string;
  event_category_name: string;
  description: string;
  banner_image_url: string;
  date_time: string;
  duration: string;
  venue: string;
  rules: string;
  code_of_conduct: string;
  prize_details: string;
  socials: any;
  contact_details: any;
  year: number;
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string;
}

interface Winner {
  id: string;
  sub_event_name: string;
  winner_email: string;
  winner_name: string;
  position: string;
  prize: string;
  created_at: string;
}

interface GalleryImage {
  id: string;
  sub_event_name: string;
  image_filename: string;
  caption: string;
  uploaded_at: string;
}

interface SubEvent {
  id: string;
  sub_event_name: string;
  description: string;
  date_time: string;
  venue: string;
}

const ReportsManagement: React.FC = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Current user info
  const currentUser = localStorage.getItem('userData');
  const userName = currentUser ? JSON.parse(currentUser).name : 'vinaymore69';

  // Filter states
  const [selectedYear, setSelectedYear] = useState<string>('all-years');
  const [selectedEventType, setSelectedEventType] = useState<string>('all-types');
  const [selectedStatus, setSelectedStatus] = useState<string>('all-status');
  const [selectedEvent, setSelectedEvent] = useState<string>('all-events');

  // Report options
  const [includeBasicInfo, setIncludeBasicInfo] = useState(true);
  const [includeWinners, setIncludeWinners] = useState(true);
  const [includeGallery, setIncludeGallery] = useState(true);
  const [includeRules, setIncludeRules] = useState(true);
  const [includeContact, setIncludeContact] = useState(true);
  const [includeSubEvents, setIncludeSubEvents] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(false);

  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, selectedYear, selectedEventType, selectedStatus, selectedEvent]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (selectedYear !== 'all-years') {
      filtered = filtered.filter(e => e.year === parseInt(selectedYear));
    }

    if (selectedEventType !== 'all-types') {
      filtered = filtered.filter(e => e.event_type === selectedEventType);
    }

    if (selectedStatus !== 'all-status') {
      filtered = filtered.filter(e => e.status === selectedStatus);
    }

    if (selectedEvent !== 'all-events') {
      filtered = filtered.filter(e => e.id === selectedEvent);
    }

    setFilteredEvents(filtered);
  };

  const fetchWinnersByEvent = async (eventId: string): Promise<Winner[]> => {
    try {
      const { data, error } = await supabase
        .from('event_winners')
        .select('*')
        .eq('event_id', eventId)
        .order('position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching winners:', error);
      return [];
    }
  };

  const fetchGalleryByEvent = async (eventId: string): Promise<GalleryImage[]> => {
    try {
      const { data, error } = await supabase
        .from('event_gallery')
        .select('*')
        .eq('event_id', eventId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching gallery:', error);
      return [];
    }
  };

  const fetchSubEventsByEvent = async (eventId: string): Promise<SubEvent[]> => {
    try {
      const { data, error } = await supabase
        .from('event_sub_events')
        .select('*')
        .eq('event_id', eventId)
        .order('sub_event_name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching sub-events:', error);
      return [];
    }
  };

  const formatDateTime = (dateString: string): string => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const splitTextForPDF = (text: string, maxLength: number = 80): string => {
    if (!text || text.length <= maxLength) return text;
    
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines.join('\n');
  };

  const generatePDF = async () => {
    if (filteredEvents.length === 0) {
      toast({
        title: "No events selected",
        description: "Please select at least one event to generate report",
        variant: "destructive"
      });
      return;
    }

    try {
      setGenerating(true);

      const doc = new jsPDF();
      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 14;

      // Helper function to check if new page is needed
      const checkNewPage = (requiredSpace: number = 20) => {
        if (yPosition + requiredSpace > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
          return true;
        }
        return false;
      };

      // ========== HEADER ==========
      doc.setFontSize(22);
      doc.setTextColor(0, 51, 102);
      doc.setFont('helvetica', 'bold');
      doc.text('EVENT REPORT', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 8;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text('Student Council Xavier', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      
      yPosition += 10;

      // ========== REPORT INFO ==========
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`Generated on: ${new Date().toLocaleString('en-US', { 
        dateStyle: 'full', 
        timeStyle: 'short' 
      })}`, margin, yPosition);
      yPosition += 5;
      doc.text(`Generated by: ${userName}`, margin, yPosition);
      yPosition += 5;
      doc.text(`Total Events in Report: ${filteredEvents.length}`, margin, yPosition);
      
      yPosition += 10;

      // ========== FILTER SUMMARY ==========
      doc.setFontSize(12);
      doc.setTextColor(0, 51, 102);
      doc.setFont('helvetica', 'bold');
      doc.text('Applied Filters:', margin, yPosition);
      yPosition += 7;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);

      const filters = [
        ['Year', selectedYear !== 'all-years' ? selectedYear : 'All Years'],
        ['Type', selectedEventType !== 'all-types' ? selectedEventType : 'All Types'],
        ['Status', selectedStatus !== 'all-status' ? selectedStatus.toUpperCase() : 'All Status'],
      ];

      filters.forEach(([label, value]) => {
        doc.text(`${label}: `, margin + 5, yPosition);
        doc.setFont('helvetica', 'bold');
        doc.text(value, margin + 25, yPosition);
        doc.setFont('helvetica', 'normal');
        yPosition += 5;
      });

      yPosition += 10;

      // ========== PROCESS EACH EVENT ==========
      for (let eventIndex = 0; eventIndex < filteredEvents.length; eventIndex++) {
        const event = filteredEvents[eventIndex];

        checkNewPage(30);

        // Event Number and Title
        doc.setFillColor(0, 102, 204);
        doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 12, 'F');
        
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(`${eventIndex + 1}. ${event.event_name}`, margin + 3, yPosition + 3);
        
        yPosition += 15;

        // ========== BASIC INFORMATION ==========
        if (includeBasicInfo) {
          checkNewPage(50);

          const basicInfoData = [
            ['Parameter', 'Value'],
            ['Event Type', event.event_type || 'N/A'],
            ['Category Name', event.event_category_name || 'N/A'],
            ['Year', event.year?.toString() || 'N/A'],
            ['Status', event.status ? event.status.toUpperCase() : 'N/A'],
            ['Date & Time', formatDateTime(event.date_time)],
            ['Duration', event.duration || 'Not specified'],
            ['Venue', event.venue || 'Not specified'],
          ];

          if (event.description) {
            basicInfoData.push(['Description', splitTextForPDF(event.description, 60)]);
          }

          autoTable(doc, {
            startY: yPosition,
            head: [basicInfoData[0]],
            body: basicInfoData.slice(1),
            theme: 'grid',
            headStyles: { 
              fillColor: [0, 102, 204], 
              textColor: [255, 255, 255],
              fontStyle: 'bold',
              fontSize: 10
            },
            bodyStyles: {
              fontSize: 9
            },
            columnStyles: {
              0: { 
                cellWidth: 55, 
                fontStyle: 'bold',
                fillColor: [240, 248, 255]
              },
              1: { 
                cellWidth: 125,
                cellPadding: 3
              }
            },
            margin: { left: margin, right: margin },
          });

          yPosition = (doc as any).lastAutoTable.finalY + 10;
        }

        // ========== SUB-EVENTS ==========
        if (includeSubEvents) {
          const subEvents = await fetchSubEventsByEvent(event.id);
          
          if (subEvents.length > 0) {
            checkNewPage(40);

            doc.setFontSize(11);
            doc.setTextColor(0, 102, 204);
            doc.setFont('helvetica', 'bold');
            doc.text(`Sub-Events (${subEvents.length})`, margin, yPosition);
            yPosition += 7;

            const subEventsData = subEvents.map(se => [
              se.sub_event_name,
              formatDateTime(se.date_time),
              se.venue || 'Same as main event',
              splitTextForPDF(se.description || 'N/A', 40)
            ]);

            autoTable(doc, {
              startY: yPosition,
              head: [['Sub-Event Name', 'Date & Time', 'Venue', 'Description']],
              body: subEventsData,
              theme: 'striped',
              headStyles: { 
                fillColor: [102, 51, 153],
                fontSize: 9
              },
              bodyStyles: {
                fontSize: 8
              },
              columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 50 },
                2: { cellWidth: 40 },
                3: { cellWidth: 50 }
              },
              margin: { left: margin, right: margin },
            });

            yPosition = (doc as any).lastAutoTable.finalY + 10;
          }
        }

        // ========== RULES & INFORMATION ==========
        if (includeRules && (event.rules || event.code_of_conduct || event.prize_details)) {
          checkNewPage(40);

          doc.setFontSize(11);
          doc.setTextColor(0, 102, 204);
          doc.setFont('helvetica', 'bold');
          doc.text('Rules & Information', margin, yPosition);
          yPosition += 7;

          const rulesData = [];
          if (event.rules) {
            rulesData.push(['Rules', splitTextForPDF(event.rules, 70)]);
          }
          if (event.code_of_conduct) {
            rulesData.push(['Code of Conduct', splitTextForPDF(event.code_of_conduct, 70)]);
          }
          if (event.prize_details) {
            rulesData.push(['Prize Details', splitTextForPDF(event.prize_details, 70)]);
          }

          if (rulesData.length > 0) {
            autoTable(doc, {
              startY: yPosition,
              head: [['Section', 'Details']],
              body: rulesData,
              theme: 'grid',
              headStyles: { 
                fillColor: [76, 175, 80],
                fontSize: 9
              },
              bodyStyles: {
                fontSize: 8
              },
              columnStyles: {
                0: { 
                  cellWidth: 45, 
                  fontStyle: 'bold',
                  fillColor: [232, 245, 233]
                },
                1: { cellWidth: 135 }
              },
              margin: { left: margin, right: margin },
            });

            yPosition = (doc as any).lastAutoTable.finalY + 10;
          }
        }

        // ========== CONTACT INFORMATION ==========
        if (includeContact && (event.contact_details || event.socials)) {
          checkNewPage(40);

          doc.setFontSize(11);
          doc.setTextColor(0, 102, 204);
          doc.setFont('helvetica', 'bold');
          doc.text('Contact & Social Media', margin, yPosition);
          yPosition += 7;

          const contactData = [];
          
          // Contact Details
          if (event.contact_details?.email) {
            contactData.push(['Email', event.contact_details.email]);
          }
          if (event.contact_details?.phone) {
            contactData.push(['Phone', event.contact_details.phone]);
          }
          if (event.contact_details?.whatsapp) {
            contactData.push(['WhatsApp', event.contact_details.whatsapp]);
          }

          // Social Media
          if (event.socials?.facebook) {
            contactData.push(['Facebook', event.socials.facebook]);
          }
          if (event.socials?.instagram) {
            contactData.push(['Instagram', event.socials.instagram]);
          }
          if (event.socials?.twitter) {
            contactData.push(['Twitter', event.socials.twitter]);
          }
          if (event.socials?.linkedin) {
            contactData.push(['LinkedIn', event.socials.linkedin]);
          }

          if (contactData.length > 0) {
            autoTable(doc, {
              startY: yPosition,
              head: [['Contact Type', 'Details']],
              body: contactData,
              theme: 'grid',
              headStyles: { 
                fillColor: [255, 152, 0],
                fontSize: 9
              },
              bodyStyles: {
                fontSize: 8
              },
              columnStyles: {
                0: { 
                  cellWidth: 50, 
                  fontStyle: 'bold',
                  fillColor: [255, 243, 224]
                },
                1: { cellWidth: 130 }
              },
              margin: { left: margin, right: margin },
            });

            yPosition = (doc as any).lastAutoTable.finalY + 10;
          }
        }

        // ========== WINNERS ==========
        if (includeWinners) {
          const winners = await fetchWinnersByEvent(event.id);
          
          if (winners.length > 0) {
            checkNewPage(40);

            doc.setFontSize(11);
            doc.setTextColor(0, 102, 204);
            doc.setFont('helvetica', 'bold');
            doc.text(`Winners & Achievements (${winners.length})`, margin, yPosition);
            yPosition += 7;

            const winnersData = winners.map(w => [
              w.sub_event_name || 'Main Event',
              w.winner_name || 'N/A',
              w.winner_email,
              w.position,
              w.prize || 'N/A'
            ]);

            autoTable(doc, {
              startY: yPosition,
              head: [['Sub-Event', 'Winner Name', 'Email', 'Position', 'Prize']],
              body: winnersData,
              theme: 'striped',
              headStyles: { 
                fillColor: [255, 193, 7],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                fontSize: 9
              },
              bodyStyles: {
                fontSize: 8
              },
              columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 35 },
                2: { cellWidth: 45 },
                3: { cellWidth: 30 },
                4: { cellWidth: 35 }
              },
              margin: { left: margin, right: margin },
            });

            yPosition = (doc as any).lastAutoTable.finalY + 10;
          }
        }

        // ========== GALLERY SUMMARY ==========
        if (includeGallery) {
          const galleryImages = await fetchGalleryByEvent(event.id);
          
          if (galleryImages.length > 0) {
            checkNewPage(40);

            doc.setFontSize(11);
            doc.setTextColor(0, 102, 204);
            doc.setFont('helvetica', 'bold');
            doc.text(`Gallery Images (${galleryImages.length} total)`, margin, yPosition);
            yPosition += 7;

            // Group by sub-event
            const groupedImages: { [key: string]: GalleryImage[] } = {};
            galleryImages.forEach(img => {
              const key = img.sub_event_name || 'Main Event';
              if (!groupedImages[key]) groupedImages[key] = [];
              groupedImages[key].push(img);
            });

            const galleryData = Object.entries(groupedImages).map(([subEvent, images]) => [
              subEvent,
              images.length.toString(),
              formatDateTime(images[0].uploaded_at)
            ]);

            autoTable(doc, {
              startY: yPosition,
              head: [['Category/Sub-Event', 'Images Count', 'Last Upload']],
              body: galleryData,
              theme: 'grid',
              headStyles: { 
                fillColor: [76, 175, 80],
                fontSize: 9
              },
              bodyStyles: {
                fontSize: 8
              },
              columnStyles: {
                0: { cellWidth: 70 },
                1: { cellWidth: 40, halign: 'center' },
                2: { cellWidth: 70 }
              },
              margin: { left: margin, right: margin },
            });

            yPosition = (doc as any).lastAutoTable.finalY + 10;
          }
        }

        // ========== METADATA ==========
        if (includeMetadata) {
          checkNewPage(30);

          doc.setFontSize(11);
          doc.setTextColor(0, 102, 204);
          doc.setFont('helvetica', 'bold');
          doc.text('Event Metadata', margin, yPosition);
          yPosition += 7;

          const metadataData = [
            ['Created By', event.created_by || 'N/A'],
            ['Created At', formatDateTime(event.created_at)],
            ['Last Updated', formatDateTime(event.updated_at)],
            ['Event ID', event.id]
          ];

          autoTable(doc, {
            startY: yPosition,
            body: metadataData,
            theme: 'plain',
            bodyStyles: {
              fontSize: 8,
              textColor: [100, 100, 100]
            },
            columnStyles: {
              0: { 
                cellWidth: 50, 
                fontStyle: 'bold',
              },
              1: { cellWidth: 130 }
            },
            margin: { left: margin, right: margin },
          });

          yPosition = (doc as any).lastAutoTable.finalY + 10;
        }

        // ========== SEPARATOR BETWEEN EVENTS ==========
        if (eventIndex < filteredEvents.length - 1) {
          checkNewPage(20);
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.5);
          doc.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 15;
        }
      }

      // ========== ADD FOOTER TO ALL PAGES ==========
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Footer line
        doc.setDrawColor(0, 102, 204);
        doc.setLineWidth(0.3);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
        
        // Footer text
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.setFont('helvetica', 'normal');
        doc.text(
          'Student Council Xavier - Event Management Report',
          margin,
          pageHeight - 10
        );
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - margin - 20,
          pageHeight - 10
        );
      }

      // ========== SAVE PDF ==========
      const timestamp = new Date().getTime();
      const yearLabel = selectedYear !== 'all-years' ? selectedYear : 'AllYears';
      const fileName = `Event_Report_${yearLabel}_${timestamp}.pdf`;
      doc.save(fileName);

      toast({
        title: "Success",
        description: `Report generated successfully: ${fileName}`,
      });

    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate PDF report",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const availableYears = Array.from(new Set(events.map(e => e.year))).sort((a, b) => b - a);
  const availableTypes = Array.from(new Set(events.map(e => e.event_type)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generate Reports</h1>
          <p className="text-gray-500 mt-1">Generate detailed PDF reports for events with custom parameters</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{events.length}</div>
                <p className="text-sm text-gray-500">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredEvents.length}</div>
                <p className="text-sm text-gray-500">Filtered Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{availableYears.length}</div>
                <p className="text-sm text-gray-500">Years Available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{availableTypes.length}</div>
                <p className="text-sm text-gray-500">Event Types</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Year Filter */}
              <div>
                <Label>Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-years">All Years</SelectItem>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Event Type Filter */}
              <div>
                <Label>Event Type</Label>
                <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All Types</SelectItem>
                    {availableTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <Label>Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Specific Event */}
              <div>
                <Label>Specific Event (Optional)</Label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-events">All Events</SelectItem>
                    {filteredEvents.map(event => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.event_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Include in Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="basicInfo" 
                checked={includeBasicInfo}
                onCheckedChange={(checked) => setIncludeBasicInfo(checked as boolean)}
              />
              <label
                htmlFor="basicInfo"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-blue-600" />
                Basic Information
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="subEvents" 
                checked={includeSubEvents}
                onCheckedChange={(checked) => setIncludeSubEvents(checked as boolean)}
              />
              <label
                htmlFor="subEvents"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-purple-600" />
                Sub-Events
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="winners" 
                checked={includeWinners}
                onCheckedChange={(checked) => setIncludeWinners(checked as boolean)}
              />
              <label
                htmlFor="winners"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
              >
                <Trophy className="h-4 w-4 text-yellow-600" />
                Winners Data
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="gallery" 
                checked={includeGallery}
                onCheckedChange={(checked) => setIncludeGallery(checked as boolean)}
              />
              <label
                htmlFor="gallery"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
              >
                <ImageIcon className="h-4 w-4 text-green-600" />
                Gallery Summary
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rules" 
                checked={includeRules}
                onCheckedChange={(checked) => setIncludeRules(checked as boolean)}
              />
              <label
                htmlFor="rules"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
              >
                <Award className="h-4 w-4 text-orange-600" />
                Rules & Details
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="contact" 
                checked={includeContact}
                onCheckedChange={(checked) => setIncludeContact(checked as boolean)}
              />
              <label
                htmlFor="contact"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
              >
                <Users className="h-4 w-4 text-indigo-600" />
                Contact Info
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="metadata" 
                checked={includeMetadata}
                onCheckedChange={(checked) => setIncludeMetadata(checked as boolean)}
              />
              <label
                htmlFor="metadata"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-gray-600" />
                Event Metadata
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No events match filters</h3>
              <p className="text-gray-500">Adjust your filters to see events</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Report will include:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1.5 ml-7">
                  <li>• {filteredEvents.length} event(s)</li>
                  {includeBasicInfo && <li>• Basic event information (name, type, date, venue, etc.)</li>}
                  {includeSubEvents && <li>• Sub-events list with details</li>}
                  {includeRules && <li>• Rules, code of conduct, and prize details</li>}
                  {includeContact && <li>• Contact information and social media links</li>}
                  {includeWinners && <li>• Winners list with positions and prizes</li>}
                  {includeGallery && <li>• Gallery images summary by category</li>}
                  {includeMetadata && <li>• Event metadata (created by, dates, IDs)</li>}
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Events to be included:
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredEvents.map((event, index) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-500 bg-white px-2 py-1 rounded">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{event.event_name}</p>
                          <p className="text-sm text-gray-500">
                            {event.event_type} • {event.year} • {event.venue || 'No venue'}
                          </p>
                        </div>
                      </div>
                      <Badge className={
                        event.status === 'upcoming' ? 'bg-blue-500' :
                        event.status === 'ongoing' ? 'bg-green-500' :
                        'bg-gray-500'
                      }>
                        {event.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={generatePDF} 
                disabled={generating || filteredEvents.length === 0}
                className="w-full"
                size="lg"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating PDF Report...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Generate PDF Report ({filteredEvents.length} Event{filteredEvents.length !== 1 ? 's' : ''})
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsManagement;