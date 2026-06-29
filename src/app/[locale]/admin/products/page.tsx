'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { Product } from '@/store/useCartStore';
import { uploadImage } from '@/app/actions/upload';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    weight: '',
    batch: '',
    image: ''
  });

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const data: Product[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await uploadImage(formData);
      
      if (res.success && res.url) {
        setNewProduct(prev => ({ ...prev, image: res.url! }));
      } else {
        setUploadError(res.error || 'Failed to upload image');
      }
    } catch (err) {
      setUploadError('An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), newProduct);
      setNewProduct({ name: '', price: '', weight: '', batch: '', image: '' });
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Add Product Form */}
        <div className="bg-card p-6 rounded-2xl border border-border/50">
          <h2 className="text-xl font-semibold mb-6">Add New Product</h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <Input placeholder="Product Name (e.g. Sidr Honey)" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
            <Input placeholder="Price (e.g. $120.00)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
            <Input placeholder="Weight (e.g. 500g)" value={newProduct.weight} onChange={e => setNewProduct({...newProduct, weight: e.target.value})} required />
            <Input placeholder="Batch Number (e.g. #002)" value={newProduct.batch} onChange={e => setNewProduct({...newProduct, batch: e.target.value})} required />
            
            <div className="flex flex-col gap-2 p-4 border border-border/50 rounded-xl bg-muted/20">
              <label className="text-sm font-medium">Product Image</label>
              <div className="flex items-center gap-4">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  disabled={isUploading}
                  className="bg-background cursor-pointer"
                />
                {newProduct.image && (
                  <img src={newProduct.image} alt="Preview" className="w-12 h-12 rounded-md object-cover border border-border/50 shadow-sm" />
                )}
              </div>
              {isUploading && <p className="text-xs text-primary font-medium">Uploading to Cloudinary...</p>}
              {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
            </div>

            <Button type="submit" className="mt-2" disabled={!newProduct.image || isUploading}>Add Product</Button>
          </form>
        </div>

        {/* Product List */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Current Catalog</h2>
          {isLoading ? (
            <p className="text-muted-foreground">Loading products...</p>
          ) : (
            <div className="flex flex-col gap-4">
              {products.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-card">
                  <div className="flex items-center gap-4">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-md object-cover bg-muted" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.price} • Batch {product.batch}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
              {products.length === 0 && <p className="text-muted-foreground">No products found in database.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
