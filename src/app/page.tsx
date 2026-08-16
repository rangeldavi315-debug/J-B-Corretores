import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Indicators from "@/components/Indicators";
import AboutUs from "@/components/AboutUs";
import Properties from "@/components/Properties";
import Diferenciais from "@/components/Diferenciais";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Indicators />
        <AboutUs />
        <Properties />
        <Diferenciais />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
