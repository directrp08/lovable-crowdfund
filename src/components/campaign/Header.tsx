import { Link } from "react-router-dom";
import { Search, User } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-brand-logo">
          gofundme
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <User className="w-4 h-4" />
            <span>Sign in</span>
          </button>
        </nav>
        <button className="md:hidden p-2 text-muted-foreground hover:text-foreground">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
