import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, LogOut } from 'lucide-react';
import { logoutAdmin } from '@/app/actions/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 max-w-7xl mx-auto w-full my-8 bg-card rounded-3xl overflow-hidden border border-border/50 shadow-2xl relative z-10 min-h-[70vh]">
      {/* Sidebar */}
      <aside className="w-64 bg-muted/30 border-r border-border/50 p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-8 text-primary px-4 tracking-tight">Admin Dashboard</h2>
        <Link href="/admin/products">
          <Button variant="ghost" className="w-full justify-start text-lg h-12">
            <Package className="mr-3 h-5 w-5" /> Products
          </Button>
        </Link>
        <Link href="/admin/orders">
          <Button variant="ghost" className="w-full justify-start text-lg h-12">
            <ShoppingBag className="mr-3 h-5 w-5" /> Orders
          </Button>
        </Link>
        <div className="mt-auto">
          <form action={logoutAdmin}>
            <Button variant="ghost" type="submit" className="w-full justify-start text-lg h-12 text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="mr-3 h-5 w-5" /> Logout
            </Button>
          </form>
        </div>
      </aside>
      
      {/* Content */}
      <main className="flex-1 bg-background overflow-y-auto max-h-[80vh]">
        {children}
      </main>
    </div>
  );
}
