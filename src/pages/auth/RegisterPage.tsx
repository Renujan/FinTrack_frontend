import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useGlobalUI from '../../hooks/useGlobalUI';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import { User, Mail, Lock, DollarSign } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    currency: 'USD',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, error, clearError } = useAuth();
  const { addToast } = useGlobalUI();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await register(formData);
      addToast('Account created successfully!', 'success', 'Welcome aboard');
      navigate('/dashboard');
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-100 font-outfit">Create your FinTrack Account</h2>
        <p className="text-xs text-slate-400 mt-1">Start tracking your personal & business finances</p>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => clearError()}
          className="mb-4 text-xs"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            name="first_name"
            placeholder="John"
            value={formData.first_name}
            onChange={handleChange}
          />
          <Input
            label="Last Name"
            name="last_name"
            placeholder="Doe"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Username"
          name="username"
          placeholder="johndoe"
          value={formData.username}
          onChange={handleChange}
          leftIcon={<User className="w-4 h-4" />}
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">Default Currency</label>
          <div className="relative">
            <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-3"
          isLoading={isSubmitting}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400 pt-4 border-t border-slate-800">
        <span>Already have an account? </span>
        <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
