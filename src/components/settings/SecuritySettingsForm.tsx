import React, { useState } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { ChangePasswordPayload } from '../../types/settings';
import { Lock, ShieldCheck } from 'lucide-react';

interface SecuritySettingsFormProps {
  onChangePassword: (payload: ChangePasswordPayload) => Promise<void>;
  onResetSettings: () => Promise<void>;
}

export const SecuritySettingsForm: React.FC<SecuritySettingsFormProps> = ({
  onChangePassword,
  onResetSettings,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onChangePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err?.message || 'Failed to change password. Verify your current password.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all preferences to application defaults?')) {
      setResetLoading(true);
      try {
        await onResetSettings();
        alert('Settings have been reset to default values.');
      } finally {
        setResetLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Change Password" subtitle="Ensure your account stays secure with a strong password">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl">
              Password updated successfully!
            </div>
          )}

          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />
          </div>

          <Button variant="primary" size="sm" type="submit" isLoading={loading}>
            Update Password
          </Button>
        </form>
      </Card>

      <Card title="System Settings Reset" subtitle="Restore application configuration and preferences to default">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-200">Reset Application Preferences</p>
              <p className="text-[11px] text-slate-400">
                Restores currency, date formats, and notification alerts without deleting your transactions or goals.
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            isLoading={resetLoading}
            className="text-amber-400 hover:bg-amber-500/10 border border-amber-500/30 shrink-0"
          >
            Reset Defaults
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SecuritySettingsForm;
