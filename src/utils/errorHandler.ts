import { AxiosError } from 'axios';
import { FormFieldErrors } from '../types/user';

/**
 * Parses API error responses into clean human-readable text and field error maps.
 */

export interface ParsedApiError {
  message: string;
  fieldErrors: FormFieldErrors;
}

export const parseApiError = (error: unknown, fallbackMessage = 'An unexpected error occurred. Please try again.'): ParsedApiError => {
  if (!error) {
    return { message: fallbackMessage, fieldErrors: {} };
  }

  const axiosError = error as AxiosError<Record<string, unknown>>;
  
  if (!axiosError.response) {
    if (axiosError.message === 'Network Error' || !navigator.onLine) {
      return {
        message: 'Unable to connect to the server. Please check your internet connection.',
        fieldErrors: {},
      };
    }
    return { message: axiosError.message || fallbackMessage, fieldErrors: {} };
  }

  const status = axiosError.response.status;
  const data = axiosError.response.data;

  const fieldErrors: FormFieldErrors = {};
  let mainMessage = '';

  if (status === 401) {
    mainMessage = typeof data?.detail === 'string'
      ? data.detail
      : 'Invalid credentials or session expired. Please sign in again.';
    return { message: mainMessage, fieldErrors };
  }

  if (status === 429) {
    return {
      message: 'Too many requests. Please wait a moment before trying again.',
      fieldErrors,
    };
  }

  if (status === 500) {
    return {
      message: 'Server error encountered. Please try again later.',
      fieldErrors,
    };
  }

  if (typeof data === 'string') {
    return { message: data, fieldErrors };
  }

  if (data && typeof data === 'object') {
    // Check for DRF detail or message
    if (typeof data.detail === 'string') {
      mainMessage = data.detail;
    } else if (typeof data.message === 'string') {
      mainMessage = data.message;
    } else if (typeof data.error === 'string') {
      mainMessage = data.error;
    } else if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
      mainMessage = data.non_field_errors.join(' ');
    }

    // Extract field-specific validation errors
    Object.keys(data).forEach((key) => {
      if (['detail', 'message', 'error', 'non_field_errors'].includes(key)) {
        return;
      }
      const val = data[key];
      if (Array.isArray(val)) {
        fieldErrors[key] = val.map(String).join(' ');
      } else if (typeof val === 'string') {
        fieldErrors[key] = val;
      }
    });

    if (!mainMessage) {
      const firstFieldErr = Object.values(fieldErrors)[0];
      mainMessage = firstFieldErr || fallbackMessage;
    }
  }

  return {
    message: mainMessage || fallbackMessage,
    fieldErrors,
  };
};

export default parseApiError;
