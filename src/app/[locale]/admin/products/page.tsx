'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, UploadCloud } from 'lucide-react';
import { Product } from '@/store/useCartStore';
import { uploadImage } from '@/app/actions/upload';
import { Link } from '@/i18n/routing';
import { getAdminRole } from '@/app/actions/auth';
import { updateDoc } from 'firebase/firestore';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
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
    const init = async () => {
      const r = await getAdminRole();
      setRole(r);
      await fetchProducts();
    };
    init();
  }, []);
  
  const isSuperAdmin = role === 'super_admin';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await processImage(file);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImage(file);
    }
  };

  const processImage = async (file: File) => {
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

  const handleDeleteAll = async () => {
    if (!confirm('Are you ABSOLUTELY SURE you want to delete ALL products? This cannot be undone.')) return;
    try {
      for (const p of products) {
        await deleteDoc(doc(db, 'products', p.id));
      }
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const [bulkPrices, setBulkPrices] = useState<{[key: string]: string}>({});
  const [isSavingPrices, setIsSavingPrices] = useState(false);

  const handleBulkPriceChange = (id: string, price: string) => {
    setBulkPrices(prev => ({...prev, [id]: price}));
  };

  const saveBulkPrices = async () => {
    setIsSavingPrices(true);
    try {
      for (const [id, newPrice] of Object.entries(bulkPrices)) {
        if (newPrice) {
          await updateDoc(doc(db, 'products', id), { price: newPrice });
        }
      }
      alert('Prices updated successfully!');
      setBulkPrices({});
      fetchProducts();
    } catch (e) {
      console.error(e);
      alert('Failed to update some prices.');
    } finally {
      setIsSavingPrices(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <div className="flex gap-4">
          <Link href="/admin/products">
            <Button>Manage Products</Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="outline">Manage Orders</Button>
          </Link>
        </div>
      </div>
      
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
              
              <div 
                className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-colors cursor-pointer overflow-hidden ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50'
                } ${newProduct.image ? 'border-none p-0 h-48' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !newProduct.image && document.getElementById('fileUpload')?.click()}
              >
                <input 
                  id="fileUpload"
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  disabled={isUploading}
                  className="hidden"
                />

                {newProduct.image ? (
                  <div className="relative w-full h-full group">
                    <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setNewProduct(prev => ({...prev, image: ''})); }}>
                        Remove Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground pointer-events-none">
                    <UploadCloud className="w-10 h-10 mb-4" />
                    <p className="text-sm font-medium text-foreground">Click or drag image here</p>
                    <p className="text-xs mt-1">SVG, PNG, JPG or WEBP (max. 5MB)</p>
                  </div>
                )}

                {isUploading && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-medium">Uploading to Cloudinary...</p>
                  </div>
                )}
              </div>

              {uploadError && <p className="text-xs text-destructive mt-1">{uploadError}</p>}
            </div>

            <Button type="submit" className="mt-2" disabled={!newProduct.image || isUploading}>Add Product</Button>
          </form>
        </div>

        {/* Product List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Current Catalog</h2>
            {isSuperAdmin && products.length > 0 && (
              <div className="flex gap-2">
                {Object.keys(bulkPrices).length > 0 && (
                  <Button variant="default" size="sm" onClick={saveBulkPrices} disabled={isSavingPrices}>
                    {isSavingPrices ? 'Saving...' : 'Save Prices'}
                  </Button>
                )}
                <Button variant="destructive" size="sm" onClick={handleDeleteAll}>
                  Delete All Products
                </Button>
              </div>
            )}
          </div>
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
                      {isSuperAdmin ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Input 
                            value={bulkPrices[product.id] !== undefined ? bulkPrices[product.id] : product.price} 
                            onChange={(e) => handleBulkPriceChange(product.id, e.target.value)} 
                            className="w-24 h-8 text-xs" 
                          />
                          <span className="text-xs text-muted-foreground">• Batch {product.batch}</span>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">{product.price} • Batch {product.batch}</p>
                      )}
                    </div>
                  </div>
                  {isSuperAdmin && (
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
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
