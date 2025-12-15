import React from 'react';
import Navbar from '@/components/layout/Navbar';
import ProductSection from '@/components/home/ProductSection';
import Footer from '@/components/home/Footer';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Welcome Banner */}
      <div className="pt-24 pb-10 bg-stone-50 text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to your Dashboard</h1>
        <p className="text-gray-600 mt-2">Here is our exclusive collection curated just for you.</p>
      </div>

      {/* The Products display here now */}
      <ProductSection />
      
      <Footer />
    </div>
  );
};

export default Dashboard;