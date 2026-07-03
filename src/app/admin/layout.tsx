import { AdminLayoutClient } from "./AdminLayoutClient";

export const metadata = {
  title: "Admin Dashboard | PORNPISIT BATTERY",
  description: "ระบบจัดการหลังบ้าน",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
