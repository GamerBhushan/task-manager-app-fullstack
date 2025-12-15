import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { updateProfile, deleteAccount, updatePassword } from '../api/auth'; // Import updatePassword
import Button from '../components/Button';
import Input from '../components/Input';
import { toast } from 'react-hot-toast';
import { LuUser, LuShieldAlert, LuSave, LuLock } from 'react-icons/lu';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  
  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  // Password Form State
  const [passData, setPassData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await updateProfile(profileData);
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassLoading(true);
    try {
      await updatePassword(passData);
      toast.success('Password changed successfully');
      setPassData({ oldPassword: '', newPassword: '' }); // Clear form
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setPassLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('WARNING: This will permanently delete your account. Are you sure?')) {
      try {
        await deleteAccount();
        await logout();
        toast.success('Account deleted');
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8 pb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-slate-500 text-sm">Manage your profile and security</p>
        </div>

        {/* 1. Profile Info Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <LuUser size={20} />
            </div>
            <h2 className="font-semibold text-slate-800">Personal Information</h2>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
            <Input
              label="Full Name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            />
            <div className="pt-2 flex justify-end">
              <Button type="submit" isLoading={loading} className="flex items-center gap-2">
                <LuSave size={18} />
                Save Profile
              </Button>
            </div>
          </form>
        </div>

        {/* 2. Security Card (Password) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <LuLock size={20} />
            </div>
            <h2 className="font-semibold text-slate-800">Security</h2>
          </div>
          
          <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={passData.oldPassword}
              onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })}
              required
            />
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={passData.newPassword}
              onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
              required
            />
            <div className="pt-2 flex justify-end">
              <Button type="submit" isLoading={passLoading} variant="secondary">
                Update Password
              </Button>
            </div>
          </form>
        </div>

        {/* 3. Danger Zone */}
        <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-red-50 bg-red-50/30 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <LuShieldAlert size={20} />
            </div>
            <h2 className="font-semibold text-red-900">Danger Zone</h2>
          </div>
          
          <div className="p-6 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Permanently delete your account and all data.
            </p>
            <Button variant="danger" onClick={handleDelete}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}