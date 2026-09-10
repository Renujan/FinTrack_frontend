import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Settings, User, Shield, DollarSign } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account & System Settings"
        subtitle="Manage user preferences, default currency, security, and profile details."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="User Profile Details" subtitle="Update your personal identification information">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" defaultValue={user?.first_name || ''} />
              <Input label="Last Name" defaultValue={user?.last_name || ''} />
            </div>

            <Input label="Username" defaultValue={user?.username || ''} disabled helperText="Username cannot be changed." />
            <Input label="Email Address" defaultValue={user?.email || ''} leftIcon={<User className="w-4 h-4" />} />

            <Button variant="primary" size="sm" className="mt-2">
              Save Changes
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card title="Preferences" subtitle="Regional & Currency">
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Base Currency</label>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>{user?.currency || 'USD'} — United States Dollar</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Security" subtitle="Authentication Status">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-slate-200">JWT Token Security</p>
                <p className="text-slate-400">Stateless bearer token authentication enabled</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
