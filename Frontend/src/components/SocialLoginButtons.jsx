import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const SocialLoginButtons = ({ onSuccess }) => {
  const [loading, setLoading] = useState({ google: false });
  const googleButtonRef = useRef(null);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    let cancelled = false;

    const initializeGoogleSignIn = () => {
      if (cancelled || !googleButtonRef.current || !window.google?.accounts?.id) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          const toastId = toast.loading('Connecting to Google...');
          setLoading({ google: true });

          try {
            // Decode the JWT token to get user info
            const userData = JSON.parse(atob(response.credential.split('.')[1]));

            await onSuccessRef.current({
              provider: 'google',
              googleId: userData.sub,
              email: userData.email,
              fullName: userData.name,
              avatar: userData.picture,
            });

            toast.success('Logged in with Google!', { id: toastId });
          } catch (error) {
            console.error('Google login error:', error);
            toast.error(error.response?.data?.message || 'Failed to login with Google', { id: toastId });
          } finally {
            setLoading({ google: false });
          }
        },
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: 320,
        text: 'signin_with',
      });
    };

    if (window.google?.accounts?.id) {
      initializeGoogleSignIn();
    } else {
      const intervalId = window.setInterval(() => {
        if (window.google?.accounts?.id) {
          window.clearInterval(intervalId);
          initializeGoogleSignIn();
        }
      }, 100);

      return () => {
        cancelled = true;
        window.clearInterval(intervalId);
      };
    }

    return () => {
      cancelled = true;
      if (googleButtonRef.current) {
        googleButtonRef.current.replaceChildren();
      }
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-700"></div>
        <span className="px-4 text-gray-400 text-sm">OR CONTINUE WITH</span>
        <div className="flex-grow border-t border-gray-700"></div>
      </div>

      <div
        ref={googleButtonRef}
        className={`flex justify-center ${loading.google ? 'pointer-events-none opacity-50' : ''}`}
        aria-label="Sign in with Google"
      />
    </div>
  );
};

export default SocialLoginButtons;
