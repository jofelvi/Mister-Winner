import {HeroSection} from "@/features/landing/HeroSection";
import {ActiveRaffles} from "@/features/landing/ActiveRaffles";
import {HowItWorks} from "@/features/landing/HowItWorks";
import {RecentWinners} from "@/features/landing/RecentWinners";

export default function HomePage() {
 return (
   <>
     <HeroSection />
     <ActiveRaffles />
     <HowItWorks />
     <RecentWinners />
   </>
 )
}