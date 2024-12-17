import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <Header/>
        <Sidebar/>
        <main className="p-4">
          {children}
        </main>
        <Footer/>
      </div>
    );
  }
  