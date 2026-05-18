'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Bell, Shield, Palette, Globe, Database, Mail, Save, Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'ChocoLuxe',
    storeEmail: 'contact@chocoluxe.com',
    currency: 'INR',
    language: 'en',
    maintenanceMode: false,
    emailNotifications: true,
    orderNotifications: true,
    userNotifications: true,
    inventoryAlerts: true,
    theme: 'light',
    accentColor: '#D4AF37',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || user.role !== 'admin') {
      router.push('/admin/login');
    }
  }, [router]);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const [activeSection, setActiveSection] = useState('general');

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-serif text-[#4B2E2A]">Settings</h1><p className="text-[#8B7355] text-sm mt-1">Manage your store configuration</p></div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <div className="glass-card p-2 sticky top-8">
            {sections.map((section) => (
              <button key={section.id} onClick={() => setActiveSection(section.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeSection === section.id ? 'bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.25)] text-[#4B2E2A]' : 'text-[#8B7355] hover:bg-[rgba(185,139,106,0.08)] border border-transparent'}`}>
                <section.icon size={18} strokeWidth={1.5} /><span className="text-[11px] uppercase tracking-wider">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {activeSection === 'general' && (
            <div className="glass-card p-8 space-y-6">
              <h2 className="text-xl font-serif text-[#4B2E2A] mb-6">General Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Store Name</label><input type="text" value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} className="glass-input w-full bg-white/80" /></div>
                <div><label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Store Email</label><input type="email" value={settings.storeEmail} onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })} className="glass-input w-full bg-white/80" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Currency</label><select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="glass-input w-full bg-white/80 appearance-none"><option value="INR">Indian Rupee (₹)</option><option value="USD">US Dollar ($)</option><option value="EUR">Euro (€)</option></select></div>
                <div><label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Language</label><select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} className="glass-input w-full bg-white/80 appearance-none"><option value="en">English</option><option value="hi">Hindi</option></select></div>
              </div>
              <label className="flex items-center justify-between cursor-pointer py-4 border-t border-[rgba(185,139,106,0.1)]">
                <div><p className="text-[#4B2E2A]">Maintenance Mode</p><p className="text-[#8B7355] text-sm mt-1">Disable store access for visitors</p></div>
                <button onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })} className={`w-14 h-7 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-[#D4AF37]' : 'bg-[rgba(185,139,106,0.2)]'}`}>
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow ${settings.maintenanceMode ? 'right-1' : 'left-1'}`} />
                </button>
              </label>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="glass-card p-8 space-y-4">
              <h2 className="text-xl font-serif text-[#4B2E2A] mb-6">Notification Preferences</h2>
              {[{ key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email', icon: Mail, color: '#D4AF37' }, { key: 'orderNotifications', label: 'Order Updates', desc: 'New orders and status changes', icon: Bell, color: '#2563EB' }, { key: 'userNotifications', label: 'User Registrations', desc: 'New user signups', icon: Globe, color: '#059669' }].map((item) => (
                <label key={item.key} className="flex items-center justify-between cursor-pointer py-4 border-b border-[rgba(185,139,106,0.1)]">
                  <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}15` }}><item.icon size={18} style={{ color: item.color }} /></div><div><p className="text-[#4B2E2A]">{item.label}</p><p className="text-[#8B7355] text-sm mt-1">{item.desc}</p></div></div>
                  <button onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })} className={`w-14 h-7 rounded-full transition-colors relative ${settings[item.key as keyof typeof settings] ? 'bg-[#D4AF37]' : 'bg-[rgba(185,139,106,0.2)]'}`}>
                    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow ${settings[item.key as keyof typeof settings] ? 'right-1' : 'left-1'}`} />
                  </button>
                </label>
              ))}
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="glass-card p-8 space-y-6">
              <h2 className="text-xl font-serif text-[#4B2E2A] mb-6">Appearance</h2>
              <div><label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-4">Accent Color</label><div className="flex gap-3">{['#D4AF37', '#C0C0C0', '#CD7F32', '#8B4513'].map((color) => (<button key={color} onClick={() => setSettings({ ...settings, accentColor: color })} className={`w-10 h-10 rounded-xl transition-all ${settings.accentColor === color ? 'ring-2 ring-offset-2 ring-[#4B2E2A]' : ''}`} style={{ background: color }} />))}<input type="color" value={settings.accentColor} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer" /></div></div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="glass-card p-8 space-y-4">
              <h2 className="text-xl font-serif text-[#4B2E2A] mb-6">Security Settings</h2>
              {[{ label: 'Change Password', desc: 'Update your admin password', icon: Shield, color: '#D4AF37' }, { label: 'Two-Factor Authentication', desc: 'Add extra security to your account', icon: Shield, color: '#2563EB', badge: 'Enabled' }, { label: 'Session Management', desc: 'View and manage active sessions', icon: Database, color: '#7C3AED' }].map((item, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-4 rounded-xl border border-[rgba(185,139,106,0.15)] hover:border-[rgba(185,139,106,0.3)] transition-colors">
                  <div className="flex items-center gap-4"><item.icon size={20} style={{ color: item.color }} /><div className="text-left"><p className="text-[#4B2E2A]">{item.label}</p><p className="text-[#8B7355] text-sm">{item.desc}</p></div></div>
                  {item.badge ? <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs">{item.badge}</span> : <span className="text-[#8B7355]">→</span>}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] uppercase tracking-wider transition-all ${saved ? 'bg-green-500 text-white' : 'bg-[#D4AF37] text-[#2D1810] hover:bg-[#C9A227]'}`}>
              {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}