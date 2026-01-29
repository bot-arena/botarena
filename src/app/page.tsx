import { HeroSection } from '../components/HeroSection';
import { FeaturedProfiles } from '../components/FeaturedProfiles';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <HeroSection />
      <FeaturedProfiles />
    </div>
  );
}
