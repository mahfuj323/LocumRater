import { useState, FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?location=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src={logo} 
                alt="Rate My Locum Logo" 
                className="h-20"
              />
            </Link>
          </div>

          {/* Desktop Navigation - increased spacing */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-12 xl:space-x-16 ml-6 lg:ml-12">
            <Link href="/">
              <span className={`font-medium hover:text-primary transition ${location === '/' ? 'text-primary' : 'text-slate-700'}`}>
                Home
              </span>
            </Link>
            <Link href="/rate">
              <span className={`font-medium hover:text-primary transition ${location === '/rate' ? 'text-primary' : 'text-slate-700'}`}>
                Rate
              </span>
            </Link>
            <Link href="/faq">
              <span className={`font-medium hover:text-primary transition ${location === '/faq' ? 'text-primary' : 'text-slate-700'}`}>
                FAQs
              </span>
            </Link>
            <Link href="/contact">
              <span className={`font-medium hover:text-primary transition ${location === '/contact' ? 'text-primary' : 'text-slate-700'}`}>
                Contact Us
              </span>
            </Link>
          </nav>

          {/* Right side - Search and Auth buttons */}
          <div className="hidden md:flex items-center justify-end space-x-4 lg:space-x-6 flex-grow pl-4 lg:pl-8">
            {/* Search Bar */}
            <div className="flex-grow max-w-xs lg:max-w-sm">
              <form onSubmit={handleSearch} className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search workplaces..."
                  className="pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/auth">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth">Sign Up</Link>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative w-full mb-4">
              <Input
                type="text"
                placeholder="Search workplaces..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-full"
                onClick={closeMenu}
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
            
            <Link href="/" onClick={closeMenu}>
              <span className={`block py-2 font-medium hover:text-primary transition ${location === '/' ? 'text-primary' : 'text-slate-700'}`}>
                Home
              </span>
            </Link>
            <Link href="/rate" onClick={closeMenu}>
              <span className={`block py-2 font-medium hover:text-primary transition ${location === '/rate' ? 'text-primary' : 'text-slate-700'}`}>
                Rate
              </span>
            </Link>
            <Link href="/faq" onClick={closeMenu}>
              <span className={`block py-2 font-medium hover:text-primary transition ${location === '/faq' ? 'text-primary' : 'text-slate-700'}`}>
                FAQs
              </span>
            </Link>
            <Link href="/contact" onClick={closeMenu}>
              <span className={`block py-2 font-medium hover:text-primary transition ${location === '/contact' ? 'text-primary' : 'text-slate-700'}`}>
                Contact Us
              </span>
            </Link>
            <div className="mt-4 flex flex-col space-y-2">
              <Button variant="outline" asChild>
                <Link href="/auth" onClick={closeMenu}>Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth" onClick={closeMenu}>Sign Up</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
