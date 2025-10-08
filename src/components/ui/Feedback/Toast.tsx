import { Toaster } from 'react-hot-toast';
import './toast-animations.css';

export const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: 'toast-custom toast-enter',
        style: {
          borderRadius: '12px',
          fontSize: '14px',
          padding: '16px 20px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: '400',
          lineHeight: '1.4',
          maxWidth: '380px',
          wordWrap: 'break-word',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
        },
        success: {
          className: 'toast-custom toast-enter toast-success toast-success-bg',
          iconTheme: {
            primary: '#ffffff',
            secondary: '#16a34a',
          },
        },
        error: {
          className: 'toast-custom toast-enter toast-error toast-error-bg',
          iconTheme: {
            primary: '#ffffff',
            secondary: '#dc2626',
          },
        },
        loading: {
          className: 'toast-custom toast-enter toast-loading toast-loading-bg',
          iconTheme: {
            primary: '#ffffff',
            secondary: '#296e4d',
          },
        },
      }}
      containerStyle={{
        top: 24,
        right: 24,
      }}
      gutter={12}
    />
  );
};