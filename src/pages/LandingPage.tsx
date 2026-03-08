import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Users, Zap, ArrowRight, Github } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Track.</span>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/auth" state={{ mode: 'login' }} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Masuk</Link>
            <Link to="/auth" state={{ mode: 'signup' }} className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all">Daftar</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-black mb-8 leading-[0.9]">
              PELACAKAN TUGAS <br />
              <span className="text-gray-400 italic">KOLABORATIF</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-12 leading-relaxed">
              Platform terbaik bagi tim untuk membangun, melacak, dan menyelesaikan proyek perangkat lunak dengan presisi dan kecepatan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth" state={{ mode: 'signup' }} className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-full text-lg font-medium flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                Mulai Membangun Sekarang
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto border border-gray-200 px-8 py-4 rounded-full text-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                Lihat Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-6 h-6" />,
                title: "Kolaborasi Tim",
                description: "Dibuat untuk tim dari berbagai ukuran. Pembaruan real-time dan papan tugas bersama menjaga semua orang tetap selaras."
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Sangat Cepat",
                description: "Dioptimalkan untuk kecepatan. Rasakan transisi yang mulus dan persistensi data instan dengan Firebase."
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: "Manajemen Tugas",
                description: "Alat komprehensif untuk melacak kemajuan, menetapkan prioritas, dan memenuhi tenggat waktu."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-xl hover:shadow-black/5 transition-all"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-black">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Track.</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 Track Inc. Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <Github className="w-5 h-5 text-gray-400 hover:text-black cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
