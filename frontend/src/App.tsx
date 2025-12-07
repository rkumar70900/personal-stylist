import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import Index from "./pages/Index";
import Wardrobe from "./pages/Wardrobe";
import Outfit from "./pages/Outfit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const NavBar = () => (
  <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-16 items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-semibold">
          Style Savvy
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/wardrobe">Wardrobe</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/outfit">Outfits</Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </div>
  </nav>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1 container py-6">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/wardrobe" element={<Wardrobe />} />
                <Route path="/outfit" element={<Outfit />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
