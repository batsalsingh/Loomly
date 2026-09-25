import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, KeyRound } from 'lucide-react';
import SocialLoginButtons from '../components/SocialLoginButtons';
import Loader from '../components/Loader';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, socialLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Use the email for the 'username' field if your backend accepts it
      const response = await login({ email: credentials.email, password: credentials.password });
      if (response.success) {
        navigate('/'); // Redirect to home on successful login
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (socialData) => {
    try {
      const response = await socialLogin(socialData.provider, socialData);
      if (response.success) {
        navigate('/');
      } else {
        setError(response.message || 'Social login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred during social login.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center pt-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 w-full max-w-sm shadow-2xl shadow-brand-accent/20 relative z-10 animate-fade-in-up">
        <h2 className="text-center text-3xl font-primary tracking-widest uppercase mb-6">Login</h2>
        {error && <p className="bg-red-900/50 text-red-300 border border-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="email" name="email" placeholder="Email" value={credentials.email} onChange={handleChange} required className="w-full bg-gray-800/50 border border-gray-700/50 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent/50 transition-all duration-300" />
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} required className="w-full bg-gray-800/50 border border-gray-700/50 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent/50 transition-all duration-300" />
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center bg-gradient-to-r from-brand-accent to-red-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-brand-accent/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader size="xs" className="border-white/40 border-t-white" />
                Entering...
              </span>
            ) : 'ENTER THE VOID'}
          </button>
        </form>

        <SocialLoginButtons onSuccess={handleSocialLogin} />

        <div className="text-center text-gray-400 text-sm mt-6">
          Don't have an account? <Link to="/register" className="text-brand-accent hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;