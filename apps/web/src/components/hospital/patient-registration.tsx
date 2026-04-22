"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, User, Phone, Mail, Calendar, MapPin, Loader2 } from "lucide-react";

interface Patient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  registeredDate: string;
  status: "active" | "inactive";
}

export function PatientRegistration() {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    insurance: "",
  });

  // Mock patient data
  const [patients] = useState<Patient[]>([
    {
      id: "1",
      mrn: "MRN001247",
      name: "John Doe",
      age: 45,
      gender: "Male",
      phone: "+1234567890",
      email: "john.doe@email.com",
      address: "123 Main St, City",
      registeredDate: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      mrn: "MRN001248",
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      phone: "+1234567891",
      email: "jane.smith@email.com",
      address: "456 Oak Ave, City",
      registeredDate: "2024-02-20",
      status: "active",
    },
    {
      id: "3",
      mrn: "MRN001249",
      name: "Bob Johnson",
      age: 58,
      gender: "Male",
      phone: "+1234567892",
      email: "bob.j@email.com",
      address: "789 Pine Rd, City",
      registeredDate: "2024-03-10",
      status: "active",
    },
  ]);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate MRN
    const mrn = `MRN${String(Date.now()).slice(-6)}`;
    console.log("New patient registered:", { mrn, ...formData });

    setIsSubmitting(false);
    setShowForm(false);
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      emergencyContact: "",
      emergencyPhone: "",
      insurance: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, MRN, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="sm:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          {showForm ? "Cancel" : "Register New Patient"}
        </Button>
      </div>

      {/* Registration Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Patient Registration</CardTitle>
            <CardDescription>Enter patient information to create a new record</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Personal Information</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name *</label>
                    <Input
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name *</label>
                    <Input
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date of Birth *</label>
                    <Input
                      required
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gender *</label>
                    <select
                      required
                      value={formData.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Contact Information</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number *</label>
                    <Input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="patient@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Address *</label>
                  <Input
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Emergency Contact</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Name *</label>
                    <Input
                      required
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Phone *</label>
                    <Input
                      required
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </div>

              {/* Insurance */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Insurance Information</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Insurance Provider</label>
                  <Input
                    value={formData.insurance}
                    onChange={(e) => handleInputChange("insurance", e.target.value)}
                    placeholder="Insurance company name"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering Patient...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register Patient
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registered Patients</CardTitle>
          <CardDescription>
            {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold truncate">{patient.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {patient.mrn}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {patient.age} years
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {patient.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {patient.address}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <Badge variant={patient.status === "active" ? "default" : "outline"}>
                    {patient.status}
                  </Badge>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Details
                  </Button>
                </div>
              </div>
            ))}

            {filteredPatients.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No patients found</p>
                <p className="text-sm">Try adjusting your search query</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
