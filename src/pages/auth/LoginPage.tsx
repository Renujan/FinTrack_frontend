import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useGlobalUI from '../../hooks/useGlobalUI';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import { FormFieldErrors } from '../../types/user';
import { validateLoginForm } from '../../utils/validation';
import { Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [clientErrors, setClientErrors] = useState<FormFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error, fieldErrors, clearError } = useAuth();
  const { addToast } = useGlobalUI();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  const handleInputChange = (field: 'username' | 'password', value: string) => {
    if (field === 'username') setUsername(value);
    if (field === 'password') setPassword(value);

    // Clear field specific error when typing
    if (clientErrors[field]) {
      setClientErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (error) {
      clearError();
    }
  };

  // Submit credentials to Login API endpoint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validationErrors = validateLoginForm(username, password);
    if (Object.keys(validationErrors).length > 0) {
      setClientErrors(validationErrors);
      return;
    }

    setClientErrors({});
    setIsSubmitting(true);

    try {
      // Execute authentication login API service request
      await login({ username: username.trim(), password });
      addToast('Welcome back to FinTrack!', 'success', 'Login Successful');
      navigate(from, { replace: true });
    } catch {
      // API authentication errors caught and handled via AuthContext state
    } finally {
      setIsSubmitting(false);
    }
  };

  const usernameError = clientErrors.username || fieldErrors.username;
  const passwordError = clientErrors.password || fieldErrors.password;

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-100 font-outfit tracking-tight">
          Welcome back 👋
        </h2>
        <p className="text-xs text-slate-400 mt-1.5">
          Enter your credentials to access your financial dashboard
        </p>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => clearError()}
          className="mb-5 text-xs animate-shake"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-sans" noValidate aria-label="Login form">
        <Input
          label="Username or Email"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          leftIcon={<User className="w-4 h-4 text-emerald-400/80" />}
          error={usernameError}
          disabled={isSubmitting}
          autoComplete="username"
          aria-required="true"
          required
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={(e) => handleInputChange('password', e.target.value)}
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
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-400 select-none">
            <input
              type="checkbox"
              className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-400 w-3.5 h-3.5"
            />
            <span>Remember me</span>
          </label>
          <a href="#forgot" className="text-emerald-400 hover:underline font-medium">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-3 py-3 text-sm font-semibold tracking-wide"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400 pt-5 border-t border-slate-800/80">
        <span>Don't have an account? </span>
        <Link
          to="/register"
          className="text-emerald-400 font-semibold hover:underline transition ml-1"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
