'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, UserPlus } from 'lucide-react';
import { logAudit } from '@/app/actions/auth';

interface AdminUser {
  id: string;
  username: string;
  role: string;
  password?: string;
}

export default function AdminUsers() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('order_admin');

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'admins'));
      const adminData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminUser[];
      setAdmins(adminData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;

    try {
      await addDoc(collection(db, 'admins'), {
        username: newUsername,
        password: newPassword,
        role: newRole,
        createdAt: new Date().toISOString()
      });
      await logAudit('Created Admin', `Username: ${newUsername}, Role: ${newRole}`);
      
      setNewUsername('');
      setNewPassword('');
      fetchAdmins();
    } catch (e) {
      console.error(e);
      alert('Failed to add admin');
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Are you sure you want to delete ${username}?`)) return;
    try {
      await deleteDoc(doc(db, 'admins', id));
      await logAudit('Deleted Admin', `Username: ${username}`);
      fetchAdmins();
    } catch (e) {
      console.error(e);
      alert('Failed to delete admin');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Manage Admins</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
        {/* Add Admin Form */}
        <div className="bg-card p-4 md:p-6 rounded-2xl border border-border/50 h-fit md:col-span-1">
          <h2 className="text-lg md:text-xl font-semibold mb-6 flex items-center"><UserPlus className="mr-2 h-5 w-5" /> Add New Admin</h2>
          <form onSubmit={handleAddAdmin} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium mb-1 block">Username</label>
              <Input placeholder="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Password</label>
              <Input type="password" placeholder="Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Role</label>
              <select 
                value={newRole} 
                onChange={e => setNewRole(e.target.value)} 
                className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="order_admin">Order Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <Button type="submit" className="w-full mt-2">Create Admin</Button>
          </form>
        </div>

        {/* Admins List */}
        <div className="md:col-span-2">
          {isLoading ? (
            <p className="text-muted-foreground">Loading admins...</p>
          ) : (
            <div className="flex flex-col gap-4">
              
              {/* Note about master password */}
              <div className="p-4 border border-primary/50 bg-primary/10 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-primary">Master Admin</h3>
                  <p className="text-sm text-muted-foreground">Has full access using master password.</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-primary text-primary-foreground rounded-md uppercase tracking-wider">Super Admin</span>
              </div>

              {admins.length === 0 && <p className="text-muted-foreground mt-4">No additional admins found.</p>}

              {admins.map(admin => (
                <div key={admin.id} className="p-4 border border-border/50 rounded-2xl bg-card flex items-center justify-between shadow-sm">
                  <div>
                    <h3 className="font-semibold text-lg">{admin.username}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{admin.role.replace('_', ' ')}</p>
                  </div>
                  <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(admin.id, admin.username)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
