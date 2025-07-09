'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Users, Utensils } from 'lucide-react';
import Header from '@/components/layout/Header';

export default function Hero() {
  return (
    <div className="relative min-h-screen hero-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Connect.
              <br />
              <span className="text-yellow-200">Share.</span>
              <br />
              Care.
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Join our community to reduce food waste and help neighbors in need. 
              Every meal shared makes a difference.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/discover">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4">
                  Find Food Near You
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-red-300" />
                <span className="text-white/90">10,000+ meals shared</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-300" />
                <span className="text-white/90">5,000+ community members</span>
              </div>
            </div>
          </div>

          <div className="relative animate-slide-up">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1"
                alt="Community food sharing"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <Utensils className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold text-gray-900">Fresh meal shared</p>
                    <p className="text-sm text-gray-600">2 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}