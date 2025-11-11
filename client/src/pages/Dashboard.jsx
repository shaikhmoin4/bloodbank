import { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBloodUnits: 0,
    activeDonors: 0,
    pendingRequests: 0,
    todayCollections: 0
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setStats({
      totalBloodUnits: 1250,
      activeDonors: 345,
      pendingRequests: 23,
      todayCollections: 8
    });
  }, []);

  const statCards = [
    {
      title: 'Total Blood Units',
      value: stats.totalBloodUnits,
      subtitle: 'Available in inventory',
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'bg-red-50 border-red-200'
    },
    {
      title: 'Active Donors',
      value: stats.activeDonors,
      subtitle: 'Registered this month',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      subtitle: 'Awaiting fulfillment',
      icon: (
        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      title: "Today's Collections",
      value: stats.todayCollections,
      subtitle: 'Blood units collected',
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-50 border-green-200'
    }
  ];

  const recentActivities = [
    { id: 1, type: 'donation', message: 'John Doe donated 2 units of O+', time: '2 hours ago' },
    { id: 2, type: 'request', message: 'Hospital ABC requested 5 units of A-', time: '4 hours ago' },
    { id: 3, type: 'donation', message: 'Jane Smith donated 1 unit of B+', time: '6 hours ago' },
    { id: 4, type: 'inventory', message: 'Blood unit AB+ expired and removed', time: '1 day ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
              <p className="text-gray-600">Monitor your blood bank operations and key metrics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((card, index) => (
                <Card key={index} className={`${card.color} hover:shadow-md transition-shadow duration-200`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {card.icon}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activities */}
              <div className="lg:col-span-2">
                <Card title="Recent Activities" subtitle="Latest blood bank operations">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'donation' ? 'bg-green-500' :
                          activity.type === 'request' ? 'bg-blue-500' :
                          activity.type === 'inventory' ? 'bg-red-500' : 'bg-gray-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button variant="outline" size="sm">
                      View All Activities
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card title="Quick Actions" subtitle="Common operations">
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New Donor
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Record Donation
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search Inventory
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Generate Report
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
  );
};

export default Dashboard;