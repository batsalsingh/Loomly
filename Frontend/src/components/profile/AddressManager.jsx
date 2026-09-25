import { useState, useEffect } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Loader from '../../components/Loader';

// A sub-component for the Add/Edit form, often in a modal
const AddressForm = ({ onSave, onCancel, address }) => {
  const [formData, setFormData] = useState({
    addressLine1: address?.addressLine1 || '',
    city: address?.city || '',
    state: address?.state || '',
    country: address?.country || 'USA',
    postalCode: address?.postalCode || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:items-center">
      <div className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-lg border border-gray-700 bg-gray-900 p-6">
        <h3 className="text-2xl font-bold mb-4">{address ? 'Edit Address' : 'Add New Address'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Address Line 1" required className="w-full bg-gray-800 p-2 rounded-md" />
          <input name="city" value={formData.city} onChange={handleChange} placeholder="City" required className="w-full bg-gray-800 p-2 rounded-md" />
          <div className="grid grid-cols-2 gap-4">
            <input name="state" value={formData.state} onChange={handleChange} placeholder="State" required className="w-full bg-gray-800 p-2 rounded-md" />
            <input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" required className="w-full bg-gray-800 p-2 rounded-md" />
          </div>
          <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" required className="w-full bg-gray-800 p-2 rounded-md" />
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onCancel} className="text-gray-400 hover:text-white">Cancel</button>
            <button type="submit" className="bg-brand-accent font-bold py-2 px-4 rounded-md">Save Address</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/addresses');
      if (response.data.success) {
        setAddresses(response.data.data);
      }
    } catch {
      toast.error('Could not fetch addresses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSaveAddress = async (formData) => {
    const apiCall = editingAddress
      ? api.put(`/users/addresses/${editingAddress._id}`, formData)
      : api.post('/users/addresses', formData);

    const toastId = toast.loading(editingAddress ? 'Updating address...' : 'Adding address...');
    try {
      const response = await apiCall;
      if (response.data.success) {
        toast.success(`Address ${editingAddress ? 'updated' : 'added'}!`, { id: toastId });
        fetchAddresses(); // Refresh list
        setIsModalOpen(false);
        setEditingAddress(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred.', { id: toastId });
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    const toastId = toast.loading('Deleting address...');
    try {
      await api.delete(`/users/addresses/${addressId}`);
      toast.success('Address deleted.', { id: toastId });
      fetchAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete address.', { id: toastId });
    }
  };

  const handleSetDefault = async (addressId) => {
    const toastId = toast.loading('Setting default...');
    try {
        await api.patch(`/users/addresses/${addressId}/default`);
        toast.success('Default address updated.', { id: toastId });
        fetchAddresses();
    } catch (error) {
        toast.error(error.response?.data?.message || 'Could not set default.', { id: toastId });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Manage Addresses</h3>
        <button onClick={() => { setEditingAddress(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-brand-accent text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition-all">
          <Plus size={18} /> Add New
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader size="xs" className="border-gray-500 border-t-gray-300" />
          <p>Loading addresses...</p>
        </div>
      ) : addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map(addr => (
            <div key={addr._id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex justify-between items-start">
              <div>
                {addr.isDefault && <span className="text-xs bg-brand-accent/30 text-brand-accent font-bold py-1 px-2 rounded-full mb-2 inline-block">DEFAULT</span>}
                <p className="font-bold">{addr.addressLine1}</p>
                <p className="text-gray-300">{addr.city}, {addr.state} {addr.postalCode}</p>
                <p className="text-gray-400">{addr.country}</p>
                 {!addr.isDefault && <button onClick={() => handleSetDefault(addr._id)} className="text-sm text-brand-accent hover:underline mt-2">Set as default</button>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingAddress(addr); setIsModalOpen(true); }} className="text-gray-400 hover:text-white"><Edit size={18} /></button>
                <button onClick={() => handleDeleteAddress(addr._id)} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">You have not saved any addresses yet.</p>
      )}

      {isModalOpen && <AddressForm onSave={handleSaveAddress} onCancel={() => setIsModalOpen(false)} address={editingAddress} />}
    </div>
  );
};

export default AddressManager;