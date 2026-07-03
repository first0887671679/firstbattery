import { AdminLayoutClient } from "./AdminLayoutClient";

export const metadata = {
  title: "Admin Dashboard | __BRAND_NAME__",
  description: "ระบบจัดการหลังบ้าน",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
