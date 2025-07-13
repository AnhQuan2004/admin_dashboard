import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { apiService, Expert } from "@/services/api";
import { Eye, Mail, Phone, Calendar, Award } from "lucide-react";

export default function Experts() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  const fetchExperts = async () => {
    try {
      const data = await apiService.getExperts();
      setExperts(data);
    } catch (error) {
      console.error("Error fetching experts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleToggleStatus = async (expertId: string) => {
    try {
      await apiService.toggleExpertStatus(expertId);
      fetchExperts();
    } catch (error) {
      console.error("Error toggling expert status:", error);
    }
  };

  const handleViewProfile = async (expertEmail: string) => {
    try {
      const expertProfile = await apiService.getExpertProfile(expertEmail);
      setSelectedExpert(expertProfile);
    } catch (error) {
      console.error("Error fetching expert profile:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Expert Accounts</h1>

      <Card>
        <CardHeader>
          <CardTitle>Approved Experts ({experts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {experts.map((expert) => (
              <div
                key={expert._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="font-semibold">{expert.fullName}</p>
                    <Badge variant={expert.isActive ? "default" : "secondary"}>
                      {expert.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{expert.email}</span>
                    </div>
                    {expert.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{expert.phone}</span>
                      </div>
                    )}
                    {expert.specialization && (
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4" />
                        <span>{expert.specialization}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Approved:{" "}
                        {new Date(expert.approvedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Switch
                    checked={expert.isActive}
                    onCheckedChange={() => handleToggleStatus(expert._id)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProfile(expert.email)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expert Profile Modal/Details */}
      {selectedExpert && (
        <Card>
          <CardHeader>
            <CardTitle>Expert Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedExpert.fullName}
                </h3>
                <p className="text-gray-500">{selectedExpert.email}</p>
              </div>

              {selectedExpert.specialization && (
                <div>
                  <h4 className="font-medium">Specialization</h4>
                  <p className="text-sm text-gray-600">
                    {selectedExpert.specialization}
                  </p>
                </div>
              )}

              {selectedExpert.experience && (
                <div>
                  <h4 className="font-medium">Experience</h4>
                  <p className="text-sm text-gray-600">
                    {selectedExpert.experience}
                  </p>
                </div>
              )}

              {selectedExpert.qualifications && (
                <div>
                  <h4 className="font-medium">Qualifications</h4>
                  <p className="text-sm text-gray-600">
                    {selectedExpert.qualifications}
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedExpert(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
