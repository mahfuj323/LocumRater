import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { PlusCircle, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <PlusCircle className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">Rate My Locum</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <span className={`font-medium hover:text-primary transition ${location === '/' ? 'text-primary' : 'text-slate-700'}`}>
                Home
              </span>
            </Link>
            <Link href="/search">
              <span className={`font-medium hover:text-primary transition ${location === '/search' ? 'text-primary' : 'text-slate-700'}`}>
                Search
              </span>
            </Link>
            <Link href="/rate">
              <span className={`font-medium hover:text-primary transition ${location === '/rate' ? 'text-primary' : 'text-slate-700'}`}>
                Rate
              </span>
            </Link>
            <Link href="/contact">
              <span className={`font-medium hover:text-primary transition ${location === '/contact' ? 'text-primary' : 'text-slate-700'}`}>
                Contact Us
              </span>
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth">Sign Up</Link>
            </Button>
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
            <Link href="/" onClick={closeMenu}>
              <span className={`block py-2 font-medium hover:text-primary transition ${location === '/' ? 'text-primary' : 'text-slate-700'}`}>
                Home
              </span>
            </Link>
            <Link href="/search" onClick={closeMenu}>
              <span className={`block py-2 font-medium hover:text-primary transition ${location === '/search' ? 'text-primary' : 'text-slate-700'}`}>
                Search
              </span>
            </Link>
            <Link href="/rate" onClick={closeMenu}>
              <span className={`block py-2 font-medium hover:text-primary transition ${location === '/rate' ? 'text-primary' : 'text-slate-700'}`}>
                Rate
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
