import { Link } from "wouter";
import { Twitter, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "../../assets/logo.png";

export default function Footer() {

  return (
    <footer className="bg-slate-800 text-slate-200 py-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img 
                src={logo} 
                alt="Rate My Locum Logo" 
                className="h-20"
              />
            </div>
            <p className="text-slate-400 mb-4">
              Because your time matters. No more walking into stressful environments or unclear expectations. Get honest insights before you commit.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rate" className="text-slate-400 hover:text-white transition">
                  Rate a Workplace
                </Link>
              </li>
              <li>
                <Link href="/rate" className="text-slate-400 hover:text-white transition">
                  Rate an Agency
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-slate-400 hover:text-white transition">
                  Search Workplaces
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition">
                  User Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition">
                  Cookies Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-slate-400" />
                <span className="text-slate-400">info@ratemylocum.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-slate-400" />
                <span className="text-slate-400">United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <img 
              src={logo} 
              alt="Rate My Locum Logo" 
              className="h-10 mr-2"
            />
            <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-slate-400">
            <Link href="#" className="hover:text-white">Terms</Link>
            <span className="mx-2">·</span>
            <Link href="#" className="hover:text-white">Privacy</Link>
            <span className="mx-2">·</span>
            <Link href="#" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
