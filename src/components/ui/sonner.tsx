import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1E2013',
          color: '#F1EFDF',
          border: '1px solid #3D402C',
          borderRadius: '12px',
          fontSize: '13.5px',
          fontFamily: 'inherit',
        },
      }}
    />
  );
}
