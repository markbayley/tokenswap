// Utility to suppress WalletConnect WebSocket connection errors in development
export const suppressWalletConnectErrors = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && 
          (message.includes('WebSocket connection to') && 
           message.includes('walletconnect.org') && 
           message.includes('failed'))) {
        return; // Suppress WalletConnect WebSocket errors
      }
      originalError.apply(console, args);
    };
  }
}; 