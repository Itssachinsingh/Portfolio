import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Stack from "@/components/Stack";
import Cursor from "@/components/Cursor";
import Contact from "@/components/Contact";
import Approach from "@/components/Approach";
import LiquidGold from "@/components/LiquidGold";
import CursorTrail from "@/components/CursorTrail";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Experience from "@/components/Experience";
import ScrollStory from "@/components/ScrollStory";

const Home = () => {
  return (
    // isolate keeps the fixed background layers above this bg but below the content;
    // overflow-x-clip (not hidden) so the scroll story's sticky stage still pins
    <main className="relative isolate min-h-screen overflow-x-clip bg-ink text-mist antialiased selection:bg-signal/30">
      {/* fallback for browsers without WebGL2, which hide the liquid canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(ellipse_60%_50%_at_15%_0%,rgb(var(--signal)/0.09),transparent),radial-gradient(ellipse_50%_40%_at_100%_100%,rgb(var(--signal)/0.05),transparent)]"
      />
      <LiquidGold />
      <CursorTrail />
      <Cursor />
      <Nav />
      <Hero />
      <ScrollStory />
      <Work />
      <Experience />
      <Stack />
      <Approach />
      <Contact />
      <ThemeSwitcher />
    </main>
  );
};

export default Home;
