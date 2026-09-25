import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';
import Loader from '../../components/Loader';

const AccountDetails = () => {
  const { user, updateUserInContext } = useAuth();
  const [formData, setFormData] = useState({ fullName: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
      });
      setAvatarPreview(user.avatar?.url || `https://ui-avatars.com/api/?name=${user.fullName.replace(" ", "+")}&background=1F2937&color=fff`);
    }
  }, [user]);

  // +++ FIX: Re-added the missing handleChange function +++
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error("Please select an image first.");
      return;
    }
    const uploadFormData = new FormData();
    uploadFormData.append('avatar', avatarFile);

    const toastId = toast.loading('Uploading avatar...');
    try {
      const response = await api.patch('/users/avatar', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        toast.success('Avatar updated!', { id: toastId });
        updateUserInContext({ avatar: response.data.data.avatar });
        setAvatarFile(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed.", { id: toastId });
    }
  };

  // +++ FIX: Re-added the missing handleSubmit function +++
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Updating details...');
    try {
      // We only update if the data has changed
      const changedData = {};
      if (formData.fullName !== user.fullName) changedData.fullName = formData.fullName;
      if (formData.email !== user.email) changedData.email = formData.email;

      if (Object.keys(changedData).length === 0) {
        toast.success('No changes to save.', { id: toastId });
        return;
      }

      const response = await api.patch('/users/update-account', changedData);
      if (response.data.success) {
        toast.success('Account details updated!', { id: toastId });
        updateUserInContext(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">Account Details</h3>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex flex-col items-center">
            <img src={avatarPreview} alt="Avatar" className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-gray-700" />
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button onClick={() => fileInputRef.current.click()} className="text-sm text-gray-400 hover:text-white mb-2">Change Avatar</button>
            {avatarFile && (
                <button onClick={handleAvatarUpload} className="w-full bg-brand-accent/80 text-white font-bold py-2 px-4 rounded-md text-sm hover:bg-opacity-80 transition-all">
                    Upload New Image
                </button>
            )}
        </div>
        <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange} // This now works
                        required
                        className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange} // This now works
                        required
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
                        ) : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;