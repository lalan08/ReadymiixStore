import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/store/BottomNav";
import CinematicIntro from "@/components/store/CinematicIntro";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CinematicIntro />
      <Navbar />
      <main className="min-h-screen pb-16 md:pb-0">{children}</main>
      <div className="md:block hidden">
        <Footer />
      </div>
      <BottomNav />
    </>
  );
}
