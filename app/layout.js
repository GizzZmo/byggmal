import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="no">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
