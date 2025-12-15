import { DashboardLayout } from '../layouts/DashboardLayout';
import { 
  LuGithub, LuLinkedin, LuInstagram, LuCode, LuDatabase, 
  LuServer, LuLayers, LuZap, LuShieldCheck 
} from 'react-icons/lu';

export default function About() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">About Task Manager</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A real-time collaborative platform designed to streamline team workflows 
            and boost productivity with instant updates and secure task management.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<LuZap size={24} className="text-amber-500" />}
            title="Real-Time Sync"
            desc="Updates happen instantly across all devices using Socket.io technology."
          />
          <FeatureCard 
            icon={<LuShieldCheck size={24} className="text-emerald-500" />}
            title="Secure & Reliable"
            desc="Built with industry-standard JWT authentication and BCrypt encryption."
          />
          <FeatureCard 
            icon={<LuLayers size={24} className="text-indigo-500" />}
            title="Team First"
            desc="Assign tasks, track priorities, and manage team workloads efficiently."
          />
        </div>

        <div className="border-t border-slate-200" />

        {/* Developer Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-200 text-white text-3xl font-bold">
            BK
          </div>
          <div className="text-center md:text-left flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Bhushan Kumavat</h2>
              <p className="text-slate-500 font-medium">Software Developer</p>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Passionate about building scalable web applications and crafting intuitive user experiences.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
              <SocialLink href="https://github.com/GamerBhushan" icon={<LuGithub size={20} />} label="GitHub" />
              <SocialLink href="https://www.linkedin.com/in/bhushankumavat/" icon={<LuLinkedin size={20} />} label="LinkedIn" />
              <SocialLink href="https://instagram.com/bhushankumavat_" icon={<LuInstagram size={20} />} label="Instagram" />
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="text-center pb-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Tech Stack Used</p>
          <div className="flex flex-wrap justify-center gap-3">
            <TechBadge icon={<LuCode />} name="React + TypeScript" />
            <TechBadge icon={<LuServer />} name="Node.js + Express" />
            <TechBadge icon={<LuDatabase />} name="PostgreSQL + Prisma" />
            <TechBadge icon={<LuZap />} name="Socket.io" />
            <TechBadge icon={<LuLayers />} name="Tailwind CSS" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Helper Components
function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-all text-center space-y-3">
      <div className="w-12 h-12 mx-auto bg-slate-50 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string, icon: any, label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 text-slate-600 font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-200 hover:border-indigo-200">
      {icon}<span>{label}</span>
    </a>
  );
}

function TechBadge({ icon, name }: { icon: any, name: string }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
      {icon} {name}
    </span>
  );
}