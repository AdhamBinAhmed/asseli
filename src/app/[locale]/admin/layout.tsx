import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, LogOut, Settings } from 'lucide-react';
import { logoutAdmin, getAdminRole } from '@/app/actions/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const role = await getAdminRole();
  const isSuperAdmin = role === 'super_admin';

  return (
    <div className="flex flex-col md:flex-row flex-1 max-w-7xl mx-auto w-full my-4 md:my-8 bg-card rounded-none md:rounded-3xl overflow-hidden border-y md:border border-border/50 shadow-2xl relative z-10 min-h-[70vh]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-muted/30 border-b md:border-b-0 md:border-r border-border/50 p-4 md:p-6 flex flex-col md:flex-col gap-2">
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-8 text-primary px-2 md:px-4 tracking-tight">Admin Dashboard</h2>
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <Link href="/admin/products">
            <Button variant="ghost" className="w-auto md:w-full justify-start text-sm md:text-lg h-10 md:h-12 flex-shrink-0 px-3 md:px-4">
              <Package className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" /> Products
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="ghost" className="w-auto md:w-full justify-start text-sm md:text-lg h-10 md:h-12 flex-shrink-0 px-3 md:px-4">
              <ShoppingBag className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" /> Orders
            </Button>
          </Link>
          {isSuperAdmin && (
            <Link href="/admin/settings">
              <Button variant="ghost" className="w-auto md:w-full justify-start text-sm md:text-lg h-10 md:h-12 flex-shrink-0 px-3 md:px-4">
                <Settings className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" /> Settings
              </Button>
            </Link>
          )}
          <div className="mt-0 md:mt-auto ml-auto md:ml-0">
            <form action={logoutAdmin}>
              <Button variant="ghost" type="submit" className="w-auto md:w-full justify-start text-sm md:text-lg h-10 md:h-12 flex-shrink-0 px-3 md:px-4 text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" /> Logout
              </Button>
            </form>
          </div>
        </div>
      </aside>
      
      {/* Content */}
      <main className="flex-1 bg-background overflow-y-auto max-h-[80vh]">
        {children}
      </main>
    </div>
  );
}
