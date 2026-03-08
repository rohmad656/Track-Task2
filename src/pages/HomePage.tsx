import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { taskService, Task } from "../services/taskService";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  Circle,
  LogOut,
  User as UserIcon,
  ChevronRight,
  Clock,
  AlertCircle
} from "lucide-react";
import { cn } from "../lib/utils";

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" as const });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (user) {
      const unsubscribe = taskService.subscribeToTasks(user.uid, (data) => {
        setTasks(data);
      });
      return unsubscribe;
    }
  }, [user]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !user) return;
    
    await taskService.addTask({
      ...newTask,
      completed: false,
      userId: user.uid
    });
    
    setNewTask({ title: "", description: "", priority: "medium" });
    setIsAdding(false);
  };

  const toggleTask = async (task: Task) => {
    await taskService.updateTask(task.id, { completed: !task.completed });
  };

  const deleteTask = async (id: string) => {
    await taskService.deleteTask(id);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                         t.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" ? true : 
                         filter === "completed" ? t.completed : !t.completed;
    const matchesPriority = priorityFilter === "all" ? true : t.priority === priorityFilter;
    return matchesSearch && matchesFilter && matchesPriority;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900">
      {/* Sidebar / Navigation */}
      <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Track.</span>
        </div>

        <div className="space-y-1 mb-auto">
          {[
            { label: "Semua Tugas", icon: <Calendar className="w-4 h-4" />, value: "all" },
            { label: "Aktif", icon: <Clock className="w-4 h-4" />, value: "active" },
            { label: "Selesai", icon: <CheckCircle2 className="w-4 h-4" />, value: "completed" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                filter === item.value ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50 hover:text-black"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Profile Section */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ""} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.displayName || "Pengguna"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <ChevronRight className={cn("w-4 h-4 text-gray-400 transition-transform", showProfileMenu && "rotate-90")} />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50"
              >
                <button 
                  onClick={async () => {
                    await logout();
                    navigate("/");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-10 max-w-5xl mx-auto">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-1">
                Selamat datang, <span className="text-gray-400 italic">{user?.displayName?.split(' ')[0] || "Pengguna"}</span>
              </h2>
              <p className="text-gray-500">Anda memiliki {stats.active} tugas aktif hari ini.</p>
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-black text-white px-6 py-3 rounded-2xl font-medium flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-black/10"
            >
              <Plus className="w-5 h-5" />
              Tambah Tugas Baru
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Tugas", value: stats.total, color: "bg-blue-50 text-blue-600" },
              { label: "Selesai", value: stats.completed, color: "bg-emerald-50 text-emerald-600" },
              { label: "Aktif", value: stats.active, color: "bg-orange-50 text-orange-600" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                <p className={cn("text-2xl font-bold", stat.color.split(' ')[1])}>{stat.value}</p>
              </div>
            ))}
          </div>
        </header>

        {/* Search & Filter */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari tugas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:border-black/10 outline-none transition-all shadow-sm"
              />
            </div>
            <div className="flex gap-2 lg:hidden overflow-x-auto pb-2">
               {/* Mobile Filter Tabs */}
               {["all", "active", "completed"].map((f) => (
                 <button
                   key={f}
                   onClick={() => setFilter(f as any)}
                   className={cn(
                     "px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all whitespace-nowrap",
                     filter === f ? "bg-black text-white" : "bg-white text-gray-500 border border-gray-100"
                   )}
                 >
                   {f === "all" ? "Semua" : f === "active" ? "Aktif" : "Selesai"}
                 </button>
               ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-2">Prioritas:</span>
            {["all", "low", "medium", "high"].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
                  priorityFilter === p 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
                )}
              >
                {p === "all" ? "Semua" : p === "low" ? "Rendah" : p === "medium" ? "Sedang" : "Tinggi"}
              </button>
            ))}
          </div>
        </div>

        {/* Task List - Refactored for mobile-friendliness */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "group bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start gap-4",
                    task.completed && "opacity-60"
                  )}
                >
                  <div className="flex items-start gap-4 w-full">
                    <button 
                      onClick={() => toggleTask(task)}
                      className="mt-1 text-gray-400 hover:text-black transition-colors shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className={cn(
                          "font-semibold text-lg truncate max-w-[200px] sm:max-w-none",
                          task.completed && "line-through text-gray-400"
                        )}>
                          {task.title}
                        </h3>
                        <span className={cn(
                          "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
                          task.priority === "high" ? "bg-red-50 text-red-500" :
                          task.priority === "medium" ? "bg-orange-50 text-orange-500" :
                          "bg-blue-50 text-blue-500"
                        )}>
                          {task.priority === "high" ? "Tinggi" : task.priority === "medium" ? "Sedang" : "Rendah"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
                    </div>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada tugas ditemukan</h3>
                <p className="text-gray-500 px-4">
                  {search ? "Coba sesuaikan pencarian atau filter Anda" : "Mulai perjalanan Anda dengan menambahkan tugas pertama Anda!"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleAddTask} className="p-8">
                <h3 className="text-2xl font-bold mb-6">Buat Tugas Baru</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">Judul</label>
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Apa yang perlu dilakukan?"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black/10 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">Deskripsi</label>
                    <textarea 
                      placeholder="Tambahkan beberapa detail..."
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black/10 outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">Prioritas</label>
                    <div className="flex gap-2">
                      {(["low", "medium", "high"] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewTask({...newTask, priority: p})}
                          className={cn(
                            "flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all",
                            newTask.priority === p 
                              ? "bg-black text-white border-black" 
                              : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
                          )}
                        >
                          {p === "low" ? "Rendah" : p === "medium" ? "Sedang" : "Tinggi"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
                  >
                    Buat Tugas
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
