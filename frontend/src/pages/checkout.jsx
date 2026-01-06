import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/home/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Lock, Smartphone, AlertCircle } from 'lucide-react'; // Security Icons
import QRCode from "react-qr-code"; 

const API_BASE = "http://localhost:5000/api";

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [address, setAddress] = useState("");
  const [txnId, setTxnId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(""); // For validation errors

  // YOUR UPI ID
  const MERCHANT_UPI = "yourname@upi"; 
  const MERCHANT_NAME = "Sanchi Wellness"; 

  // 1. Load User & Cart
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    // Fetch Cart
    fetch(`${API_BASE}/cart/${parsedUser.id}`)
      .then(res => res.json())
      .then(data => {
        setCart(data);
        setLoading(false);
        // Security: If cart is empty, kick them back
        if (data.length === 0) {
            alert("Your cart is empty!");
            navigate('/dashboard');
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Generate UPI String
  const upiLink = `upi://pay?pa=${MERCHANT_UPI}&pn=${MERCHANT_NAME}&am=${totalAmount}&cu=INR`;

  // 2. Handle Order Submission
  const handlePlaceOrder = async () => {
    setError(""); // Clear previous errors

    // --- SECURITY VALIDATION ---
    if (!address.trim()) {
      setError("Please enter a valid shipping address.");
      return;
    }
    if (address.length < 10) {
        setError("Address is too short. Please provide full details.");
        return;
    }
    
    // UTR VALIDATION (Must be 12 digits)
    const utrRegex = /^\d{12}$/;
    if (!txnId || !utrRegex.test(txnId)) {
        setError("Invalid Transaction ID. Please enter the 12-digit UTR/Ref No.");
        return;
    }
    // ---------------------------

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          totalAmount: totalAmount, // Note: Backend should ideally recalculate this!
          transactionId: txnId,
          address: address,
          cartItems: cart
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Success: Clear storage and redirect
        // We do NOT clear 'user', only 'cart' related data if you stored it there
        window.dispatchEvent(new Event("storage")); 
        
        // Show success and move
        alert("✅ Order Placed Successfully! We will verify the UTR and ship shortly.");
        navigate('/dashboard'); 
      } else {
        setError(data.error || "Order failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      setError("Server connection failed. Please check your internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-stone-50">Loading secure checkout...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 py-28">
        
        {/* Header with Secure Badge */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <Lock className="h-8 w-8 text-green-600" />
                Secure Checkout
            </h1>
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                <ShieldCheck className="h-4 w-4" />
                <span>256-bit SSL Encrypted Connection</span>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LEFT: ADDRESS & REVIEW */}
          <div className="space-y-6">
            
            {/* 1. Shipping Address */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                    Shipping Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label className="mb-2 block text-gray-600">Delivery Address</Label>
                <textarea 
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm"
                  rows="4"
                  placeholder="Full Name, House No, Street Area, City, Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* 2. Order Summary */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-3 bg-gray-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                    <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                    Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-100 rounded-md p-1">
                                <img src={item.img} alt="product" className="h-full w-full object-contain" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                ))}
                
                <div className="border-t border-dashed border-gray-300 pt-4 mt-2">
                    <div className="flex justify-between text-base font-medium text-gray-600 mb-1">
                        <span>Subtotal</span>
                        <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-base font-medium text-green-600 mb-2">
                        <span>Delivery</span>
                        <span>FREE</span>
                    </div>
                    <div className="flex justify-between text-xl font-black text-gray-900 mt-4 pt-4 border-t border-gray-200">
                        <span>Total Payable</span>
                        <span>₹{totalAmount}</span>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: SECURE PAYMENT */}
          <div>
            <Card className="bg-white border-2 border-cyan-500 shadow-xl overflow-hidden relative">
              {/* Decorative Ribbon */}
              <div className="absolute top-0 right-0 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                UPI / QR
              </div>

              <CardHeader className="bg-cyan-50/50 border-b border-cyan-100">
                <CardTitle className="flex items-center gap-2 text-cyan-900">
                   <Smartphone className="h-5 w-5" />
                   Scan & Pay
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-8 flex flex-col items-center">
                
                {/* QR CODE CONTAINER */}
                <div className="p-4 bg-white border-2 border-gray-100 rounded-xl shadow-sm mb-6 relative group">
                    <QRCode value={upiLink} size={160} />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/90">
                        <span className="text-xs font-bold text-gray-500">Scan via Any App</span>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <p className="text-sm text-gray-500">Scan with GPay, PhonePe, or Paytm</p>
                    <p className="text-2xl font-black text-gray-900 mt-2">₹{totalAmount}</p>
                </div>

                {/* FORM */}
                <div className="w-full space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="text-left space-y-2">
                        <Label className="text-sm font-bold text-gray-700">Transaction ID (UTR)</Label>
                        <Input 
                            placeholder="Enter 12-digit UTR (e.g. 4028...)" 
                            value={txnId}
                            onChange={(e) => {
                                // Only allow numbers
                                const val = e.target.value.replace(/\D/g, ''); 
                                if (val.length <= 12) setTxnId(val);
                            }}
                            maxLength={12}
                            className="bg-white"
                        />
                        <p className="text-xs text-gray-400">
                            * Enter the 12-digit reference number from your payment app.
                        </p>
                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <Button 
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold h-12 text-lg shadow-md transition-all active:scale-[0.98]"
                    >
                        {isSubmitting ? "Verifying Payment..." : "Confirm Payment"}
                    </Button>
                </div>
              </CardContent>
              
              <CardFooter className="bg-gray-50 border-t border-gray-100 justify-center py-4">
                  <p className="text-xs text-gray-400 text-center flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Payments are secure and manually verified.
                  </p>
              </CardFooter>
            </Card>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;