import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useGlobalUI from '../../hooks/useGlobalUI';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import { FormFieldErrors, RegisterCredentials } from '../../types/user';
import { validateRegisterForm } from '../../utils/validation';
import { User, Mail, Lock, DollarSign, Eye, EyeOff, UserPlus } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    currency: 'LKR',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clientErrors, setClientErrors] = useState<FormFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, error, fieldErrors, clearError } = useAuth();
  const { addToast } = useGlobalUI();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (clientErrors[name]) {
      setClientErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setClientErrors(validationErrors);
      return;
    }

    setClientErrors({});
    setIsSubmitting(true);

    try {
      const autoLoggedIn = await register(formData);
      if (autoLoggedIn) {
        addToast('Account created & logged in successfully!', 'success', 'Welcome aboard');
        navigate('/dashboard', { replace: true });
      } else {
        addToast('Account registered successfully! Please sign in.', 'success', 'Registration Complete');
        navigate('/login', { replace: true });
      }
    } catch {
      // Backend error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const usernameError = clientErrors.username || fieldErrors.username;
  const emailError = clientErrors.email || fieldErrors.email;
  const passwordError = clientErrors.password || fieldErrors.password;
  const confirmPasswordError = clientErrors.password_confirm || fieldErrors.password_confirm;

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-100 font-outfit tracking-tight">
          Create Account
        </h2>
        <p className="text-xs text-slate-400 mt-1.5">
          Join FinTrack to start managing your personal and business finances
        </p>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => clearError()}
          className="mb-4 text-xs animate-shake"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            name="first_name"
            placeholder="John"
            value={formData.first_name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <Input
            label="Last Name"
            name="last_name"
            placeholder="Doe"
            value={formData.last_name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <Input
          label="Username"
          name="username"
          placeholder="johndoe"
          value={formData.username}
          onChange={handleChange}
          leftIcon={<User className="w-4 h-4" />}
          error={usernameError}
          disabled={isSubmitting}
          autoComplete="username"
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
          error={emailError}
          disabled={isSubmitting}
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-slate-400 hover:text-slate-200 focus:outline-none transition cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={passwordError}
          disabled={isSubmitting}
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          name="password_confirm"
          placeholder="••••••••"
          value={formData.password_confirm}
          onChange={handleChange}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="text-slate-400 hover:text-slate-200 focus:outline-none transition cursor-pointer"
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={confirmPasswordError}
          disabled={isSubmitting}
          autoComplete="new-password"
          required
        />

        <div className="space-y-1.5">
          <label htmlFor="currency" className="block text-xs font-medium text-slate-300">
            Preferred Currency
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition-all disabled:opacity-50"
            >
              <option value="LKR">LKR (Rs)</option>
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
          className="w-full mt-4 py-3 text-sm font-semibold tracking-wide"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          rightIcon={<UserPlus className="w-4 h-4" />}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400 pt-4 border-t border-slate-800/80">
        <span>Already have an account? </span>
        <Link
          to="/login"
          className="text-emerald-400 font-semibold hover:underline transition ml-1"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
