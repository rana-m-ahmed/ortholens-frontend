import "./globals.css";

export const metadata = {
  title: 'OrthoLens · AI Fracture Detection',
  description: 'Diagnostic AI for bone fracture analysis from X-ray imaging',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-bg-base">
      <body className="bg-bg-base text-text-primary font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
