'use client';

import { useAuth } from '@/contexts/AuthContext';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import CommunityStats from '@/components/sections/CommunityStats';
import Testimonials from '@/components/sections/Testimonials';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/layout/Footer';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Clock, Users } from 'lucide-react';
import Link from 'next/link';

// Mock data
const recentActivities = [
  {
    id: 1,
    type: 'shared',
    title: 'Fresh Vegetables',
    description: 'Shared with Maria from downtown',
    time: '2 hours ago',
    image: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
  },
  {
    id: 2,
    type: 'received',
    title: 'Homemade Soup',
    description: 'Received from John\'s Kitchen',
    time: '1 day ago',
    image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
  },
];

const nearbyFood = [
  {
    id: 1,
    title: 'Fresh Bread & Pastries',
    donor: 'City Bakery',
    distance: '0.5 miles',
    time: 'Available now',
    image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
  },
  {
    id: 2,
    title: 'Organic Produce',
    donor: 'Green Market',
    distance: '1.2 miles',
    time: 'Until 6 PM',
    image: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
  },
];

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to make a difference in your community today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="food-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Shared</p>
                  <p className="text-3xl font-bold text-primary">24</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="food-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Received</p>
                  <p className="text-3xl font-bold text-accent">8</p>
                </div>
                <Clock className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="food-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Nearby Items</p>
                  <p className="text-3xl font-bold text-green-600">12</p>
                </div>
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Link href="/post" className="block">
            <Card className="food-card bg-primary text-white hover:bg-primary/90">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/80">Share Food</p>
                    <p className="text-lg font-semibold">Post Now</p>
                  </div>
                  <Plus className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Your Post</CardTitle>
              <CardDescription>Your latest food sharing activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
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
                </div>
              ))}

              <Link href="/history">
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Nearby Food */}
          <Card>
            <CardHeader>
              <CardTitle>Food Near You</CardTitle>
              <CardDescription>Available food in your area</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {nearbyFood.map((food) => (
                <div key={food.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img
                    src={food.image}
                    alt={food.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{food.title}</h4>
                    <p className="text-sm text-muted-foreground">{food.donor}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-green-600">{food.distance}</span>
                      <span className="text-xs text-muted-foreground">{food.time}</span>
                    </div>
                  </div>
                </div>
              ))}

              <Link href="/discover">
                <Button variant="outline" className="w-full">
                  Discover More Food
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Features />
        <HowItWorks />
        <CommunityStats />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </div>

  );
}