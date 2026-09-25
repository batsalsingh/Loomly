import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AccountDetails from '../components/profile/AccountDetails';
import AddressManager from '../components/profile/AddressManager';
import ChangePassword from '../components/profile/ChangePassword';
import ProfileSkeleton from '../components/skeletons/ProfileSkeleton';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('details');
    const { loading } = useAuth();

    const renderContent = () => {
        switch (activeTab) {
            case 'addresses': return <AddressManager />;
            case 'password': return <ChangePassword />;
            case 'details':
            default:
                return <AccountDetails />;
        }
    };
    
    const getTabClass = (tabName) => `py-2 px-4 cursor-pointer text-sm font-bold rounded-lg transition-all duration-300 ${activeTab === tabName ? 'bg-gradient-to-r from-brand-accent to-red-600 text-white shadow-lg shadow-brand-accent/30' : 'text-gray-400 hover:bg-gray-800/50'}`;

    if (loading) {
      return <ProfileSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-40 pb-20 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="container mx-auto max-w-4xl relative z-10">
                <h1 className="text-5xl font-primary tracking-widest text-center uppercase mb-12 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">My Profile</h1>
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="flex p-2 md:p-4 border-b border-gray-700/50 space-x-1 md:space-x-2 bg-gradient-to-r from-gray-900/80 to-black/60">
                        <button onClick={() => setActiveTab('details')} className={getTabClass('details')}>Account Details</button>
                        <button onClick={() => setActiveTab('addresses')} className={getTabClass('addresses')}>My Addresses</button>
                        <button onClick={() => setActiveTab('password')} className={getTabClass('password')}>Change Password</button>
                    </div>
                    <div>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;