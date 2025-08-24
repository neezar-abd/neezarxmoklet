"use client";

import Image from "next/image";
import hero from "/public/images/neezar-hero.png";
import heroSmall from "/public/images/neezar-hero-small.webp";
import IconChip from "@/components/ui/icon-chip";
import { MapPin, BriefcaseBusiness, CheckCheck } from "lucide-react";

export default function AboutTeaser() {
  const handleEmailCopy = async () => {
    try {
      await navigator.clipboard.writeText("neezar.dev@gmail.com");
      // You can add a toast notification here
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <section
      id="about"
      role="region"
      aria-labelledby="about-heading"
      className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 scroll-mt-24"
    >
      <div className="grid gap-6 sm:gap-8 lg:gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
        
        {/* H2 selalu di kanan pada md+ */}
        <h2 
          id="about-heading" 
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight [text-wrap:balance] md:col-start-2 md:row-start-1"
        >
          Tentang Saya
        </h2>

        {/* FOTO: mobile tampil setelah H2; md+ pindah ke kolom kiri, sejajarkan vertikal */}
        <div className="relative mx-auto w-full max-w-[380px] sm:max-w-[440px] aspect-[3/4] rounded-3xl overflow-hidden
                        bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-[0_16px_60px_rgba(0,0,0,.18)]
                        md:col-start-1 md:row-start-1 md:row-span-6">
          {/* spotlight merah halus */}
          <div 
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10
                       [background:radial-gradient(120%_120%_at_20%_10%,rgba(230,0,17,.14),transparent_60%)]" 
          />
          {/* Main high-quality image with static import */}
          <Image
            src={hero}
            alt="Neezar mengenakan blazer merah - Full Stack Developer dari Probolinggo"
            fill
            sizes="(min-width:1024px) 440px, (min-width:768px) 380px, 80vw"
            placeholder="blur"
            blurDataURL={heroSmall.src}
            className="object-contain select-none"
            priority={false}
          />
        </div>

        {/* Paragraf pembuka (kanan di md+) */}
        <p className="mt-1 text-base sm:text-lg text-muted-foreground max-w-prose md:col-start-2 md:row-start-2">
          Saya Neezar Abdurrahman Ahnaf Abiyyi, dikenal sebagai Neezar Abd, seorang Software Engineer dari Probolinggo. Saya membangun aplikasi web modern berbasis Next.js/React dan TypeScript, didukung Tailwind CSS serta MongoDB/Firebase untuk kebutuhan data dan autentikasi. Fokus kerja saya pada performa, arsitektur bersih, dan hasil yang terukur.
        </p>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 md:col-start-2 md:row-start-3">
          <IconChip icon={MapPin} variant="brand">
            Probolinggo, Indonesia
          </IconChip>
          <IconChip icon={BriefcaseBusiness}>
            Software Engineer
          </IconChip>
          <IconChip icon={CheckCheck} variant="success" className="relative">
            Open to Internship
            <span aria-hidden="true" className="ml-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </IconChip>
        </div>

        {/* Tech stack */}
        <div className="md:col-start-2 md:row-start-4">
          <h3 className="text-sm font-semibold tracking-wide text-muted-foreground">TECH STACK</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Next.js","TypeScript","Tailwind","Node.js","Prisma","PostgreSQL"].map(s => (
              <span 
                key={s} 
                className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700
                           dark:bg-white/10 dark:text-neutral-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="grid grid-cols-1 gap-3 sm:inline-flex sm:gap-3 md:col-start-2 md:row-start-5">
          <a 
            href="/Neezar-CV.pdf" 
            download
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#e60011] px-5 text-white hover:bg-[#c10018] 
                       transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#e60011] focus:ring-offset-2
                       font-medium text-sm"
            aria-label="Download CV Neezar (PDF file)"
          >
            Download CV
          </a>
          <button
            onClick={handleEmailCopy}
            className="inline-flex h-11 items-center justify-center rounded-lg border px-5 hover:bg-neutral-50 dark:hover:bg-white/10
                       transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                       font-medium text-sm"
            aria-label="Copy email address to clipboard"
          >
            Email
          </button>
        </div>
        
        <div className="text-xs text-muted-foreground md:col-start-2 md:row-start-6">💬 Fast reply &lt;24h</div>
      </div>
    </section>
  );
}
