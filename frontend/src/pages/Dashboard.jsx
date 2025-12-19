import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import ProductSection from '@/components/home/ProductSection';
import Footer from '@/components/home/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  // 1. Check Auth & Load Cart on Mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      // If no user, kick them out to login
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
      // Load cart
      const storedCart = JSON.parse(localStorage.getItem('cart') || "[]");
      setCart(storedCart);
    }
    
    // Listen for storage changes (to update cart if added from ProductSection)
    const handleStorageChange = () => {
       setCart(JSON.parse(localStorage.getItem('cart') || "[]"));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  // Remove item from cart
  const removeFromCart = (indexToRemove) => {
    const newCart = cart.filter((_, index) => index !== indexToRemove);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // Calculate Total
  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (!user) return null; // Prevent flash of content before redirect

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      {/* --- DASHBOARD HEADER --- */}
      <div className="pt-28 pb-10 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-green-600">{user.name}</span>
          </h1>
          <p className="text-gray-500">Manage your wellness journey and view your cart.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: CART SUMMARY --- */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-cyan-600" /> 
                Your Cart
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Your cart is empty. Start adding products below!
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center gap-4">
                        <img src={item.img} alt={item.name} className="h-16 w-16 object-contain bg-gray-50 rounded-md p-2" />
                        <div>
                          <h4 className="font-bold text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeFromCart(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* TOTAL */}
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-700">Total Amount</span>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-green-600">
                      ₹{totalAmount}
                    </span>
                  </div>
                  
                  <Button className="w-full mt-4 bg-gray-900 text-white hover:bg-gray-800">
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* --- RIGHT COLUMN: USER INFO --- */}
        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-cyan-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-white/80 text-sm">Full Name</p>
                <p className="font-bold text-lg" >{user.name}</p>
                
                <p className="text-white/80 text-sm mt-4">Email Address</p>
                <p className="font-bold text-lg">{user.email}</p>
                
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* --- PRODUCTS SECTION (Reuse reuse!) --- */}
      <div className="bg-white py-10">
        <div className="container mx-auto px-6 mb-8">
           <h3 className="text-2xl font-bold text-gray-800">Continue Shopping</h3>
        </div>
        <ProductSection /> 
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;