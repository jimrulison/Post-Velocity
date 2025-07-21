import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [userStatus, setUserStatus] = useState({ type: 'free', usage: 0 });
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('demo-company');

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    // Load initial data
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/companies`);
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const generateContent = async (topic) => {
    try {
      const response = await fetch(`${backendUrl}/api/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: selectedCompany,
          topic: topic,
          platforms: ['instagram', 'facebook', 'linkedin'],
          audience_level: 'general'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.generated_content;
      }
    } catch (error) {
      console.error('Error generating content:', error);
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-lg mr-3"></div>
                <h1 className="text-xl font-bold text-gray-900">PostVelocity</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {userStatus.type === 'free' ? '👋 Free User' : 
                 userStatus.type === 'trial' ? '⏰ Trial User' : 
                 '💎 Premium User'}
              </span>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'content', label: '📝 Content Hub', icon: '📝' },
              { id: 'analytics', label: '📊 Analytics', icon: '📊' },
              { id: 'media', label: '📸 Media Library', icon: '📸' },
              { id: 'calendar', label: '📅 Calendar', icon: '📅' },
              { id: 'automation', label: '🤖 Automation', icon: '🤖' },
              { id: 'training', label: '🎓 Training', icon: '🎓' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'content' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Content Hub</h2>
              
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">⚡ Smart Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => generateContent('trending safety topic')}
                    className="bg-purple-500 text-white px-4 py-3 rounded-lg text-center hover:bg-purple-600"
                  >
                    🧠 Smart Generate
                  </button>
                  <button className="bg-green-500 text-white px-4 py-3 rounded-lg text-center hover:bg-green-600">
                    📅 Weekly Batch
                  </button>
                  <button className="bg-red-500 text-white px-4 py-3 rounded-lg text-center hover:bg-red-600">
                    🚨 Emergency Post
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-3 rounded-lg text-center hover:bg-blue-600">
                    🎤 Voice Input
                  </button>
                </div>
              </div>

              {/* Trending Topics */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">🔥 Trending Topics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['Safety Innovation', 'Equipment Training', 'Team Recognition', 'OSHA Updates'].map((topic, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{topic}</span>
                        <span className="text-green-500 text-sm">📈 Rising</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Engagement: 85%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Connections */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">🔗 Social Media Connections</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {['Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'YouTube', 'Twitter'].map((platform) => (
                    <div key={platform} className="text-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
                      <div className="text-sm font-medium">{platform}</div>
                      <div className="text-xs text-gray-500">Not connected</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900">Engagement Rate</h3>
                  <p className="text-3xl font-bold text-green-600">4.2%</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900">Total Reach</h3>
                  <p className="text-3xl font-bold text-blue-600">12,500</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900">Conversions</h3>
                  <p className="text-3xl font-bold text-purple-600">23</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900">ROI</h3>
                  <p className="text-3xl font-bold text-orange-600">1,400%</p>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would be implemented similarly */}
          {activeTab !== 'content' && activeTab !== 'analytics' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
              <p className="text-gray-600 mt-2">Feature coming soon!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
