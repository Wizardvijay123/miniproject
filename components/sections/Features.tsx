import { Shield, MapPin, Clock, Heart, Users, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: MapPin,
    title: 'Location-Based Matching',
    description: 'Find food sharing opportunities in your neighborhood with smart location matching.',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Verified users and safety guidelines ensure secure food sharing experiences.',
  },
  {
    icon: Clock,
    title: 'Real-Time Updates',
    description: 'Get instant notifications about available food and requests in your area.',
  },
  {
    icon: Heart,
    title: 'Community Driven',
    description: 'Built by the community, for the community. Every member makes a difference.',
  },
  {
    icon: Users,
    title: 'Easy Communication',
    description: 'Connect directly with donors and recipients through our built-in messaging.',
  },
  {
    icon: Leaf,
    title: 'Reduce Waste',
    description: 'Help the environment by reducing food waste and promoting sustainability.',
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="text-primary">FoodShare</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform makes food sharing simple, safe, and meaningful. 
            Join thousands who are already making a difference in their communities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="food-card border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <feature.icon className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}