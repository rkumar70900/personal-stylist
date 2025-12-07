import { NavLink } from "@/components/NavLink";
import { Shirt, Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft group-hover:shadow-card transition-shadow">
              <Shirt className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">
              StyleVault
            </span>
          </NavLink>

          <div className="flex items-center gap-2">
            <NavLink
              to="/wardrobe"
              className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-300"
              activeClassName="bg-secondary text-foreground"
            >
              My Wardrobe
            </NavLink>
            <NavLink
              to="/outfit"
              className="px-4 py-2 rounded-lg flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-300"
              activeClassName="bg-secondary text-foreground"
            >
              <Sparkles className="w-4 h-4" />
              Find Outfit
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
