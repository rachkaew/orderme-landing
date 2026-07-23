import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Pricing from "./components/Pricing";
import Manuals from "./components/Manuals";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import { readContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await readContent();

  return (
    <>
      <Navbar />
      <main>
        <Hero content={content.hero} />
        <Features content={content.features} />
        <HowItWorks content={content.howItWorks} />
        <Pricing content={content.pricing} />
        <Manuals section={content.manualsSection} manuals={content.manuals} />
        <CTA cta={content.cta} contact={content.contact} />
      </main>
      <Footer contact={content.contact} />
    </>
  );
}
