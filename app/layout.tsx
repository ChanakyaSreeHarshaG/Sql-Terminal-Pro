import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SQL Terminal Pro — In-Browser SQL Practice & 20 Master Patterns',
  description: 'Master 272 hands-on SQL challenges across Healthcare, Enterprise relational schemas, and all 20 core interview patterns with real-time in-browser WebAssembly SQLite execution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
