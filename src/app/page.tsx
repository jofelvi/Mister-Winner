import { HeroSection } from '@/features/landing/HeroSection';
import Navbar from '@/components/components/layout/Navbar';
import { ActiveRaffles } from '@/features/landing/ActiveRaffles';
import { HowItWorks } from '@/features/landing/HowItWorks';
import { RecentWinners } from '@/features/landing/RecentWinners';
import { Footer } from '@/components/components/layout/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Este es el contenido que iría en tu `app/(public)/page.tsx` */}
        <HeroSection />
        <ActiveRaffles />
        <HowItWorks />
        <RecentWinners />
      </main>
      <Footer />
    </div>
  );
}
