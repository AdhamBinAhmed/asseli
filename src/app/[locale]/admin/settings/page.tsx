'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminSettings() {
  const [color, setColor] = useState('#d4af37'); // Default amber
  const [maintenance, setMaintenance] = useState(false);
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.mainColor) setColor(data.mainColor);
          if (data.maintenanceMode !== undefined) setMaintenance(data.maintenanceMode);
          if (data.phoneNumber) setPhone(data.phoneNumber);
          if (data.whatsappLink) setWhatsapp(data.whatsappLink);
          if (data.facebookLink) setFacebook(data.facebookLink);
          if (data.instagramLink) setInstagram(data.instagramLink);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), {
        mainColor: color,
        maintenanceMode: maintenance,
        phoneNumber: phone,
        whatsappLink: whatsapp,
        facebookLink: facebook,
        instagramLink: instagram
      }, { merge: true });
      alert('Settings saved successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Global Settings</h1>
      
      {isLoading ? (
        <p className="text-muted-foreground">Loading settings...</p>
      ) : (
        <div className="flex flex-col gap-8 max-w-md">
          
          <div className="bg-card p-4 md:p-6 rounded-2xl border border-border/50 flex flex-col gap-4 shadow-sm">
            <h2 className="text-lg md:text-xl font-semibold">Website Main Color</h2>
            <p className="text-xs md:text-sm text-muted-foreground">Choose the primary color for the website's theme.</p>
            <div className="flex items-center gap-4">
              <input 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)} 
                className="w-16 h-16 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="font-mono text-lg">{color}</span>
            </div>
          </div>

          <div className="bg-card p-4 md:p-6 rounded-2xl border border-border/50 flex flex-col gap-4 shadow-sm">
            <h2 className="text-lg md:text-xl font-semibold">Contact & Social Links</h2>
            <p className="text-xs md:text-sm text-muted-foreground">Update the contact info and social media links displayed in the footer.</p>
            
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block">Phone Number</label>
                <Input placeholder="e.g. 0100 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">WhatsApp Link</label>
                <Input placeholder="e.g. https://wa.me/201000000000" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Facebook Link</label>
                <Input placeholder="e.g. https://facebook.com/..." value={facebook} onChange={(e) => setFacebook(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Instagram Link</label>
                <Input placeholder="e.g. https://instagram.com/..." value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-card p-4 md:p-6 rounded-2xl border border-border/50 flex flex-col gap-4 shadow-sm">
            <h2 className="text-lg md:text-xl font-semibold">Maintenance Mode</h2>
            <p className="text-xs md:text-sm text-muted-foreground">If enabled, standard users will only see a maintenance screen. Admins can still access the site.</p>
            <Button 
              variant={maintenance ? 'destructive' : 'outline'} 
              className={maintenance ? '' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}
              onClick={() => setMaintenance(!maintenance)}
            >
              {maintenance ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
            </Button>
          </div>

          <Button size="lg" className="text-lg py-6" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save All Settings'}
          </Button>

        </div>
      )}
    </div>
  );
}
