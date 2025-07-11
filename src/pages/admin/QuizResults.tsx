
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService, QuizResult } from '@/services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, AlertCircle, Activity } from 'lucide-react';

export default function QuizResults() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await apiService.getQuizResults();
        setResults(data);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const getStatusColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'mức độ tạm ổn':
        return 'bg-green-100 text-green-800';
      case 'nhẹ':
        return 'bg-yellow-100 text-yellow-800';
      case 'trung bình':
        return 'bg-orange-100 text-orange-800';
      case 'nặng':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'mức độ tạm ổn':
        return <CheckCircle className="h-4 w-4" />;
      case 'nhẹ':
        return <AlertCircle className="h-4 w-4" />;
      case 'trung bình':
        return <AlertTriangle className="h-4 w-4" />;
      case 'nặng':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quiz Results Analytics</h1>
        <p className="text-gray-600">Mental health assessment results and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="userInfo.fullName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="scores.anxiety" fill="#ef4444" name="Anxiety" />
                <Bar dataKey="scores.depression" fill="#f59e0b" name="Depression" />
                <Bar dataKey="scores.stress" fill="#3b82f6" name="Stress" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Level Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(
                results.reduce((acc, result) => {
                  const level = result.recommendation.level;
                  acc[level] = (acc[level] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(level)}
                    <span className="font-medium">{level}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">{count}</span>
                    <span className="text-sm text-gray-500">patients</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.slice(0, 10).map((result) => (
              <div
                key={result._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{result.userInfo.fullName}</h3>
                    <p className="text-sm text-gray-500">{result.domainTitle}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(result.recommendation.level)}>
                        {result.recommendation.level}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex space-x-4 text-sm">
                    <div>
                      <span className="text-gray-500">Anxiety:</span>
                      <span className="font-semibold ml-1">{result.scores.anxiety}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Depression:</span>
                      <span className="font-semibold ml-1">{result.scores.depression}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Stress:</span>
                      <span className="font-semibold ml-1">{result.scores.stress}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="font-semibold ml-1">{result.scores.total}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(result.completedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
