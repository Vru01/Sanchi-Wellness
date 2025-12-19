import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// BASE URL for your backend
const API_URL = "http://localhost:5000";

const products = [
  { 
    id: 1, 
    name: "Male Might", 
    description: "Extreme Satisfaction",
    price: "₹899", 
    category: "Men's Health", 
    // Pointing to backend file path
    img: `${API_URL}/uploads/Products/P1.jpeg`,
    tag: "Best Seller"
  },
  { 
    id: 2, 
    name: "Virility Maxx", 
    description: "Vitality Booster",
    price: "₹749", 
    category: "Men's Health", 
    img: `${API_URL}/uploads/Products/P2.jpeg`,
    tag: "Trending"
  },
  { 
    id: 4, 
    name: "Piyoosh", 
    description: "Pure Cow Colostrum",
    price: "₹699", 
    category: "Immunity", 
    img: `${API_URL}/uploads/Products/P4.jpeg`,
    tag: null
  },
  { 
    id: 5, 
    name: "Wild Roots", 
    description: "Anti Hair Fall Shampoo",
    price: "₹349", 
    category: "Hair Care", 
    img: `${API_URL}/uploads/Products/P5.jpeg`,
    tag: "Herbal"
  },
  { 
    id: 9, 
    name: "Aspire Face Wash", 
    description: "Cucumber & Tea Tree",
    price: "₹249", 
    category: "Face Care", 
    img: `${API_URL}/uploads/Products/P9.jpeg`,
    tag: "Daily Use"
  },
  { 
    id: 3, 
    name: "Aloe Aura", 
    description: "Soothe & Glow Gel",
    price: "₹199", 
    category: "Skin Care", 
    img: `${API_URL}/uploads/Products/P3.jpeg`,
    tag: null
  },
  { 
    id: 6, 
    name: "Blossom Care", 
    description: "Intimate Hygiene Wash",
    price: "₹299", 
    category: "Personal Care", 
    img: `${API_URL}/uploads/Products/P6.jpeg`,
    tag: null
  },
  { 
    id: 7, 
    name: "Aspire Saffron Soap", 
    description: "Sandalwood & Saffron",
    price: "₹129", 
    category: "Bath & Body", 
    img: `${API_URL}/uploads/Products/P7.jpeg`,
    tag: "Organic"
  },
  { 
    id: 8, 
    name: "Aspire Glow Soap", 
    description: "Cream Soft Soap",
    price: "₹119", 
    category: "Bath & Body", 
    img: `${API_URL}/uploads/Products/P8.jpeg`,
    tag: null
  },
];

const ProductSection = () => {
  return (
    <section id="products" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-green-600">
            Our Premium Collection
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover the power of nature with Sanchi Wellness. From vitality supplements to organic skincare, we have everything you need for a healthier lifestyle.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden flex flex-col h-full">
              <CardHeader className="p-0 relative">
                
                {/* Image Container */}
                <div className="overflow-hidden h-72 bg-gray-50 flex items-center justify-center relative">
                   {/* Subtle gradient background appearing on hover */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-cyan-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   
                   {/* Image has z-10, so Badge needs higher z-index */}
                   <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-full h-full object-contain p-4 relative z-10 group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>

                {/* Badge Logic */}
                {product.tag && (
                  <Badge className={`absolute top-3 right-3 shadow-md z-20 ${
                    product.tag === 'Best Seller' ? 'bg-amber-500 hover:bg-amber-600' : 
                    product.tag === 'Organic' ? 'bg-green-600 hover:bg-green-700' :
                    'bg-cyan-600 hover:bg-cyan-700'
                  }`}>
                    {product.tag}
                  </Badge>
                )}
              </CardHeader>
              
              <CardContent className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-bold text-cyan-600 uppercase tracking-wider">
                    {product.category}
                  </p>
                  <span className="text-lg font-bold text-gray-900">{product.price}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1 group-hover:text-green-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">{product.description}</p>
              </CardContent>
              
              <CardFooter className="p-6 pt-0">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-green-600 hover:from-cyan-600 hover:to-green-700 text-white shadow-md active:scale-95 transition-all">
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;