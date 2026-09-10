import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useGlobalUI from '../../hooks/useGlobalUI';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Lock, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error, clearError } = useAuth();
  const { addToast } = useGlobalUI();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    try {
      setIsSubmitting(true);
      await login({ username, password });
      addToast('Welcome back to FinTrack!', 'success', 'Login Successful');
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
        <h2 className="text-xl font-bold text-slate-100 font-outfit">Sign in to your account</h2>
        <p className="text-xs text-slate-400 mt-1">Enter your credentials to access FinTrack</p>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => clearError()}
          className="mb-4 text-xs"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          type="text"
          placeholder="johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-400">
            <input type="checkbox" className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-400" />
            <span>Remember me</span>
          </label>
          <a href="#forgot" className="text-emerald-400 hover:underline">Forgot password?</a>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400 pt-4 border-t border-slate-800">
        <span>Don't have an account? </span>
        <Link to="/register" className="text-emerald-400 font-semibold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
