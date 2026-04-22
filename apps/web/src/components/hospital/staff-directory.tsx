"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  User,
  Phone,
  Mail,
  Stethoscope,
  UserCheck,
  Clock,
  Calendar,
} from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  role: "doctor" | "nurse" | "technician" | "admin";
  department: string;
  specialty?: string;
  phone: string;
  email: string;
  status: "on-duty" | "off-duty" | "on-leave";
  shift?: string;
}

export function StaffDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Mock staff data
  const [staff] = useState<StaffMember[]>([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      role: "doctor",
      department: "Cardiology",
      specialty: "Interventional Cardiology",
      phone: "+1234567890",
      email: "s.johnson@hospital.com",
      status: "on-duty",
      shift: "Morning (8AM - 4PM)",
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      role: "doctor",
      department: "Orthopedics",
      specialty: "Sports Medicine",
      phone: "+1234567891",
      email: "m.chen@hospital.com",
      status: "on-duty",
      shift: "Afternoon (12PM - 8PM)",
    },
    {
      id: "3",
      name: "Dr. Emily Davis",
      role: "doctor",
      department: "General Medicine",
      phone: "+1234567892",
      email: "e.davis@hospital.com",
      status: "off-duty",
      shift: "Night (8PM - 8AM)",
    },
    {
      id: "4",
      name: "Nurse Jennifer Williams",
      role: "nurse",
      department: "Emergency",
      phone: "+1234567893",
      email: "j.williams@hospital.com",
      status: "on-duty",
      shift: "Morning (8AM - 4PM)",
    },
    {
      id: "5",
      name: "Nurse Robert Brown",
      role: "nurse",
      department: "ICU",
      phone: "+1234567894",
      email: "r.brown@hospital.com",
      status: "on-duty",
      shift: "Afternoon (12PM - 8PM)",
    },
    {
      id: "6",
      name: "Tech Lisa Anderson",
      role: "technician",
      department: "Radiology",
      phone: "+1234567895",
      email: "l.anderson@hospital.com",
      status: "on-duty",
      shift: "Morning (8AM - 4PM)",
    },
    {
      id: "7",
      name: "Admin Mark Taylor",
      role: "admin",
      department: "Administration",
      phone: "+1234567896",
      email: "m.taylor@hospital.com",
      status: "on-duty",
      shift: "Day (9AM - 5PM)",
    },
  ]);

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesRole = filterRole === "all" || member.role === filterRole;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const staffCounts = {
    total: staff.length,
    onDuty: staff.filter((s) => s.status === "on-duty").length,
    doctors: staff.filter((s) => s.role === "doctor").length,
    nurses: staff.filter((s) => s.role === "nurse").length,
  };

  const getRoleIcon = (role: StaffMember["role"]) => {
    switch (role) {
      case "doctor":
        return <Stethoscope className="h-5 w-5 text-primary" />;
      case "nurse":
        return <UserCheck className="h-5 w-5 text-secondary" />;
      case "technician":
        return <User className="h-5 w-5 text-muted-foreground" />;
      case "admin":
        return <User className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRoleBadgeColor = (role: StaffMember["role"]) => {
    switch (role) {
      case "doctor":
        return "default";
      case "nurse":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadgeColor = (status: StaffMember["status"]) => {
    switch (status) {
      case "on-duty":
        return "default";
      case "off-duty":
        return "outline";
      case "on-leave":
        return "destructive";
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Staff</p>
                <p className="text-2xl font-bold">{staffCounts.total}</p>
              </div>
              <User className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Duty</p>
                <p className="text-2xl font-bold">{staffCounts.onDuty}</p>
              </div>
              <Clock className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Doctors</p>
                <p className="text-2xl font-bold">{staffCounts.doctors}</p>
              </div>
              <Stethoscope className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nurses</p>
                <p className="text-2xl font-bold">{staffCounts.nurses}</p>
              </div>
              <UserCheck className="h-8 w-8 text-secondary opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff by name, department, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm sm:w-40"
            >
              <option value="all">All Roles</option>
              <option value="doctor">Doctors</option>
              <option value="nurse">Nurses</option>
              <option value="technician">Technicians</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm sm:w-40"
            >
              <option value="all">All Status</option>
              <option value="on-duty">On Duty</option>
              <option value="off-duty">Off Duty</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Staff Members</CardTitle>
          <CardDescription>
            {filteredStaff.length} staff member{filteredStaff.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStaff.map((member) => (
              <div
                key={member.id}
                className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-muted">{getRoleIcon(member.role)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold">{member.name}</p>
                      <Badge variant={getRoleBadgeColor(member.role)} className="text-xs">
                        {member.role}
                      </Badge>
                      <Badge variant={getStatusBadgeColor(member.status)} className="text-xs">
                        {member.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {member.department}
                        {member.specialty && ` • ${member.specialty}`}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </span>
                        {member.shift && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {member.shift}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 lg:flex-col">
                  <Button variant="outline" size="sm" className="flex-1 lg:flex-none text-xs">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 lg:flex-none text-xs">
                    Contact
                  </Button>
                </div>
              </div>
            ))}

            {filteredStaff.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No staff members found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              View Shift Schedule
            </Button>
            <Button variant="outline" className="justify-start">
              <Clock className="mr-2 h-4 w-4" />
              Track Attendance
            </Button>
            <Button variant="outline" className="justify-start">
              <User className="mr-2 h-4 w-4" />
              Add New Staff
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
