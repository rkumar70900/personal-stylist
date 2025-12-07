import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shirt, Sparkles, Upload, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-8">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Personal Stylist</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Your Wardrobe,{" "}
              <span className="gradient-text">Intelligently Styled</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload your clothes, and let AI curate the perfect outfit for any occasion.
              Smart recommendations tailored to your style, weather, and mood.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="hero" size="xl">
                <Link to="/wardrobe">
                  <Upload className="w-5 h-5" />
                  Build Your Wardrobe
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/outfit">
                  <Sparkles className="w-5 h-5" />
                  Find an Outfit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three simple steps to never stress about what to wear again.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Upload Your Clothes",
                description:
                  "Simply photograph your clothing items. Our AI will analyze and categorize each piece automatically.",
              },
              {
                icon: Zap,
                title: "AI Analysis",
                description:
                  "We identify colors, styles, materials, and occasions for each item to build your smart wardrobe.",
              },
              {
                icon: Sparkles,
                title: "Get Styled",
                description:
                  "Tell us the occasion or weather, and receive the perfect outfit recommendation instantly.",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl bg-card shadow-soft hover:shadow-card transition-all duration-300 hover-lift animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center glass-card rounded-3xl p-12 shadow-elevated animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-primary mx-auto mb-8 flex items-center justify-center shadow-card">
              <Shirt className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Style?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Start building your smart wardrobe today and discover outfits you never knew you had.
            </p>
            <Button asChild variant="hero" size="xl">
              <Link to="/wardrobe">
                Get Started Free
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shirt className="w-5 h-5 text-accent" />
              <span className="font-serif font-semibold text-foreground">StyleVault</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 StyleVault. Your personal AI stylist.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
