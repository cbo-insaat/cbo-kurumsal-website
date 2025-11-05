import HeroSection from "../../components/main/HeroSection";
import ServicesSection from "@/components/main/ServicesSection";
import SectionProjeler from "@/components/main/SectionProjeler";
import SectionHaberBlog from "@/components/main/SectionHaberBlog";
import SectionHeroIntro from "@/components/main/SectionHeroIntro";
import SectionCallToAction from "@/components/main/SectionCallToAction";

export default function HomePage() {
  return (
    <main className="relative">

      <HeroSection />
      <SectionHeroIntro />
      <ServicesSection />
      <SectionProjeler />
      <SectionHaberBlog />
      <SectionCallToAction />
    </main>
  );
}
