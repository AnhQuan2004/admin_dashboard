
import { useState, useEffect } from 'react';
import { Users, MessageSquare, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService, User, QuizResult, ChatConversation } from '@/services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, quizData, chatData] = await Promise.all([
          apiService.getUsers(),
          apiService.getQuizResults(),
          apiService.getChatConversations()
        ]);
        
        setUsers(usersData.users);
        setQuizResults(quizData);
        setConversations(chatData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Quiz Results',
      value: quizResults.length,
      icon: BarChart3,
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Conversations',
      value: conversations.length,
      icon: MessageSquare,
      change: '+23%',
      changeType: 'positive'
    },
    {
      title: 'Avg Mental Health Score',
      value: Math.round(quizResults.reduce((acc, result) => acc + result.scores.total, 0) / (quizResults.length || 1)),
      icon: TrendingUp,
      change: '-2%',
      changeType: 'negative'
    }
  ];

  const stressLevelData = quizResults.reduce((acc, result) => {
    const level = result.recommendation.level;
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(stressLevelData).map(([level, count]) => ({
    name: level,
    value: count
  }));

  const monthlyData = quizResults.reduce((acc, result) => {
    const month = new Date(result.completedAt).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.count += 1;
      existing.avgScore += result.scores.total;
    } else {
      acc.push({ month, count: 1, avgScore: result.scores.total });
    }
    return acc;
  }, [] as Array<{ month: string; count: number; avgScore: number }>);

  monthlyData.forEach(item => {
    item.avgScore = Math.round(item.avgScore / item.count);
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Quiz Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mental Health Risk Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
