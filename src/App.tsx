import React, { useState } from 'react';
import { 
  Eye, EyeOff, Clock, Users, Calendar, CheckCircle2, 
  Search, Filter, BarChart3, User, Flame, Award, 
  TrendingUp, Mail, Phone, MapPin, CreditCard, LogOut, Settings 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import QRCode from 'react-qr-code';

// --- TYPY ---
export interface GymClass {
  id: string;
  name: string;
  instructor: string;
  time: string;
  duration: number;
  capacity: number;
  enrolled: number;
  level: 'Początkujący' | 'Średniozaawansowany' | 'Zaawansowany';
  category: 'Cardio' | 'Siła' | 'Yoga' | 'Taniec' | 'Functional';
  isRegistered: boolean;
}

// --- KOMPONENT: LOGIN SCREEN ---
function LoginScreen({ onLogin }: { onLogin: (userId: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password.length >= 6) onLogin('user-' + Date.now());
    else setError('Wymagane hasło min. 6 znaków');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">FitClub</h1>
          <p className="text-gray-500">Witaj z powrotem!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-gray-900" placeholder="email@test.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasło</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-gray-900" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
          <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition">Zaloguj się</button>
        </form>
        <p className="mt-6 text-center text-xs text-gray-400">Demo: dowolny email i hasło (6+ znaków)</p>
      </div>
    </div>
  );
}

// --- KOMPONENT: CLASS CARD ---
function ClassCard({ gymClass, onToggleRegistration }: { gymClass: GymClass; onToggleRegistration: (id: string) => void; }) {
  const spotsLeft = gymClass.capacity - gymClass.enrolled;
  const isFull = spotsLeft === 0;

  const categoryColors: Record<string, string> = {
    'Cardio': 'from-red-500 to-pink-500',
    'Siła': 'from-blue-500 to-cyan-500',
    'Yoga': 'from-purple-500 to-pink-500',
    'Taniec': 'from-orange-500 to-yellow-500',
    'Functional': 'from-green-500 to-teal-500',
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-2 bg-gradient-to-r ${categoryColors[gymClass.category]}`} />
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold">{gymClass.name}</h3>
              {gymClass.isRegistered && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            </div>
            <p className="text-muted-foreground text-sm">{gymClass.instructor}</p>
          </div>
          <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium h-fit">{gymClass.level}</span>
        </div>
        <div className="space-y-2 mb-6 text-sm text-muted-foreground">
          <div className="flex gap-3"><Calendar size={16} /> {gymClass.time}</div>
          <div className="flex gap-3"><Clock size={16} /> {gymClass.duration} min</div>
          <div className="flex gap-3"><Users size={16} /> {gymClass.enrolled}/{gymClass.capacity} os.</div>
        </div>
        <button
          onClick={() => !isFull || gymClass.isRegistered ? onToggleRegistration(gymClass.id) : null}
          disabled={isFull && !gymClass.isRegistered}
          className={`w-full py-3 rounded-xl font-medium transition ${
            gymClass.isRegistered 
              ? 'bg-destructive/10 text-destructive border border-destructive/20' 
              : isFull ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : `bg-gradient-to-r ${categoryColors[gymClass.category]} text-white hover:opacity-90`
          }`}
        >
          {gymClass.isRegistered ? 'Wypisz się' : isFull ? 'Brak miejsc' : 'Zapisz się'}
        </button>
      </div>
    </div>
  );
}

// --- KOMPONENT: STATISTICS ---
function Statistics() {
  const data = [{ name: 'Pn', v: 3 }, { name: 'Wt', v: 5 }, { name: 'Śr', v: 2 }, { name: 'Cz', v: 4 }, { name: 'Pt', v: 6 }];
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Statystyki</h1>
      <div className="grid grid-cols-2 gap-4">
        {[
          { l: 'Wizyty', v: '16', i: Calendar, c: 'bg-blue-500' },
          { l: 'Seria dni', v: '7', i: Flame, c: 'bg-orange-500' },
          { l: 'Ukończone', v: '42', i: Award, c: 'bg-purple-500' },
          { l: 'Czas', v: '65m', i: TrendingUp, c: 'bg-green-500' }
        ].map((s, i) => (
          <div key={i} className="bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className={`w-10 h-10 ${s.c} rounded-lg flex items-center justify-center text-white mb-2`}><s.i size={20} /></div>
            <div className="text-xl font-bold">{s.v}</div>
            <div className="text-xs text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="bg-card p-4 rounded-2xl border border-border h-64">
        <h2 className="text-lg font-bold mb-4">Aktywność</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}><XAxis dataKey="name" /><RechartsTooltip /><Bar dataKey="v" fill="var(--color-primary)" radius={[4, 4, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// --- KOMPONENT: PROFILE ---
function Profile({ userId, onLogout }: { userId: string, onLogout: () => void }) {
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profil</h1>
      <div className="bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"><User size={32} /></div>
          <div><h2 className="text-xl font-bold">Jan Kowalski</h2><p className="opacity-80">Premium Member</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl w-fit mx-auto"><QRCode value={userId} size={100} /></div>
      </div>
      <button onClick={onLogout} className="w-full p-4 bg-destructive/10 text-destructive rounded-xl flex items-center justify-center gap-2 font-medium">
        <LogOut size={20} /> Wyloguj się
      </button>
    </div>
  );
}

// --- KOMPONENT: SCHEDULE (Zintegrowany) ---
function Schedule({ classes, onToggle }: { classes: GymClass[], onToggle: (id: string) => void }) {
  const [filter, setFilter] = useState('Wszystkie');
  const filtered = classes.filter(c => filter === 'Wszystkie' || c.category === filter);
  
  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Grafik</h1>
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
        {['Wszystkie', 'Cardio', 'Siła', 'Yoga'].map(c => (
          <button key={c} onClick={() => setFilter(c)} 
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${filter === c ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filtered.map(c => <ClassCard key={c.id} gymClass={c} onToggleRegistration={onToggle} />)}
      </div>
    </div>
  );
}

// --- GŁÓWNA APLIKACJA ---
export default function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [tab, setTab] = useState<'schedule' | 'stats' | 'profile'>('schedule');
  const [classes, setClasses] = useState<GymClass[]>([
    { id: '1', name: 'HIIT', instructor: 'Anna N.', time: '18:00', duration: 45, capacity: 20, enrolled: 15, level: 'Średniozaawansowany', category: 'Cardio', isRegistered: false },
    { id: '2', name: 'Yoga', instructor: 'Maria W.', time: '10:00', duration: 60, capacity: 15, enrolled: 12, level: 'Początkujący', category: 'Yoga', isRegistered: true },
    { id: '3', name: 'Siła', instructor: 'Marcin L.', time: '16:00', duration: 60, capacity: 12, enrolled: 8, level: 'Zaawansowany', category: 'Siła', isRegistered: false },
  ]);

  const toggleClass = (id: string) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, isRegistered: !c.isRegistered, enrolled: c.isRegistered ? c.enrolled - 1 : c.enrolled + 1 } : c));
  };

  if (!userId) return <LoginScreen onLogin={setUserId} />;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {tab === 'schedule' && <Schedule classes={classes} onToggle={toggleClass} />}
      {tab === 'stats' && <Statistics />}
      {tab === 'profile' && <Profile userId={userId} onLogout={() => setUserId(null)} />}
      
      <div className="fixed bottom-0 w-full bg-background border-t border-border p-2 z-50">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-2">
          {[
            { id: 'schedule', icon: Calendar, l: 'Zajęcia' },
            { id: 'stats', icon: BarChart3, l: 'Statystyki' },
            { id: 'profile', icon: User, l: 'Profil' }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)} 
              className={`flex flex-col items-center p-2 rounded-xl ${tab === t.id ? 'text-primary bg-secondary' : 'text-muted-foreground'}`}>
              <t.icon size={24} />
              <span className="text-xs mt-1 font-medium">{t.l}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}