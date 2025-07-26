'use client';

import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarDays, ArrowLeft } from 'lucide-react';

// Sample activity history (replace with real data or API later)
const activityHistory = [
  {
    id: 1,
    type: 'shared',
    title: 'Extra Apples',
    description: 'Shared with Lucy from Maple Street',
    time: 'July 24, 2025',
    image:
      'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  },
  {
    id: 2,
    type: 'received',
    title: 'Canned Soup',
    description: 'Received from Tom\'s Pantry',
    time: 'July 22, 2025',
    image:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  },
  {
    id: 3,
    type: 'shared',
    title: 'Homemade Cookies',
    description: 'Shared with Emma from Oak Avenue',
    time: 'July 20, 2025',
    image:
      'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  },
];

export default function HistoryPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Your Activity History</h1>
          <p className="text-muted-foreground text-lg">
            Review everything you’ve shared or received recently.
          </p>
        </div>

        <Card className="shadow-xl border-muted">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Food Sharing Log</CardTitle>
                <CardDescription>
                  Updated with your latest community actions.
                </CardDescription>
              </div>
              <CalendarDays className="w-6 h-6 text-muted-foreground" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activityHistory.map((activity) => (
                <div
                  key={activity.id}
                  className="flex flex-col rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition duration-300 bg-white dark:bg-muted"
                >
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-sm">
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          activity.type === 'shared'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {activity.type === 'shared' ? 'Shared' : 'Received'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="mx-auto">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
