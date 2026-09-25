import { useState } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const ChangePassword = () => {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Changing password...');
    try {
      const response = await api.post('/users/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      if (response.data.success) {
        toast.success('Password changed successfully!', { id: toastId });
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Clear form
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">Change Password</h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
          <input
            type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} required
            className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
          <input
            type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required
            className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
          <input
            type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
            className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>
        <div className="pt-2">
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-brand-accent text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-all disabled:opacity-50">
            {loading ? (
              <>
                <Loader size="xs" className="border-white/40 border-t-white" />
                <span>Saving...</span>
              </>
            ) : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;