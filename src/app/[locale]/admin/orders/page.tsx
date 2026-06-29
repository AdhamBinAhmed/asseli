'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getAdminRole, logAudit } from '@/app/actions/auth';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  governorate: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'accepted' | 'refused';
  date: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const data: Order[] = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() } as Order);
      });
      // Sort newest first
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const r = await getAdminRole();
      setRole(r);
      await fetchOrders();
    };
    init();
  }, []);

  const isSuperAdmin = role === 'super_admin';

  const updateStatus = async (id: string, newStatus: 'pending' | 'accepted' | 'refused') => {
    try {
      await updateDoc(doc(db, 'orders', id), { status: newStatus });
      await logAudit(`Updated Order Status`, `Order ID: ${id.slice(-6)} set to ${newStatus}`);
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order entirely?')) return;
    try {
      await deleteDoc(doc(db, 'orders', id));
      await logAudit(`Deleted Order`, `Order ID: ${id.slice(-6)}`);
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePendingRefused = async () => {
    if (!confirm('Are you sure you want to delete ALL pending and refused orders?')) return;
    try {
      const toDelete = orders.filter(o => o.status === 'pending' || o.status === 'refused');
      for (const order of toDelete) {
        await deleteDoc(doc(db, 'orders', order.id));
      }
      await logAudit(`Deleted Pending/Refused Orders`, `Deleted ${toDelete.length} orders`);
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'accepted') return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    if (status === 'refused') return <XCircle className="w-5 h-5 text-destructive" />;
    return <Clock className="w-5 h-5 text-amber-500" />;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Manage Orders</h1>
        <div className="flex flex-wrap gap-2 md:gap-4 items-center">
          {isSuperAdmin && (
            <Button variant="destructive" onClick={handleDeletePendingRefused}>
              Delete Pending/Refused
            </Button>
          )}
          <Link href="/admin/products">
            <Button variant="outline">Manage Products</Button>
          </Link>
          <Link href="/admin/orders">
            <Button>Manage Orders</Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading orders...</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.length === 0 && <p className="text-muted-foreground">No orders found.</p>}
          
          {orders.map(order => (
            <div key={order.id} className="p-4 md:p-6 border border-border/50 rounded-2xl bg-card flex flex-col md:flex-row gap-4 md:gap-6">
              
              <div className="flex-1">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <StatusIcon status={order.status || 'pending'} />
                  <span className="font-semibold text-base md:text-lg uppercase tracking-wider">{order.status || 'pending'}</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground ml-auto bg-muted px-2 py-1 rounded-md">ID: {order.id.slice(-6)}</span>
                </div>
                
                <h3 className="text-lg md:text-xl font-bold mb-1">{order.customerName}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">
                  {order.customerPhone} • {order.customerAddress}, {order.governorate}
                  <br/>
                  <span className="text-[10px] md:text-xs">{new Date(order.date).toLocaleString()}</span>
                </p>

                <div className="bg-muted/30 rounded-xl p-4 border border-border/20">
                  <h4 className="font-medium text-sm mb-2 text-muted-foreground">Items Ordered:</h4>
                  <ul className="space-y-1">
                    {order.items?.map((item, i) => (
                      <li key={i} className="text-sm flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span>{item.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-border/50 mt-3 pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${(order.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-2 justify-end items-end md:items-stretch min-w-[140px] mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0 border-border/50 w-full md:w-auto">
                <Button 
                  variant={order.status === 'accepted' ? 'default' : 'outline'} 
                  className={`flex-1 md:flex-none ${order.status === 'accepted' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
                  onClick={() => updateStatus(order.id, 'accepted')}
                >
                  Accept
                </Button>
                <Button 
                  variant={order.status === 'refused' ? 'destructive' : 'outline'}
                  className="flex-1 md:flex-none"
                  onClick={() => updateStatus(order.id, 'refused')}
                >
                  Refuse
                </Button>
                <div className="flex-1 hidden md:block"></div>
                {isSuperAdmin && (
                  <Button variant="ghost" className="flex-1 md:flex-none text-destructive hover:bg-destructive/10 mt-0 md:mt-auto" onClick={() => handleDelete(order.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
