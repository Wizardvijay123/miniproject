import { TrendingUp, Users, Heart, Utensils } from 'lucide-react';

const stats = [
  {
    icon: Utensils,
    value: '10,000+',
    label: 'Meals Shared',
    description: 'Delicious meals saved from waste',
  },
  {
    icon: Users,
    value: '5,000+',
    label: 'Active Members',
    description: 'Community members making a difference',
  },
  {
    icon: Heart,
    value: '95%',
    label: 'Success Rate',
    description: 'Successful food sharing connections',
  },
  {
    icon: TrendingUp,
    value: '2.5 tons',
    label: 'Food Saved',
    description: 'Food waste prevented this month',
  },
];

export default function CommunityStats() {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our Impact <span className="text-yellow-200">Together</span>
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            See the amazing impact our community has made in reducing food waste and helping neighbors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <stat.icon className="h-10 w-10" />
              </div>
              
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-xl font-semibold mb-2 text-yellow-200">{stat.label}</div>
              <p className="text-white/80">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}