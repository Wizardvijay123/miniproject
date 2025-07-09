import { UserPlus, Camera, MessageCircle, HandHeart } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your free account and choose to be a food donor, recipient, or both.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Camera,
    title: 'Share or Search',
    description: 'Post available food with photos and details, or browse what\'s available nearby.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: MessageCircle,
    title: 'Connect',
    description: 'Message other users to coordinate pickup times and locations safely.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: HandHeart,
    title: 'Share & Care',
    description: 'Complete the exchange and help build a stronger, more caring community.',
    color: 'bg-orange-100 text-orange-600',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Getting started is simple. Follow these four easy steps to begin sharing food and making a difference.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center mx-auto mb-6`}>
                <step.icon className="h-10 w-10" />
              </div>
              
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-4 w-8 h-0.5 bg-primary/30"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}