import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
      <div className="container mx-auto px-4 text-center">
        <Heart className="h-16 w-16 mx-auto mb-8 text-yellow-200" />
        
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Ready to Make a <span className="text-yellow-200">Difference</span>?
        </h2>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
          Join thousands of community members who are already reducing food waste 
          and helping their neighbors. Every meal shared matters.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-4">
              Join the Community
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <Link href="/discover">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-10 py-4">
              Start Sharing Food
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-white/70">
          Free to join • Available nationwide • Secure & trusted
        </p>
      </div>
    </section>
  );
}