import { RefreshCw } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getUserRole } from "../config/roles";
import { ChatWindow } from "../components/chat/ChatWindow";
import AdminDashboard from "./AdminDashboard";
import TechDashboard from "./TechDashboard";
import Dashboard from "./Dashboard";

export default function Home() {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center"><RefreshCw className="animate-spin text-[#7F00FF]" /></div>;

  const normalizedEmail = user?.email?.toLowerCase().trim() || "";
  const role = getUserRole(normalizedEmail) || user?.role?.toLowerCase().trim() || "cliente";
  const isPrimaryAdmin = normalizedEmail === "cristian.alarcon@itegperformance.com";

  if (role === "admin" && isPrimaryAdmin) return <AdminDashboard user={user} />;
  if (role === "tecnico") return <TechDashboard user={user} />;
  if (role === "cliente") return <Dashboard user={user} />;
  return <div className="min-h-screen bg-white p-6"><div className="max-w-4xl mx-auto"><ChatWindow /></div></div>;
}