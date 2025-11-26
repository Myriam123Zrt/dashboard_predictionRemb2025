import "./globals.css";

export const metadata = {
  title: "Dashboard IGA Tunisie",
  description: "Visualisation des prévisions de remboursements santé",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
