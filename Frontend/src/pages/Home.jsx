import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import ProductCard from '../components/ProductCard';
import AnimatedMarquee from '../components/AnimatedMarquee';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import SpotlightCard from '../components/SpotlightCard';

// --- Reusable Section Header Component ---
const SectionHeader = ({ children }) => (
    <h2 className="text-center text-4xl md:text-5xl font-primary tracking-widest text-white uppercase mb-12 animate-fade-in-up">
        {children}
    </h2>
);

// --- Enhanced Style Card Component ---
const StyleCard = ({ to, image, title }) => (
    <Link to={to} className="relative group overflow-hidden rounded-lg aspect-[3/4]">
      <img src={image} alt={title} className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110" />
      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-500" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="border-2 border-white/50 p-6 transition-all duration-300 group-hover:border-white group-hover:bg-black/30 backdrop-blur-sm">
           <h3 className="text-white text-3xl font-primary tracking-wider uppercase transition-all duration-300 transform group-hover:text-brand-accent group-hover:scale-110">
               {title}
            </h3>
        </div>
      </div>
    </Link>
);


const Home = () => {
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [featuredProduct, setFeaturedProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchHomeData = async () => {
        try {
          setLoading(true);
          const response = await api.get('/products?trending=true');
          if (response.data.success) {
            const allProducts = response.data.data.products;
            const trending = allProducts.filter(p => p.trending);
            setTrendingProducts(trending);
            
            if (trending.length > 0) {
              setFeaturedProduct(trending[0]);
            }
          }
        } catch (error) {
          console.error("Failed to fetch home page data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchHomeData();
    }, []);

    return (
    <div className="overflow-x-hidden">
      {/* 1. HERO SECTION with Video Background */}
      <div className="relative h-screen flex items-center justify-center bg-black p-4 text-center overflow-hidden overflow-x-hidden">
        <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute z-0 w-auto min-w-full min-h-full max-w-none opacity-20 object-cover"
        >
          <source src="../bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-50"/>
        
        <main className="container mx-auto h-full z-20 flex flex-col items-center justify-center animate-fade-in-up">
           <div className="relative">
               <h1 
                 className="text-6xl md:text-8xl lg:text-9xl font-primary tracking-widest uppercase glitch-effect"
                 data-text="ICONOCLAST UNIFORMS"
               >
                    ICONOCLAST UNIFORMS
               </h1>
           </div>
           <p className="text-gray-300 max-w-2xl mt-4 text-lg md:text-xl animate-text-flicker">
             Clean but crazy as fuck. We are the rebellion against the mundane. This is your statement.
           </p>
        </main>
      </div>

      {/* 2. TRENDING PRODUCTS */}
       <section className="py-20 px-4 bg-black overflow-x-hidden">
         <div className="container mx-auto">
            <SectionHeader>TRENDING NOW</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))
              ) : (
                trendingProducts.map((product, index) => (
                    <motion.div
                      key={product._id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <SpotlightCard>
                         <ProductCard product={product} />
                      </SpotlightCard>
                    </motion.div>
                ))
              )}
            </div>
         </div>
      </section>
      
      {/* 3. BRAND MANIFESTO with Parallax */}
      <div 
        className="min-h-[50vh] bg-cover bg-fixed bg-center flex items-center justify-center my-20 px-4 overflow-x-hidden" 
        style={{ backgroundImage: 'url(back.png)'}}
       >
        <div className="text-center bg-black/70 backdrop-blur-md p-10 md:p-16 animate-fade-in-up">
            <h3 className="text-4xl md:text-6xl font-primary tracking-widest text-white uppercase">REBELS. DREAMERS. DEFIANT.</h3>
            <p className="text-gray-300 max-w-xl mt-4 text-lg">We don't just sell clothes. We craft identities.</p>
        </div>
      </div>
      
      {/* 4. CHOOSE YOUR POISON - Categories */}
      <section className="py-20 px-4 bg-black overflow-x-hidden">
        <SectionHeader>CHOOSE YOUR POISON</SectionHeader>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StyleCard to="/style/old-money" image="https://www.finelegends.com/cdn/shop/files/a7f622396a062979dac4cf87606724ae.jpg?v=1749813714" title="Old Money" />
            <StyleCard to="/style/streetwear" image="https://thevou.com/wp-content/uploads/2024/07/Streetwear-style-men-02-1.jpg" title="Streetwear" />
            <StyleCard to="/style/ethnic" image="https://safaaworld.com/cdn/shop/articles/safaa_blog_indian_wear.jpg?v=1714716489" title="Ethnic" />
            <StyleCard to="/style/formals" image="https://cdn.shopify.com/s/files/1/0423/3576/4634/files/Grey_Formal_Shirt_With_Navy_Blue_Trousers.webp" title="Formals" />
        </div>
      </section>

      <AnimatedMarquee />

      {/* 6. FEATURED COLLECTION */}
       <section className="py-20 px-4 container mx-auto overflow-x-hidden">
           <div className="grid md:grid-cols-2 gap-10 items-center">
               {featuredProduct && (
                 <motion.div 
                    className="animate-fade-in-up"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                      <h4 className="text-brand-accent uppercase tracking-widest">Collection Spotlight</h4>
                     <h3 className="text-5xl md:text-7xl font-primary tracking-wider uppercase mt-2">{featuredProduct.name}</h3>
                     <p className="text-gray-400 mt-4 leading-relaxed">
                       {featuredProduct.description}
                     </p>
                     <Link to={`/product/${featuredProduct._id}`} className="inline-block mt-8 bg-brand-accent text-white font-bold py-3 px-8 rounded-md hover:bg-opacity-80 transition-all transform hover:scale-105">
                       DISCOVER THE PIECE
                     </Link>
                 </motion.div>
               )}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {loading ? <ProductCardSkeleton /> : featuredProduct && 
                      <SpotlightCard>
                        <ProductCard product={featuredProduct} />
                      </SpotlightCard>
                    }
                </motion.div>
           </div>
       </section>
    </div>
  );
};

export default Home;