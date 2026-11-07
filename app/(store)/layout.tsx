import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/store/BottomNav";
import CinematicIntro from "@/components/store/CinematicIntro";
import { isComposerEnabled } from "@/lib/siteConfig";

export const revalidate = 60;

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const composerEnabled = await isComposerEnabled();

  return (
    <>
      {/*
        This script runs synchronously (blocking) before any paint.
        It checks sessionStorage and sets data-intro on <html> so the CSS
        can lock the background to black before React even starts hydrating.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{if(!sessionStorage.getItem('rm_intro'))document.documentElement.setAttribute('data-intro','');}catch(e){}}())`,
        }}
      />
      <CinematicIntro />
      <Navbar composerEnabled={composerEnabled} />
      <main className="min-h-screen pb-16 md:pb-0">{children}</main>
      <div className="md:block hidden">
        <Footer />
      </div>
      <BottomNav composerEnabled={composerEnabled} />
    </>
  );
}
