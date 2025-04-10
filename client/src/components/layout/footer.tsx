import { Link } from "wouter";
import { Twitter, Facebook, Instagram, Mail, MapPin } from "lucide-react";
import logo from "../../assets/logo.png";

const FooterLink = ({ href, children }: { href: string, children: any }) => (
  <Link href={href} className="text-slate-400 hover:text-white transition">{children}</Link>
);

const IconLink = ({ children }: { children: any }) => (
  <a href="#" className="text-slate-400 hover:text-white transition">{children}</a>
);

const FooterSection = ({ title, children }: { title: string, children: any }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

export default function Footer() {
  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/rate", label: "Rate a Workplace" },
    { href: "/rate", label: "Rate an Agency" },
    { href: "/search", label: "Search Workplaces" },
    { href: "/contact", label: "Contact Us" },
  ];

  const resourceLinks = [
    { href: "#", label: "User Guides" },
    { href: "#", label: "FAQ" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Cookies Policy" },
  ];

  return (
    <footer className="bg-slate-800 text-slate-200 py-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="bg-white inline-block p-2 rounded-lg mb-4">
              <img src={logo} alt="Rate My Locum Logo" className="h-20" />
            </div>
            <p className="text-slate-400 mb-4">Because your time matters.</p>
            <div className="flex space-x-4">
              <IconLink><Twitter className="h-5 w-5" /></IconLink>
              <IconLink><Facebook className="h-5 w-5" /></IconLink>
              <IconLink><Instagram className="h-5 w-5" /></IconLink>
            </div>
          </div>

          <FooterSection title="Quick Links">
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <li key={i}><FooterLink href={link.href}>{link.label}</FooterLink></li>
              ))}
            </ul>
          </FooterSection>

          <FooterSection title="Resources">
            <ul className="space-y-2">
              {resourceLinks.map((link, i) => (
                <li key={i}><FooterLink href={link.href}>{link.label}</FooterLink></li>
              ))}
            </ul>
          </FooterSection>

          <FooterSection title="Contact">
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
          </FooterSection>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white inline-block p-1 rounded-lg mr-2">
              <img src={logo} alt="Rate My Locum Logo" className="h-10" />
            </div>
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
