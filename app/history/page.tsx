'use client';

import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock history data
const activityHistory = [
  {
    id: 1,
    type: 'shared',
    title: 'Extra Apples',
    description: 'Shared with Lucy from Maple Street',
    time: 'July 24, 2025',
    image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  },
  {
    id: 2,
    type: 'received',
    title: 'Canned Soup',
    description: 'Received from Tom\'s Pantry',
    time: 'July 22, 2025',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  },
  {
    id: 3,
    type: 'shared',
    title: 'Homemade Cookies',
    description: 'Shared with Emma from Oak Avenue',
    time: 'July 20, 2025',
    image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  },
];

export default function HistoryPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Activity History</h1>
          <p className="text-muted-foreground">
            A record of your recent food sharing and receiving activity.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Past Activities</CardTitle>
            <CardDescription>Everything you've shared or received</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityHistory.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    activity.type === 'shared'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {activity.type === 'shared' ? 'Shared' : 'Received'}
                </span>
              </div>
            ))}
            <Link href="/dashboard">
              <Button variant="secondary" className="mt-4 w-full">
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
