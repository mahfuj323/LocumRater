import { Link } from "wouter";
import { PlusCircle, Twitter, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter",
    });
    form.reset();
  };

  return (
    <footer className="bg-slate-800 text-slate-200 py-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <PlusCircle className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">Rate My Locum</span>
            </div>
            <p className="text-slate-400 mb-4">
              Helping healthcare professionals find the best locum opportunities and workplaces.
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
                <Link href="/">
                  <a className="text-slate-400 hover:text-white transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/rate">
                  <a className="text-slate-400 hover:text-white transition">Rate a Workplace</a>
                </Link>
              </li>
              <li>
                <Link href="/rate">
                  <a className="text-slate-400 hover:text-white transition">Rate an Agency</a>
                </Link>
              </li>
              <li>
                <Link href="/search">
                  <a className="text-slate-400 hover:text-white transition">Search Workplaces</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-slate-400 hover:text-white transition">Contact Us</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#">
                  <a className="text-slate-400 hover:text-white transition">User Guides</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-slate-400 hover:text-white transition">FAQ</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-slate-400 hover:text-white transition">Terms of Service</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-slate-400 hover:text-white transition">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-slate-400 hover:text-white transition">Cookies Policy</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-slate-400 mb-4">
              Subscribe to our newsletter for updates on new features and locum opportunities.
            </p>
            <form className="flex" onSubmit={handleSubscribe}>
              <Input
                type="email"
                name="email"
                placeholder="Your email"
                className="rounded-r-none bg-slate-700 border-slate-600 text-white"
              />
              <Button type="submit" className="rounded-l-none">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} Rate My Locum. All rights reserved.</p>
          <div className="mt-4 md:mt-0 text-sm text-slate-400">
            <Link href="#">
              <a className="hover:text-white">Terms</a>
            </Link>
            <span className="mx-2">·</span>
            <Link href="#">
              <a className="hover:text-white">Privacy</a>
            </Link>
            <span className="mx-2">·</span>
            <Link href="#">
              <a className="hover:text-white">Cookies</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
