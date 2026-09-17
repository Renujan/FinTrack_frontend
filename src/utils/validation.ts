import { FormFieldErrors, RegisterCredentials } from '../types/user';

/**
 * Client-side Form Validation Utilities
 */

export const validateEmail = (email: string): string | null => {
  if (!email || !email.trim()) {
    return 'Email address is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address.';
  }
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username || !username.trim()) {
    return 'Username is required.';
  }
  if (username.trim().length < 3) {
    return 'Username must be at least 3 characters long.';
  }
  if (!/^[a-zA-Z0-9_.-]+$/.test(username.trim())) {
    return 'Username can only contain letters, numbers, underscores, dots, and hyphens.';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  return null;
};

export const validatePasswordConfirm = (password: string, confirm: string): string | null => {
  if (!confirm) {
    return 'Please confirm your password.';
  }
  if (password !== confirm) {
    return 'Passwords do not match.';
  }
  return null;
};

export const validateLoginForm = (username: string, password: string): FormFieldErrors => {
  const errors: FormFieldErrors = {};

  const usernameError = validateUsername(username);
  if (usernameError) {
    errors.username = usernameError;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};

export const validateRegisterForm = (data: RegisterCredentials): FormFieldErrors => {
  const errors: FormFieldErrors = {};

  const usernameError = validateUsername(data.username);
  if (usernameError) {
    errors.username = usernameError;
  }

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmError = validatePasswordConfirm(data.password, data.password_confirm);
  if (confirmError) {
    errors.password_confirm = confirmError;
  }

  return errors;
};

export const validateTransactionForm = (description: string, amount: number | string, category: number | string | null, date: string): FormFieldErrors => {
  const errors: FormFieldErrors = {};
  if (!description || !description.trim()) {
    errors.description = 'Description is required.';
  }
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount);
  if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
    errors.amount = 'Amount must be greater than zero.';
  }
  if (!category) {
    errors.category = 'Category is required.';
  }
  if (!date) {
    errors.date = 'Date is required.';
  }
  return errors;
};

export const validateBudgetForm = (name: string, amount: number | string, start_date: string, end_date: string): FormFieldErrors => {
  const errors: FormFieldErrors = {};
  if (!name || !name.trim()) {
    errors.name = 'Budget name is required.';
  } else if (name.trim().length > 100) {
    errors.name = 'Budget name cannot exceed 100 characters.';
  }

  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount);
  if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
    errors.amount = 'Amount must be greater than zero.';
  }

  if (!start_date) {
    errors.start_date = 'Start date is required.';
  }
  if (!end_date) {
    errors.end_date = 'End date is required.';
  }
  if (start_date && end_date && end_date < start_date) {
    errors.end_date = 'End date cannot be before start date.';
  }

  return errors;
};


