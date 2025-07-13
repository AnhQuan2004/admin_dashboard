import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, ButtonProps } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiService, ExpertApplication } from "@/services/api";
import { Check, X, Mail, Phone, Award, Calendar, FileText } from "lucide-react";

export default function ExpertApplications() {
  const [applications, setApplications] = useState<ExpertApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] =
    useState<ExpertApplication | null>(null);

  const fetchApplications = async () => {
    try {
      const data = await apiService.getExpertApplications();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching expert applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (appId: string) => {
    try {
      await apiService.approveExpertApplication(appId);
      fetchApplications();
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async (appId: string) => {
    try {
      await apiService.rejectExpertApplication(appId);
      fetchApplications();
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const handleViewDetails = async (appId: string) => {
    try {
      const applicationDetails = await apiService.getExpertApplication(appId);
      setSelectedApplication(applicationDetails);
    } catch (error) {
      console.error("Error fetching application details:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const pendingApplications = applications.filter(
    (app) => app.status === "pending"
  );
  const processedApplications = applications.filter(
    (app) => app.status !== "pending"
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Expert Applications</h1>

      <Card>
        <CardHeader>
          <CardTitle>
            Pending Applications ({pendingApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApplications.map((app) => (
              <div
                key={app._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="font-semibold">{app.fullName}</p>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{app.personalEmail}</span>
                    </div>
                    {app.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{app.phone}</span>
                      </div>
                    )}
                    {app.specialty && (
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4" />
                        <span>{app.specialty}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Applied:{" "}
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(app._id)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleApprove(app._id)}
                  >
                    <Check className="h-4 w-4 mr-2" /> Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(app._id)}
                  >
                    <X className="h-4 w-4 mr-2" /> Reject
                  </Button>
                </div>
              </div>
            ))}
            {pendingApplications.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No pending applications
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {processedApplications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Processed Applications ({processedApplications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedApplications.map((app) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="font-semibold">{app.fullName}</p>
                      <Badge
                        variant={
                          app.status === "approved" ? "default" : "destructive"
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{app.personalEmail}</span>
                      </div>
                      {app.specialty && (
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4" />
                          <span>{app.specialty}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Applied:{" "}
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(app._id)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Details Modal */}
      {selectedApplication && (
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedApplication.fullName}
                </h3>
                <p className="text-gray-500">
                  {selectedApplication.personalEmail}
                </p>
                <Badge
                  variant={
                    selectedApplication.status === "approved"
                      ? "default"
                      : selectedApplication.status === "rejected"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {selectedApplication.status}
                </Badge>
              </div>

              {selectedApplication.phone && (
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <p className="text-sm text-gray-600">
                    {selectedApplication.phone}
                  </p>
                </div>
              )}

              {selectedApplication.specialty && (
                <div>
                  <h4 className="font-medium">Specialization</h4>
                  <p className="text-sm text-gray-600">
                    {selectedApplication.specialty}
                  </p>
                </div>
              )}

              {selectedApplication.education && (
                <div>
                  <h4 className="font-medium">Education</h4>
                  <p className="text-sm text-gray-600">
                    {selectedApplication.education}
                  </p>
                </div>
              )}

              {selectedApplication.experience && (
                <div>
                  <h4 className="font-medium">Experience</h4>
                  <p className="text-sm text-gray-600">
                    {selectedApplication.experience} years
                  </p>
                </div>
              )}

              {selectedApplication.bio && (
                <div>
                  <h4 className="font-medium">Bio</h4>
                  <p className="text-sm text-gray-600">
                    {selectedApplication.bio}
                  </p>
                </div>
              )}

              {selectedApplication.approach && (
                <div>
                  <h4 className="font-medium">Approach</h4>
                  <p className="text-sm text-gray-600">
                    {selectedApplication.approach}
                  </p>
                </div>
              )}

              {selectedApplication.licenseNumber && (
                <div>
                  <h4 className="font-medium">License Number</h4>
                  <p className="text-sm text-gray-600">
                    {selectedApplication.licenseNumber}
                  </p>
                </div>
              )}

              {selectedApplication.languages &&
                selectedApplication.languages.length > 0 && (
                  <div>
                    <h4 className="font-medium">Languages</h4>
                    <p className="text-sm text-gray-600">
                      {selectedApplication.languages.join(", ")}
                    </p>
                  </div>
                )}

              {selectedApplication.availability &&
                selectedApplication.availability.length > 0 && (
                  <div>
                    <h4 className="font-medium">Availability</h4>
                    <p className="text-sm text-gray-600">
                      {selectedApplication.availability.join(", ")}
                    </p>
                  </div>
                )}

              <div>
                <h4 className="font-medium">Application Date</h4>
                <p className="text-sm text-gray-600">
                  {new Date(selectedApplication.submittedAt).toLocaleString()}
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedApplication(null)}
                >
                  Close
                </Button>
                {selectedApplication.status === "pending" && (
                  <>
                    <Button
                      variant="default"
                      onClick={() => {
                        handleApprove(selectedApplication._id);
                        setSelectedApplication(null);
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" /> Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleReject(selectedApplication._id);
                        setSelectedApplication(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" /> Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
