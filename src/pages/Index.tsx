import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Share2, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/campaign/Header";
import ProgressBar from "@/components/campaign/ProgressBar";
import DonationCard from "@/components/campaign/DonationCard";
import CommentCard from "@/components/campaign/CommentCard";
import HeroProgress from "@/components/campaign/HeroProgress";
import StickyProgressBar from "@/components/campaign/StickyProgressBar";
import campaignImage from "@/assets/sophia-hero.webp";

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

const donations = [
  { name: "Maria S.", amount: 100, comment: "Força para a Sophia! Que Deus abençoe essa guerreira. 🙏", timeAgo: "2 min", likes: 5 },
  { name: "João P.", amount: 50, comment: "Meu coração está com vocês. Deus abençoe a família!", timeAgo: "15 min", likes: 3 },
  { name: "Anônimo", amount: 200, timeAgo: "1 hora", likes: 8 },
  { name: "Ana K.", amount: 75, comment: "Não consigo imaginar o que estão passando. Aqui está minha contribuição.", timeAgo: "2 horas", likes: 4 },
  { name: "Pedro R.", amount: 500, comment: "Compartilhei com minha família. Todos queremos ajudar!", timeAgo: "3 horas", likes: 12 },
];

const comments = [
  { name: "Patricia M.", comment: "Doei R$50. Meu coração se parte pela pequena Sophia. Nenhuma criança merece isso. Que Deus abençoe ela e a família com força e cura.", timeAgo: "5 min", likes: 7 },
  { name: "Roberto J.", comment: "Doei R$200. Histórias assim nos lembram de ser gratos e ajudar sempre que pudermos. Deus abençoe a Sophia!", timeAgo: "20 min", likes: 12 },
  { name: "Linda W.", comment: "Compartilhei a história com minha família e doei R$70. Estamos rezando pela cura da Sophia. Força, ela não está sozinha.", timeAgo: "1 hora", likes: 9 },
  { name: "Carlos T.", comment: "Doei R$50. Gostaria de poder fazer mais, mas minhas orações estão com a Sophia. Nenhuma criança deveria sofrer assim.", timeAgo: "2 horas", likes: 6 },
  { name: "Barbara H.", comment: "Enviando R$100 com amor. Força, mamãe. Sua coragem é inspiradora, e rezo para que a Sophia encontre conforto em breve.", timeAgo: "3 horas", likes: 15 },
];

const Index = () => {
  const navigate = useNavigate();
  const heroProgressRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const currentAmount = 28610;
  const goalAmount = 50000;
  const percentage = Math.round((currentAmount / goalAmount) * 100);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when hero progress is NOT visible
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" }
    );

    if (heroProgressRef.current) {
      observer.observe(heroProgressRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Hero with Progress Overlay */}
            <div className="relative animate-fade-in -mx-4 lg:mx-0">
              {/* Image Container - Full width on mobile */}
              <div className="overflow-hidden lg:rounded-xl">
                <div className="relative">
                    <img
                      src={campaignImage}
                      alt="Help Sophia fight Leukemia"
                      className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh] object-cover"
                      style={{ objectPosition: '15% center' }}
                    />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                  
                  {/* Urgency Badge */}
                  <div className="absolute top-6 left-4 md:left-6">
                    <div className="bg-destructive text-destructive-foreground px-5 py-2.5 rounded-lg font-bold text-sm md:text-base shadow-lg animate-pulse">
                      SOPHIA NEEDS YOUR HELP NOW! 🙏
                    </div>
                  </div>

                  {/* Title on image */}
                  <div className="absolute bottom-24 left-4 right-4 md:left-6 md:right-6 md:bottom-28">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground drop-shadow-lg leading-tight">
                      Help little Sophia fight Leukemia 🙏❤️
                    </h1>
                  </div>
                </div>
              </div>

              {/* Progress Card - Overlapping */}
              <div ref={heroProgressRef} className="mx-4 md:mx-6 -mt-12 relative z-10">
                <HeroProgress
                  percentage={percentage}
                  current={currentAmount}
                  goal={goalAmount}
                  recentDonations={donations}
                />
              </div>
            </div>

            {/* Campaign Info */}
            <div className="animate-slide-up pt-2" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Campaign ID: 5581414</span>
                <span className="text-muted-foreground">•</span>
                <span className="font-semibold text-foreground">Health / Medical Treatment</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Created on: 06/26/2025
              </div>
            </div>

            {/* Mobile Donate Button */}
            <div className="lg:hidden">
              <Button
                variant="donate"
                size="xl"
                className="w-full"
                onClick={() => {
                  if (typeof window.fbq === "function") {
                    window.fbq("track", "InitiateCheckout", {
                      content_name: "Help little Sophia fight Leukemia",
                      content_category: "Charity",
                    });
                  }
                  navigate("/checkout");
                }}
              >
                Donate now
              </Button>
            </div>

            {/* Description */}
            <div className="prose prose-neutral max-w-none animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <p className="text-foreground leading-relaxed">
                Sophia is only 5 years old and is already facing one of the toughest battles anyone can go through: cancer. She was diagnosed with leukemia and, since then, has been living between appointments, exams, and chemotherapy sessions.
              </p>
              <p className="text-foreground leading-relaxed mt-4">
                Despite her young age, Sophia is a girl full of life who loves to draw, play with dolls, and dreams of one day being able to run and play freely like any other child.
              </p>
              <p className="text-foreground leading-relaxed mt-4">
                This fundraiser was created to help with the costs of treatment, which are high and constant: exams, medications, transportation, special nutrition, and psychological support.
              </p>
              <p className="text-foreground leading-relaxed mt-4">
                Every contribution—no matter how small—makes a huge difference in Sophia's life and her family's, who are fighting with all their strength to ensure the best for her.
              </p>
              <p className="text-foreground leading-relaxed mt-4 font-semibold">
                🙏 Help however you can. Donate, share, pray.
              </p>
              <p className="text-foreground leading-relaxed mt-4">
                With love and solidarity, let's give Sophia the chance to grow up healthy and happy.
              </p>
              <p className="text-foreground leading-relaxed mt-4 font-semibold text-primary">
                Thank you very much 💛
              </p>
            </div>

            {/* Donations Section */}
            <div className="border-t border-border pt-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Recent donations</h2>
              </div>
              <div className="divide-y divide-border">
                {donations.map((donation, index) => (
                  <DonationCard key={index} {...donation} />
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t border-border pt-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <h2 className="text-lg font-bold text-foreground mb-4">
                {comments.length} recent comments
              </h2>
              <div className="divide-y divide-border">
                {comments.map((comment, index) => (
                  <CommentCard key={index} {...comment} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Progress Card */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-medium animate-fade-in">
                <ProgressBar current={currentAmount} goal={goalAmount} donors={847} />

                <div className="space-y-3 mt-6">
                  <Button
                    variant="donate"
                    size="xl"
                    className="w-full"
                    onClick={() => {
                      if (typeof window.fbq === "function") {
                        window.fbq("track", "InitiateCheckout", {
                          content_name: "Help little Sophia fight Leukemia",
                          content_category: "Charity",
                        });
                      }
                      navigate("/checkout");
                    }}
                  >
                    Donate now
                  </Button>
                  <Button variant="outline" size="lg" className="w-full gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-soft">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary fill-primary" />
                  Recent activity
                </h3>
                <div className="space-y-3">
                  {donations.slice(0, 3).map((donation, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-gofundme-light flex items-center justify-center flex-shrink-0">
                        <Heart className="w-4 h-4 text-primary fill-primary" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{donation.name}</span>
                        <span className="text-muted-foreground"> donated </span>
                        <span className="font-medium text-foreground">${donation.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Progress Bar - appears when hero progress scrolls out */}
      <StickyProgressBar
        percentage={percentage}
        current={currentAmount}
        goal={goalAmount}
        lastDonorName={donations[0]?.name}
        lastDonorAmount={donations[0]?.amount}
        isVisible={showStickyBar}
      />
    </div>
  );
};

export default Index;
