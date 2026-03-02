import About from "@/components/about/about";
import Hero from "../components/hero/hero";
import Stack from "@/components/stack/stack";
import Projects from "@/components/projects/project";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Stack />
      <Projects />
    </main>
  );
}
