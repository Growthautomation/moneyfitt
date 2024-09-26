import '../styles/globals.css'
import { useEffect } from 'react';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const isNewSession = !sessionStorage.getItem('app_session');
    if (isNewSession) {
      localStorage.clear();
      sessionStorage.setItem('app_session', 'true');
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
