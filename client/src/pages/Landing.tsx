import { Link } from 'react-router-dom';
import { LuZap, LuShield, LuUsers, LuArrowRight, LuLayoutDashboard } from 'react-icons/lu';
import { Navbar } from '../components/Navbar'; // <--- Import Global Navbar
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* 1. GLOBAL HEADER */}
      <Navbar />

      {/* --- HERO SECTION --- */}
      {/* Added pt-20 to account for the fixed/sticky navbar height */}
      <header className="relative pt-20 pb-32 flex content-center items-center justify-center min-h-[85vh]">
        
        <div className="absolute top-0 w-full h-full bg-slate-900">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/0 to-slate-50"></div>
        </div>

        <div className="container relative mx-auto px-4">
          <div className="flex flex-wrap justify-center">
            <div className="w-full lg:w-8/12 text-center">
              
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wide mb-6">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                Now with Real-time Updates
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-white tracking-tight">
                Manage your team's work, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                  in real-time.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Stop using spreadsheets. The collaborative Task Manager gives you a clear view of who is doing what, by when. Secure, fast, and simple.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {user ? (
                  <Link to="/dashboard" className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-indigo-900/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                    Open Dashboard <LuArrowRight />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-indigo-900/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                      Start for Free <LuArrowRight />
                    </Link>
                    <Link to="/login" className="bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center">
                      Existing User
                    </Link>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* --- FEATURES SECTION --- */}
      <section className="relative pb-24 bg-slate-50 -mt-24 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<LuZap size={28} />} 
              color="indigo" 
              title="Real-Time Sync" 
              desc="Updates happen instantly. When a team member changes a task, you see it immediately via Socket.io." 
            />
            <FeatureCard 
              icon={<LuUsers size={28} />} 
              color="blue" 
              title="Team Collaboration" 
              desc="Assign tasks to specific users, track priorities, and manage workloads efficiently." 
            />
            <FeatureCard 
              icon={<LuShield size={28} />} 
              color="emerald" 
              title="Secure & Reliable" 
              desc="Built with JWT authentication, password hashing, and a robust PostgreSQL database." 
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200">
               <LuLayoutDashboard className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Task Manager</span>
          </div>
          <p className="text-slate-400 text-sm">
            &copy; 2025 Task Manager App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Helper Component for Features (DRY)
function FeatureCard({ icon, color, title, desc }: { icon: any, color: 'indigo'|'blue'|'emerald', title: string, desc: string }) {
  const bgColors = {
    indigo: 'bg-indigo-600 shadow-indigo-200',
    blue: 'bg-blue-500 shadow-blue-200',
    emerald: 'bg-emerald-500 shadow-emerald-200'
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center">
      <div className={`w-14 h-14 mb-6 shadow-lg ${bgColors[color]} rounded-2xl flex items-center justify-center text-white`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}