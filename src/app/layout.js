import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";

export const metadata = {
  title: "Sistem Informasi Desa Pondos",
  description: "Sistem Informasi Desa Terpadu Desa Pondos, Kecamatan Amurang Barat, Kabupaten Minahasa Selatan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ minHeight: "100vh" }}>
        <BootstrapClient />
        {children}
      </body>
    </html>
  );
}

