import './globals.css';
import ScrollToTop from '@/components/common/ScrollToTop';
import Preloader from '@/components/common/Preloader';
import { CurrencyProvider } from '@/context/CurrencyContext';

export const metadata = {
  title: 'P-Kot Spices | Premium Quality Authentic Flavors',
  description: 'Tradition in every grain. Premium spices from the heart of the plantations, serving the UK with authentic flavors.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Preloader />
        <CurrencyProvider>
          {children}
          <ScrollToTop />
        </CurrencyProvider>
      </body>
    </html>
  );
}
