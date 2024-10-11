import { AppProps } from 'next/app';
import { Fira_Sans } from 'next/font/google';
import '@/styles/globals.css';

// Initialize the Fira Sans font
const firaSans = Fira_Sans({
  weight: ['400', '700'], // Regular and Bold
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={firaSans.className}>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
