import React, { useState } from 'react'; // 1. Import useState
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react"; 
import Logo from '@/assets/logo.png'; 
import { Link } from 'react-router-dom'; 

const Navbar = () => {
  // 2. Add state to track if the menu is open or closed
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Products", href: "#products" },
    { name: "Contact", href: "#footer" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        
        {/* --- LOGO SECTION --- */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={Logo} 
            alt="Sanchi Wellness" 
            className="h-10 w-auto object-contain" 
          />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-green-600 group-hover:opacity-80 transition-opacity">
              SANCHI WELLNESS
            </span>
            <span className="text-[0.65rem] text-gray-500 font-medium tracking-widest uppercase -mt-1 hidden sm:block">
              Keeping Wellness In Everyday Life
            </span>
          </div>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-semibold text-gray-600 hover:text-cyan-600 transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-cyan-400 after:to-green-500 after:transition-all hover:after:w-full"
            >
              {link.name}
            </a>
          ))}
          
          <Link to="/login">
            <Button className="bg-gradient-to-r from-cyan-500 to-green-600 hover:from-cyan-600 hover:to-green-700 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all">
              Shop Now
            </Button>
          </Link>
        </div>

        {/* --- MOBILE MENU (SHEET) --- */}
        <div className="md:hidden">
          {/* 3. Control the Sheet using the 'open' and 'onOpenChange' props */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-700">
                <Menu className="h-7 w-7" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="mb-8 text-left">
                <SheetTitle>
                    <img src={Logo} alt="Logo" className="h-12 w-auto mb-2" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-green-600 font-bold text-xl">
                      Menu
                    </span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    // 4. Close the menu when a link is clicked
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-gray-700 hover:text-cyan-600 border-b border-gray-100 pb-2 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
                
                {/* Mobile Button Link */}
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-green-600 hover:from-cyan-600 hover:to-green-700 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;