
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService, ChatConversation } from '@/services/api';
import { MessageSquare, Bot, User, Clock } from 'lucide-react';

export default function Conversations() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await apiService.getChatConversations();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chat Conversations</h1>
        <p className="text-gray-600">Monitor expert chat interactions and support sessions</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {conversations.map((conversation) => (
          <Card key={conversation._id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Session: {conversation.sessionId}</span>
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(conversation.createdAt).toLocaleString()}</span>
                </div>
              </div>
              {conversation.userInfo && (
                <div className="text-sm text-gray-600 pt-2">
                  <p><strong>User:</strong> {conversation.userInfo.fullName} ({conversation.userInfo.email})</p>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {conversation.conversations.map((chat, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0">
                    {/* User Message */}
                    <div className="p-4 bg-blue-50">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-blue-900">User</span>
                            <Badge variant="outline" className="text-xs">
                              {chat.userStatus}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(chat.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-gray-800">{chat.userMessage}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bot Response */}
                    <div className="p-4 bg-white">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-green-900">Expert Bot</span>
                            <Badge variant="outline" className="text-xs">
                              {chat.botStatus}
                            </Badge>
                          </div>
                          <p className="text-gray-800">{chat.botResponse}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {conversations.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <MessageSquare className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No conversations found</h3>
              <p className="text-gray-500">Chat conversations will appear here when users interact with the expert bot</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
