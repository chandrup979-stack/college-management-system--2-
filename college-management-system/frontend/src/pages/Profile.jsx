import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { User as UserIcon, Lock } from "lucide-react";

const Profile = () => {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const initials = (user?.name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    try {
      const { data } = await api.put("/auth/profile", { name, phone });
      // Keep the token, just refresh the stored name/phone
      login({ ...user, name: data.name, phone: data.phone });
      setProfileSuccess("Profile updated successfully");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match");
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError("New password is too short");
      return;
    }

    try {
      await api.put("/auth/change-password", { currentPassword, newPassword });
      setPasswordSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-6">My Profile</h1>

      <div className="flex items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-2xl">
        <div className="w-16 h-16 rounded-full bg-gold-500 text-ink-900 font-semibold flex items-center justify-center text-xl shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">{user?.name}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <p className="text-xs text-slate-400 capitalize mt-1">{user?.role}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <UserIcon size={18} className="text-ink-700" />
            <h2 className="text-lg font-semibold">Edit Details</h2>
          </div>

          {profileError && <p className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mb-3 border border-red-100">{profileError}</p>}
          {profileSuccess && <p className="bg-green-50 text-green-700 text-sm p-2 rounded-lg mb-3 border border-green-100">{profileSuccess}</p>}

          <form onSubmit={handleProfileSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <button type="submit" className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition text-sm font-medium">
              Save Changes
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={18} className="text-ink-700" />
            <h2 className="text-lg font-semibold">Change Password</h2>
          </div>

          {passwordError && <p className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mb-3 border border-red-100">{passwordError}</p>}
          {passwordSuccess && <p className="bg-green-50 text-green-700 text-sm p-2 rounded-lg mb-3 border border-green-100">{passwordSuccess}</p>}

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <button type="submit" className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition text-sm font-medium">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;