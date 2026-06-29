'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  governorate: string;
  items: any[];
  total: number;
  date: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const data: Order[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Order);
      });
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Incoming Orders</h1>
      
      {isLoading ? (
        <p className="text-muted-foreground">Loading orders...</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map(order => (
            <div key={order.id} className="p-6 border border-border/50 rounded-xl bg-card flex flex-col md:flex-row gap-8 justify-between shadow-sm">
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-lg text-primary">{order.customerName}</h3>
                <p className="text-muted-foreground font-medium">{order.customerPhone}</p>
                <p className="text-muted-foreground max-w-sm">{order.customerAddress}, {order.governorate}</p>
                <p className="text-xs text-muted-foreground mt-2">Ordered: {new Date(order.date).toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2 md:min-w-[300px] bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold border-b border-border/50 pb-2 mb-2">Order Items</h4>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{item.price}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold mt-2 pt-2 border-t border-border/50 text-primary">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
        </div>
      )}
    </div>
  );
}
