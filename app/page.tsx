import About from "@/components/about/about";
import Hero from "../components/hero/hero";
import Stack from "@/components/stack/stack";
import Projects from "@/components/projects/project";
import BottomNav from "@/components/navbar/BottomNav";
import ScrollCompanion from "@/components/scroll/ScrollCompanion";

export default function Home() {
  return (
    <main>
      <ScrollCompanion />
      <Hero />

      <About />

      <Stack />

      <Projects />

      <BottomNav sections={["about", "stats", "work"]} />
    </main>
  );
}
