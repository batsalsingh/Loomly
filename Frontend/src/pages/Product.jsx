import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../api';
import { ChevronRight, Heart, Star, Share2, Facebook, Instagram, Mail, RotateCcw, PackageCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';
import ProductCard from '../components/ProductCard';
import SpotlightCard from '../components/SpotlightCard';
import Loader from '../components/Loader';
import { formatINR } from '../utils/currency';

// This sub-component now correctly displays the reviews
const ProductReviews = ({ productId }) => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviewsAndPurchaseStatus = async () => {
    try {
      setLoading(true);
      const reviewsRes = await api.get(`/reviews/product/${productId}`);
      if (reviewsRes.data.success) {
        setReviews(reviewsRes.data.data);
      }
      if (isAuthenticated) {
        const ordersRes = await api.get('/orders/my-orders');
        if (ordersRes.data.success) {
          const purchased = ordersRes.data.data.some(order => 
            order.orderStatus === 'Delivered' && order.orderItems.some(item => item.product === productId)
          );
          setHasPurchased(purchased);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reviews or purchase status", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsAndPurchaseStatus();
  }, [productId, isAuthenticated]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting your review...");
    try {
      await api.post('/reviews/', { productId, rating, comment });
      toast.success("Review submitted!", { id: toastId });
      setRating(0);
      setComment('');
      fetchReviewsAndPurchaseStatus(); // Refresh reviews
    } catch (error) {
       toast.error(error.response?.data?.message || "Failed to submit review.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const toastId = toast.loading("Deleting review...");
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success("Review deleted successfully!", { id: toastId });
      fetchReviewsAndPurchaseStatus(); // Refresh
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review", { id: toastId });
    }
  };
  
  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
      
      {isAuthenticated && hasPurchased && (
        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 mb-8">
          <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <div className="flex items-center mb-4">
              <span className="mr-4 text-gray-300">Your Rating:</span>
              <div className="flex">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <Star
                      key={ratingValue}
                      size={24}
                      className={`cursor-pointer transition-colors ${ratingValue <= rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-500'}`}
                      fill="currentColor"
                      onClick={() => setRating(ratingValue)}
                    />
                  );
                })}
              </div>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts on this product..."
              className="w-full bg-gray-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent min-h-[100px]"
            />
            <button type="submit" disabled={isSubmitting} className="mt-4 inline-flex items-center gap-2 bg-brand-accent text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-all disabled:opacity-50">
              {isSubmitting ? (
                <>
                  <Loader size="xs" className="border-white/40 border-t-white" />
                  <span>Submitting...</span>
                </>
              ) : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader size="xs" className="border-gray-500 border-t-gray-300" />
          <p>Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {/* +++ FIX: Implemented the review mapping +++ */}
          {reviews.map(review => (
            <div key={review._id} className="border-b border-gray-800 pb-4 relative">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < review.rating ? 'text-yellow-400' : 'text-gray-600'} fill="currentColor" />
                      ))}
                    </div>
                    <p className="ml-4 font-bold">{review.user?.fullName || 'Anonymous'}</p>
                  </div>
                  {review.comment && <p className="text-gray-300">{review.comment}</p>}
                </div>
                {isAuthenticated && user?._id === review.user?._id && (
                  <button 
                    onClick={() => handleDeleteReview(review._id)} 
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No reviews yet for this product. Be the first to leave one!</p>
      )}
    </div>
  );
};

// The other sub-component and main component are unchanged
const RelatedProducts = ({ productId }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/related/${productId}`);
        if (response.data.success) {
          setRelated(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch related products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [productId]);
  
  if (loading && related.length === 0) return null; // Don't show a loader, just wait
  if (related.length === 0) return null;

  return (
    <div className="mt-20">
      <h2 className="text-4xl font-primary text-center tracking-widest uppercase mb-12">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {related.map(product => (
              <SpotlightCard key={product._id}>
                  <ProductCard product={product} />
              </SpotlightCard>
          ))}
      </div>
    </div>
  );
};


const Product = () => {
    // This entire main component remains unchanged from the previous fix.
    // ... all the state, useEffect, and handlers are the same ...
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [pincode, setPincode] = useState('');
    const [showSizeChart, setShowSizeChart] = useState(false);
    
    const { addToCart } = useCart();
    const { toggleWishlist, isItemInWishlist } = useWishlist();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          setProduct(null);
          setError('');
  
          const response = await api.get(`/products/id/${productId}`);
          if (response.data.success) {
            setProduct(response.data.data);
            if (response.data.data.thumbnail) {
              setMainImage(response.data.data.thumbnail.url);
            } else if (response.data.data.images && response.data.data.images.length > 0) {
              setMainImage(response.data.data.images[0].url);
            }
          } else {
            setError('Product not found.');
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch product.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchProduct();
    }, [productId]);
  
    const handleAddToCart = async () => {
      if (!isAuthenticated) {
        toast.error("Please log in to add items to your cart.");
        navigate("/login");
        return;
      }
      if (product.variants?.length > 0 && !selectedSize) {
        toast.error("Please select a size.");
        return;
      }
      const toastId = toast.loading("Adding to cart...");
      const result = await addToCart(product._id, quantity, selectedSize || "Standard");
      if (result.success) {
        toast.success(result.message, { id: toastId });
        setIsAdding(true);
        setTimeout(() => setIsAdding(false), 1000);
      } else {
        toast.error(result.message, { id: toastId });
      }
    };

    const handlePincodeCheck = (event) => {
      event.preventDefault();
      if (/^\d{5,6}$/.test(pincode)) {
        toast.success("Delivery available to this pincode.");
      } else {
        toast.error("Enter a valid pincode.");
      }
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = encodeURIComponent(`Check out ${product?.name || 'this product'} on Loomly`);
    const sizes = product?.variants?.length
      ? product.variants.map(variant => variant.size)
      : ['S', 'M', 'L', 'XL'];
  
    const handleToggleWishlist = async () => {
      if (!isAuthenticated) {
        toast.error("Please log in to manage your wishlist.");
        navigate("/login");
        return;
      }
      const result = await toggleWishlist(product._id);
      if (result.success) {
          toast.success(result.added ? "Added to wishlist!" : "Removed from wishlist!");
      } else {
          toast.error(result.message);
      }
    };
  
    if (loading) {
      return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
          <div className="container mx-auto">
            <Skeleton className="h-6 w-1/3 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              <Skeleton className="h-[600px] w-full" />
              <div className="flex flex-col">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-10 w-1/4 my-4" />
                <Skeleton className="h-24 w-full mb-8" />
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (error || !product) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white pt-40 pb-20 px-4">
          <h1 className="text-5xl font-primary">PRODUCT NOT FOUND</h1>
          <p className="text-gray-400 mt-4">{error}</p>
          <Link to="/" className="mt-8 text-brand-accent hover:underline">Return to Home</Link>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-sm text-gray-400 mb-8 flex items-center">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={16} className="mx-1" />
            <Link to={`/style/${product.category?.slug || 'all'}`} className="hover:text-white capitalize">{product.category?.name || 'Category'}</Link>
            <ChevronRight size={16} className="mx-1" />
            <span className="text-white">{product.name}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              <div className="flex md:flex-col gap-2 justify-center">
                {product.images?.map(img => (
                  <img 
                    key={img.public_id}
                    src={img.url}
                    alt="thumbnail"
                    onClick={() => setMainImage(img.url)}
                    className={`w-20 h-24 object-cover rounded-lg cursor-pointer border-2 ${mainImage === img.url ? 'border-brand-accent shadow-lg shadow-brand-accent/50' : 'border-gray-700'} hover:border-brand-accent transition-all duration-300 hover:scale-105`}
                  />
                ))}
              </div>
              <div className="flex-grow aspect-[4/5] overflow-hidden rounded-2xl border border-gray-700/50 shadow-2xl">
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="block w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
  
            <div className="flex flex-col">
              <h1 className="text-4xl lg:text-5xl font-bold text-white">{product.name}</h1>
              <p className="text-3xl text-brand-accent font-semibold mt-4">{formatINR(product.price)}</p>
              <p className="text-sm text-gray-400 mb-6">Price inclusive of all applicable taxes</p>
              <p className="text-gray-300 leading-relaxed mb-6">{product.description}</p>
              {product.features?.length > 0 && (
                <div className="mb-6 pb-5">
                  <h2 className="text-sm font-bold text-white mb-3">PRODUCT FEATURES</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2 text-sm text-gray-300">
                    {product.features.map((feature, index) => <li key={`${feature}-${index}`} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />{feature}</li>)}
                  </ul>
                </div>
              )}
              <div className="border-y border-gray-800 py-5 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-bold text-white">SELECT SIZE</label>
                  <button type="button" onClick={() => setShowSizeChart(!showSizeChart)} className="text-sm text-brand-accent underline underline-offset-4 hover:text-white">
                    SIZE CHART
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`w-12 h-11 border rounded-md text-white transition-colors ${selectedSize === size ? 'border-brand-accent bg-brand-accent/20 text-brand-accent' : 'border-gray-700 hover:border-brand-accent'}`}>
                      {size}
                    </button>
                  ))}
                </div>
                <AnimatePresence initial={false}>
                  {showSizeChart && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -8 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 rounded-lg border border-gray-800 bg-black/40 p-3 text-sm text-gray-300">
                        <div className="grid grid-cols-3 gap-3 font-semibold text-white"><span>Size</span><span>Chest</span><span>Length</span></div>
                        {sizes.map((size, index) => <div key={size} className="grid grid-cols-3 gap-3 border-t border-gray-800 py-2"><span>{size}</span><span>{36 + index * 2}&quot;</span><span>{26 + index}&quot;</span></div>)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
                className="flex items-center justify-between mb-5"
              >
                <label htmlFor="quantity" className="text-sm font-bold text-white">QUANTITY</label>
                <select id="quantity" value={quantity} onChange={event => setQuantity(Number(event.target.value))} className="rounded-md border border-gray-700 bg-black px-3 py-2 text-white">
                  {[1, 2, 3, 4, 5].map(value => <option key={value} value={value}>{String(value).padStart(2, '0')}</option>)}
                </select>
              </motion.div>
              <div className="flex items-center space-x-3">
                <button onClick={handleAddToCart} className={`w-full bg-gradient-to-r from-brand-accent to-red-600 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:shadow-brand-accent/50 transition-all duration-300 transform hover:scale-105 ${isAdding ? 'animate-pulse' : ''}`}>
                  {isAdding ? 'ADDED!' : 'ADD TO CART'}
                </button>
                <button onClick={handleToggleWishlist} className={`flex items-center gap-2 whitespace-nowrap px-5 py-4 border rounded-xl transition-all duration-300 ${isItemInWishlist(product._id) ? 'border-brand-accent bg-brand-accent/20 text-brand-accent shadow-lg shadow-brand-accent/50' : 'border-gray-700 text-white hover:border-brand-accent hover:bg-brand-accent/10'}`} aria-label="Add to wishlist">
                  <Heart size={20} fill={isItemInWishlist(product._id) ? 'currentColor' : 'none'} /> WISHLIST
                </button>
              </div>
              <div className="flex items-center gap-4 border-b border-gray-800 py-5 text-sm text-gray-300">
                <span className="flex items-center gap-2"><Share2 size={16} /> Share</span>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" aria-label="Share on Facebook"><Facebook size={18} /></a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`} target="_blank" rel="noreferrer" aria-label="Share on X"><Share2 size={18} /></a>
                <a href={`mailto:?subject=${shareText}&body=${encodeURIComponent(shareUrl)}`} aria-label="Share by email"><Mail size={18} /></a>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="View Instagram"><Instagram size={18} /></a>
              </div>
              <div className="mt-5">
                <h2 className="text-sm font-bold text-white mb-3">DELIVERY DETAILS</h2>
                <form onSubmit={handlePincodeCheck} className="flex border border-gray-700 rounded-lg overflow-hidden">
                  <input value={pincode} onChange={event => setPincode(event.target.value)} inputMode="numeric" placeholder="Enter pincode" aria-label="Pincode" className="min-w-0 flex-1 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-500" />
                  <button type="submit" className="px-4 font-bold text-brand-accent hover:bg-brand-accent/10">CHECK</button>
                </form>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-gray-300 sm:grid-cols-2">
                <div className="flex gap-3 rounded-lg border border-gray-800 p-3"><RotateCcw size={20} className="shrink-0 text-brand-accent" /><span>Easy returns within 30 days.</span></div>
                <div className="flex gap-3 rounded-lg border border-gray-800 p-3"><PackageCheck size={20} className="shrink-0 text-brand-accent" /><span>Ships within 2 to 4 business days.</span></div>
              </div>
            </div>
          </div>
  
          <ProductReviews productId={productId} />
          <RelatedProducts productId={productId} />
        </div>
      </div>
    );
};
  
export default Product;