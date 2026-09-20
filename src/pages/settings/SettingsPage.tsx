import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader';
import ProfileSettingsForm from '../../components/settings/ProfileSettingsForm';
import FinancialPreferencesForm from '../../components/settings/FinancialPreferencesForm';
import NotificationPreferencesForm from '../../components/settings/NotificationPreferencesForm';
import SecuritySettingsForm from '../../components/settings/SecuritySettingsForm';
import settingsService from '../../services/settingsService';
import { UserProfile, UserPreference, ChangePasswordPayload } from '../../types/settings';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { User, DollarSign, Bell, Shield } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreference | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'financial' | 'notifications' | 'security'>(
    'profile'
  );

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [profData, prefData] = await Promise.all([
        settingsService.getProfile(),
        settingsService.getPreferences(),
      ]);
      setProfile(profData);
      setPreferences(prefData);
    } catch (err) {
      console.error('Failed to load user settings', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    const updated = await settingsService.updateProfile(data);
    setProfile(updated);
  };

  const handleUpdatePreferences = async (data: Partial<UserPreference>) => {
    const updated = await settingsService.updatePreferences(data);
    setPreferences(updated);
  };

  const handleChangePassword = async (payload: ChangePasswordPayload) => {
    await settingsService.changePassword(payload);
  };

  const handleResetSettings = async () => {
    await settingsService.resetSettings();
    await fetchSettings();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <LoadingSpinner size="lg" label="Loading account settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account & System Settings"
        subtitle="Manage personal profile details, default currency, notification triggers, and security controls."
      />

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'profile', label: 'User Profile', icon: User },
          { id: 'financial', label: 'Financial Defaults', icon: DollarSign },
          { id: 'notifications', label: 'Alert Preferences', icon: Bell },
          { id: 'security', label: 'Security & Password', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Render */}
      <div className="max-w-4xl">
        {activeTab === 'profile' && profile && (
          <ProfileSettingsForm profile={profile} onSave={handleUpdateProfile} />
        )}

        {activeTab === 'financial' && (
          <FinancialPreferencesForm preferences={preferences} onSave={handleUpdatePreferences} />
        )}

        {activeTab === 'notifications' && (
          <NotificationPreferencesForm preferences={preferences} onSave={handleUpdatePreferences} />
        )}

        {activeTab === 'security' && (
          <SecuritySettingsForm
            onChangePassword={handleChangePassword}
            onResetSettings={handleResetSettings}
          />
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
