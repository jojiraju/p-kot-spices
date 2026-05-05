import './globals.css';

export const metadata = {
  title: 'P-Kot Spices | Premium Quality Authentic Flavors',
  description: 'Tradition in every grain. Premium spices from the heart of the plantations, serving the UK with authentic flavors.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
