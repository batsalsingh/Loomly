import { useState } from 'react';
import { PaymentElement, useCheckoutElements } from '@stripe/react-stripe-js/checkout';
import toast from 'react-hot-toast';
import Loader from './Loader';
import { formatINR } from '../utils/currency';

const CheckoutForm = ({ amount, email, shippingInfo, createOrder, fetchCart, navigate }) => {
  const checkoutResult = useCheckoutElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (checkoutResult.type !== 'success') {
      toast.error('Payment form is still loading. Please try again.');
      return;
    }

    if (!email) {
      toast.error('An email address is required for payment.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Processing payment...");

    try {
      const result = await checkoutResult.checkout.confirm({
        email,
        redirect: 'if_required',
      });

      if (result.type === 'error') {
        toast.error(result.error.message, { id: toastId });
        return;
      }

        // Payment succeeded, now create the order in OUR backend
        
        const backendResult = await createOrder({
          shippingInfo,
          paymentInfo: {
            id: result.session.id,
            }
        });

        if (backendResult.success) {
            toast.success("Payment completed and order placed!", { id: toastId });
          navigate(`/orders/${backendResult.order._id}`);
          await fetchCart();
        } else {
            // Edge case: Paid on stripe, but failed to save in our DB
            toast.error(backendResult.message || "Payment succeeded, but failed to save order. Contact support.", { id: toastId });
        }
    } catch (error) {
      toast.error(error.message || 'Payment could not be completed.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement className="mb-4 theme-dark" />
      <button 
        type="submit" 
        disabled={loading}
        className={`w-full py-4 text-white font-bold rounded-md bg-gradient-to-r from-brand-accent to-red-600 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-brand-accent/30'}`}
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader size="xs" className="border-white/40 border-t-white" />
            Processing...
          </span>
        ) : `Pay ${formatINR(amount)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;