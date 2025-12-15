import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail } from "lucide-react"; 

// Import your Logo
import Logo from '@/assets/logo.png'; 

const Footer = () => {
  return (
    <footer id='footer' className="bg-gray-950 text-gray-300 py-16 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {/* Logo Image */}
              <img 
                src={Logo} 
                alt="Sanchi Wellness" 
                className="h-12 w-12 rounded-lg object-cover bg-white p-0.5" 
              />
              <div className="flex flex-col">
                 <h3 className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-500">
                  SANCHI WELLNESS
                </h3>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed text-gray-400">
              Merging ancient wisdom with modern science to bring you pure, effective medicinal solutions for a balanced life.
            </p>

            {/* Social Icons (Custom SVGs to avoid deprecation) */}
            <div className="flex gap-4">
              
              {/* Instagram */}
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-cyan-600 hover:text-white transition-all group">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-4 h-4"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* Facebook */}
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-4 h-4"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-cyan-500 hover:text-white transition-all">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-4 h-4"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>

            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2">Home</a></li>
              <li><a href="#about" className="hover:text-cyan-400 transition-colors flex items-center gap-2">About Us</a></li>
              <li><a href="#products" className="hover:text-cyan-400 transition-colors flex items-center gap-2">Shop Medicines</a></li>
              <li><a href="#footer" className="hover:text-cyan-400 transition-colors flex items-center gap-2">Contact</a></li>
            </ul>
          </div>

          {/* 3. Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-500 shrink-0" />
                <span>123 Wellness Lane, <br/>Mumbai, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-500 shrink-0" />
                <span>support@sanchiwellness.com</span>
              </li>
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6">Stay Healthy</h4>
            <p className="text-xs text-gray-400 mb-4">Subscribe to receive health tips, new product alerts, and exclusive discounts.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-900 border border-gray-800 text-white text-sm p-3 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
              />
              <Button className="bg-gradient-to-r from-cyan-500 to-green-600 hover:from-cyan-600 hover:to-green-700 text-white w-full rounded-lg shadow-lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2025 Sanchi Wellness. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Shipping Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;