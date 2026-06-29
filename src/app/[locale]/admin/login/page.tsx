'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { loginAdmin } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollFadeIn } from '@/components/motion/ScrollFadeIn';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await loginAdmin(password, locale);
      if (res.success) {
        router.push('/admin/products');
      } else {
        setError(res.error || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-8 min-h-[70vh]">
      <ScrollFadeIn className="w-full max-w-md p-8 border border-border/50 rounded-2xl bg-card shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">Enter the master password to access the dashboard.</p>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input 
            type="password" 
            placeholder="Admin Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="py-6 text-lg text-center"
            required
          />
          {error && <p className="text-destructive text-sm text-center font-medium">{error}</p>}
          <Button type="submit" className="w-full py-6 text-lg rounded-full mt-2" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Access Dashboard'}
          </Button>
        </form>
      </ScrollFadeIn>
    </div>
  );
}
