import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useGlobalUI from '../../hooks/useGlobalUI';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import { FormFieldErrors } from '../../types/user';
import { validateLoginForm } from '../../utils/validation';
import { Lock, User, Eye, EyeOff, ArrowRight, Zap, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [clientErrors, setClientErrors] = useState<FormFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);

  const { login, loginDemo, error, fieldErrors, clearError } = useAuth();
  const { addToast } = useGlobalUI();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  const handleInputChange = (field: 'username' | 'password', value: string) => {
    if (field === 'username') setUsername(value);
    if (field === 'password') setPassword(value);

    if (clientErrors[field]) {
      setClientErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(username, password);
    if (Object.keys(validationErrors).length > 0) {
      setClientErrors(validationErrors);
      return;
    }

    setClientErrors({});
    setIsSubmitting(true);

    try {
      await login({ username: username.trim(), password });
      addToast('Welcome back to FinTrack!', 'success', 'Login Successful');
      navigate(from, { replace: true });
    } catch {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoSubmitting(true);
    setUsername('demo');
    setPassword('demo12345');
    try {
      await loginDemo();
      addToast('Logged in as Demo User with sample financial data!', 'success', 'Demo Account Active');
      navigate('/dashboard', { replace: true });
    } catch {
      // Fallback to standard login with pre-configured demo credentials if direct endpoint fails
      try {
        await login({ username: 'demo', password: 'demo12345' });
        addToast('Logged in as Demo User with sample financial data!', 'success', 'Demo Account Active');
        navigate('/dashboard', { replace: true });
      } catch (fallbackErr) {
        addToast('Failed to connect to Demo service. Please ensure backend is running.', 'error', 'Demo Connection Error');
      }
    } finally {
      setIsDemoSubmitting(false);
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
          Enter your credentials or try our interactive demo account
        </p>
      </div>

      {/* One-Click Demo Account Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Want to test without signing up?</span>
        </div>
        <p className="text-[11px] text-slate-300 mb-3">
          Explore all features pre-loaded with realistic sample data.
        </p>
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isDemoSubmitting || isSubmitting}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isDemoSubmitting ? (
            <span>Launching Demo...</span>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>One-Click Demo Account Login</span>
            </>
          )}
        </button>
      </div>

      <div className="relative my-5 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <span className="relative px-3 bg-slate-900 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Or sign in manually
        </span>
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
          placeholder="Enter username (or demo)"
          value={username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          leftIcon={<User className="w-4 h-4 text-emerald-400/80" />}
          error={usernameError}
          disabled={isSubmitting || isDemoSubmitting}
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
          disabled={isSubmitting || isDemoSubmitting}
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
          disabled={isSubmitting || isDemoSubmitting}
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
