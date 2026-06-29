'use client';
import { useEffect, useState, createContext, useContext } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { usePathname } from 'next/navigation';

export interface GlobalSettings {
  phoneNumber?: string;
  whatsappLink?: string;
  facebookLink?: string;
  instagramLink?: string;
}

const SettingsContext = createContext<GlobalSettings>({});
export const useGlobalSettings = () => useContext(SettingsContext);

export function GlobalSettingsProvider({ children }: { children: React.ReactNode }) {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [settings, setSettings] = useState<GlobalSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'global'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.mainColor) {
            document.documentElement.style.setProperty('--primary', data.mainColor);
            document.documentElement.style.setProperty('--ring', data.mainColor);
            document.documentElement.style.setProperty('--sidebar-primary', data.mainColor);
          }
          if (data.maintenanceMode) {
            setIsMaintenance(true);
          }
          setSettings({
            phoneNumber: data.phoneNumber,
            whatsappLink: data.whatsappLink,
            facebookLink: data.facebookLink,
            instagramLink: data.instagramLink,
          });
        }
      } catch (e) {
        console.error('Failed to load global settings', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const isAdminRoute = pathname?.includes('/admin');

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // If in maintenance mode, block all non-admin routes
  if (isMaintenance && !isAdminRoute) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary">Under Maintenance</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-md">
          We are currently updating our website to serve you better. Please check back later!
        </p>
      </div>
    );
  }

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}
