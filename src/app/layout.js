import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import ScrollToTop from '@/components/common/ScrollToTop';
import Preloader from '@/components/common/Preloader';
import { CurrencyProvider } from '@/context/CurrencyContext';
import AppToaster from '@/components/common/AppToaster';
import { ProductsProvider } from '@/context/ProductsContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'P-Kot Spices | Premium Quality Authentic Flavors',
  description: 'Tradition in every grain. Premium spices from the heart of the plantations, serving the UK with authentic flavors.',
};

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <Preloader />
        <CurrencyProvider>
          <AuthProvider>
          <ProductsProvider>
            {children}
          </ProductsProvider>
          <ScrollToTop />
          <AppToaster />
        </AuthProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
