'use client';

import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Search } from 'lucide-react';
import Link from 'next/link';

// Sample data for nearby food
const nearbyFood = [
    {
        id: 1,
        title: 'Fresh Bread & Pastries',
        donor: 'City Bakery',
        distance: '0.5 miles',
        time: 'Available now',
        image:
            'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
    },
    {
        id: 2,
        title: 'Organic Produce',
        donor: 'Green Market',
        distance: '1.2 miles',
        time: 'Until 6 PM',
        image:
            'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
    },
    {
        id: 3,
        title: 'Homemade Pies',
        donor: 'Baker’s Delight',
        distance: '3 miles',
        time: 'Available tomorrow',
        image:
            'https://images.pexels.com/photos/2693192/pexels-photo-2693192.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
    },
    {
        id: 4,
        title: 'Vegan Smoothies',
        donor: 'Green Smoothie Cafe',
        distance: '0.8 miles',
        time: 'Available now',
        image:
            'https://images.pexels.com/photos/1570208/pexels-photo-1570208.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
    },
];

export default function DiscoverPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
    }

    if (!user) {
        return <div>Redirecting to login...</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-12">
                {/* Heading Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-primary">Discover Fresh Food Near You</h1>
                    <p className="text-muted-foreground text-lg mt-4">
                        Explore food offerings from your community, available for pickup today.
                    </p>
                </div>

                {/* Search Bar (Optional for Future Enhancements) */}
                <div className="mb-12 flex justify-center">
                    <div className="relative w-full max-w-lg">
                        <input
                            type="text"
                            placeholder="Search for food or donations..."
                            className="w-full px-6 py-4 rounded-full bg-muted text-muted-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                </div>

                {/* Nearby Food Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {nearbyFood.map((food) => (
                        <Card
                            key={food.id}
                            className="rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 bg-white dark:bg-muted"
                        >
                            <img
                                src={food.image}
                                alt={food.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <CardContent className="p-6">
                                <h4 className="text-lg font-semibold mb-2">{food.title}</h4>
                                <p className="text-sm text-muted-foreground">{food.donor}</p>
                                <div className="flex justify-between items-center mt-4 text-xs">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-green-600" />
                                        <span className="text-green-600">{food.distance}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">{food.time}</span>
                                    </div>
                                </div>
                                <Link href={`/food/${food.id}`}>
                                    <Button variant="outline" className="mt-6 w-full">
                                        View Details
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Call to Action Section */}
                <div className="text-center mt-12">
                    <Link href="/post">
                        <Button variant="outline" size="lg" className="mx-auto">
                            Share Your Food Now
                        </Button>
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
