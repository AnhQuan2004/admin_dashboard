
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, MessageSquare, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Healthcare Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive mental health monitoring and user management system. 
            Track quiz results, monitor conversations, and manage user data with powerful analytics.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Access Admin Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-gray-800">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Monitor and manage user accounts, track registration trends, and view user activities.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-gray-800">Quiz Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Analyze mental health assessment results with detailed scoring and risk level insights.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-gray-800">Chat Monitor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Track expert bot conversations and monitor user support interactions in real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-gray-800">Health Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get comprehensive insights into mental health trends and patient care metrics.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Powerful Healthcare Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built with modern React technologies, this dashboard provides healthcare professionals 
            with the tools they need to monitor patient wellbeing and manage care effectively.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
