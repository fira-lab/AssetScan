import { Mail, Phone, MapPin } from "lucide-react";

const FooterSection = () => {
  return (
    <footer id="contact" className="section-dark-bg py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-heading font-bold text-lg mb-4 text-accent">SLAVS</h3>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Smart Laptop Asset Verification System — securing campus assets with modern technology.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><a href="#home" className="hover:text-accent transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-accent transition-colors">About</a></li>
              <li><a href="#features" className="hover:text-accent transition-colors">Features</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> admin@university.edu</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +255 700 000 000</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> University Campus, Dar es Salaam</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-6 text-center text-sm text-primary-foreground/40">
          © {new Date().getFullYear()} SLAVS — Smart Laptop Asset Verification System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
