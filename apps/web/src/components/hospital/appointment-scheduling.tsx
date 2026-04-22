"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Plus,
  Search,
  User,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  patientMRN: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled" | "in-progress";
}

export function AppointmentScheduling() {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patientMRN: "",
    patientName: "",
    department: "",
    doctor: "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentType: "",
    notes: "",
  });

  // Mock appointments data
  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "John Doe",
      patientMRN: "MRN001247",
      doctor: "Dr. Sarah Johnson",
      department: "Cardiology",
      date: "2024-04-22",
      time: "10:00 AM",
      type: "Consultation",
      status: "scheduled",
    },
    {
      id: "2",
      patientName: "Jane Smith",
      patientMRN: "MRN001248",
      doctor: "Dr. Michael Chen",
      department: "Orthopedics",
      date: "2024-04-22",
      time: "11:30 AM",
      type: "Follow-up",
      status: "in-progress",
    },
    {
      id: "3",
      patientName: "Bob Johnson",
      patientMRN: "MRN001249",
      doctor: "Dr. Emily Davis",
      department: "General Medicine",
      date: "2024-04-22",
      time: "02:00 PM",
      type: "Consultation",
      status: "scheduled",
    },
    {
      id: "4",
      patientName: "Alice Williams",
      patientMRN: "MRN001250",
      doctor: "Dr. Sarah Johnson",
      department: "Cardiology",
      date: "2024-04-22",
      time: "09:00 AM",
      type: "Consultation",
      status: "completed",
    },
  ]);

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.date === selectedDate &&
      (apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientMRN.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.doctor.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const statusCounts = {
    scheduled: appointments.filter((a) => a.date === selectedDate && a.status === "scheduled")
      .length,
    completed: appointments.filter((a) => a.date === selectedDate && a.status === "completed")
      .length,
    inProgress: appointments.filter((a) => a.date === selectedDate && a.status === "in-progress")
      .length,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("New appointment scheduled:", formData);

    setIsSubmitting(false);
    setShowForm(false);
    setFormData({
      patientMRN: "",
      patientName: "",
      department: "",
      doctor: "",
      appointmentDate: "",
      appointmentTime: "",
      appointmentType: "",
      notes: "",
    });
  };

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "default";
      case "completed":
        return "outline";
      case "in-progress":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{statusCounts.scheduled}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{statusCounts.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-secondary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{statusCounts.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="sm:w-auto"
        />
        <Button onClick={() => setShowForm(!showForm)} className="sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Cancel" : "New Appointment"}
        </Button>
      </div>

      {/* Appointment Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Schedule New Appointment</CardTitle>
            <CardDescription>Fill in the details to book an appointment</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Patient MRN *</label>
                  <Input
                    required
                    value={formData.patientMRN}
                    onChange={(e) => setFormData({ ...formData, patientMRN: e.target.value })}
                    placeholder="MRN001234"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Patient Name *</label>
                  <Input
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department *</label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select department</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="orthopedics">Orthopedics</option>
                    <option value="general">General Medicine</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="neurology">Neurology</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Doctor *</label>
                  <select
                    required
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select doctor</option>
                    <option value="dr-johnson">Dr. Sarah Johnson</option>
                    <option value="dr-chen">Dr. Michael Chen</option>
                    <option value="dr-davis">Dr. Emily Davis</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date *</label>
                  <Input
                    required
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time *</label>
                  <Input
                    required
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Appointment Type *</label>
                <select
                  required
                  value={formData.appointmentType}
                  onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select type</option>
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="procedure">Procedure</option>
                  <option value="lab-test">Lab Test</option>
                  <option value="imaging">Imaging</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Appointment
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Appointments for {new Date(selectedDate).toLocaleDateString()}
          </CardTitle>
          <CardDescription>
            {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold truncate">{appointment.patientName}</p>
                      <Badge variant="outline" className="text-xs">
                        {appointment.patientMRN}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {appointment.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Stethoscope className="h-3 w-3" />
                        {appointment.doctor}
                      </span>
                      <span>{appointment.department}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <Badge variant={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                  <Button variant="outline" size="sm" className="text-xs">
                    View
                  </Button>
                </div>
              </div>
            ))}

            {filteredAppointments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No appointments found</p>
                <p className="text-sm">Try selecting a different date</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
