'use client';
import { Toaster } from 'react-hot-toast';

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      gutter={12}
      toastOptions={{
        duration: 4500,
        style: {
          background: 'rgba(38, 25, 20, 0.96)',
          color: '#FDF4E3',
          border: '1px solid rgba(249, 168, 37, 0.35)',
          borderRadius: '14px',
          padding: '14px 18px',
          fontFamily: 'var(--font-sans, inherit)',
          fontSize: '0.92rem',
          boxShadow: '0 18px 40px rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(10px)',
          maxWidth: '420px',
        },
        success: { iconTheme: { primary: '#F9A825', secondary: '#0F0A08' } },
        error: {
          style: { border: '1px solid rgba(216, 67, 21, 0.6)' },
          iconTheme: { primary: '#D84315', secondary: '#FDF4E3' },
        },
      }}
    />
  );
}
