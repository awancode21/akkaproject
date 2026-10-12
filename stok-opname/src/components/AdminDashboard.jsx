/**
 * ============================================================================
 * DESKTOP ADMIN & MANAGEMENT PORTAL (TAHAP 4 & 5)
 * APLIKASI WEB STOK OPNAME 2 TIM (SUPABASE & GOOGLE SHEETS)
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { 
  Boxes, Users, Calendar, ClipboardList, CheckCircle2, AlertTriangle, 
  RefreshCw, FileText, Shield, Settings, Barcode, Search, Plus, 
  ArrowRightLeft, Check, X, Clock, Database, Server, Monitor, 
  LogOut, Lock, Unlock, Eye, EyeOff, Play, AlertCircle, Layers, 
  Activity, CheckSquare, ChevronRight, Filter, Download, Upload
} from 'lucide-react';

export default function AdminDashboard() {
  const [currentRole, setCurrentRole] = useState('Admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Mock Master Items (Simulating 70,000 SKU pagination & search)
  const [masterItems, setMasterItems] = useState([
    { sku: 'SKU-001', nama_barang: 'Semen Gresik 40kg', family: 'Building Material', original_code: 'SG-40', updated_at: '2026-10-12 08:00' },
    { sku: 'SKU-002', nama_barang: 'Besi Beton 10mm SNI', family: 'Steel', original_code: 'BS-10', updated_at: '2026-10-12 08:05' },
    { sku: 'SKU-003', nama_barang: 'Paku Payung 1 Inch', family: 'Hardware', original_code: 'PK-01', updated_at: '2026-10-12 08:10' },
    { sku: 'SKU-004', nama_barang: 'Cat Tembok Dulux 25kg Putih', family: 'Paint', original_code: 'DLX-25', updated_at: '2026-10-12 08:15' },
    { sku: 'SKU-005', nama_barang: 'Pipa PVC 3 Inch Wavin', family: 'Plumbing', original_code: 'PVC-03', updated_at: '2026-10-12 08:20' },
  ]);

  // Sync state
  const [syncStatus, setSyncStatus] = useState('Idle');
  const [syncProgress, setSyncProgress] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTriggerSync = () => {
    setSyncStatus('Running');
    setSyncProgress(10);
    showToast('Memulai sinkronisasi master 70.000 SKU dari Google Sheets...', 'success');

    setTimeout(() => setSyncProgress(40), 1000);
    setTimeout(() => setSyncProgress(80), 2000);
    setTimeout(() => {
      setSyncProgress(100);
      setSyncStatus('Success');
      showToast('Sinkronisasi 70,000 SKU berhasil diselesaikan!');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-white tracking-tight">Stok Opname 2 Tim</h1>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono font-bold">Supabase & GSheet</span>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard Utama', icon: Monitor },
              { id: 'master', label: 'Master Item (70k SKU)', icon: Database },
              { id: 'jadwal', label: 'Periode & Jadwal SO', icon: Calendar },
              { id: 'penugasan', label: 'Penugasan 2 Tim', icon: Users },
              { id: 'compare', label: 'Compare Otomatis', icon: ArrowRightLeft },
              { id: 'revisi', label: 'Antrean Revisi', icon: RefreshCw },
              { id: 'approval', label: 'Approval Final', icon: CheckSquare },
              { id: 'sync', label: 'Monitoring Sync', icon: Server },
              { id: 'audit', label: 'Audit Trail', icon: Shield },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Role & User Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400">Role Aktif:</span>
            <select 
              value={currentRole}
              onChange={(e) => {
                setCurrentRole(e.target.value);
                showToast(`Beralih ke role ${e.target.value}`);
              }}
              className="bg-slate-800 border border-slate-700 text-indigo-400 text-xs font-bold px-2 py-1 rounded-lg focus:outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Approver">Approver</option>
              <option value="Petugas Tim 1">Petugas Tim 1</option>
              <option value="Petugas Tim 2">Petugas Tim 2</option>
            </select>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Supabase RLS: Active ({currentRole})</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between z-30">
          <div className="flex items-center space-x-3">
            <h2 className="text-base font-bold text-white capitalize">
              {activeTab === 'master' ? 'Manajemen Master Item (70.000 SKU)' : activeTab.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            {toast && (
              <div className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white animate-pulse ${
                toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
              }`}>
                {toast.msg}
              </div>
            )}
            <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 font-mono">
              SO-2026-10 (Aktif)
            </div>
          </div>
        </header>

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                  <div className="text-xs text-slate-400 font-medium">Total Master SKU</div>
                  <div className="text-2xl font-extrabold text-white mt-1">70,000</div>
                  <div className="text-[11px] text-emerald-400 mt-2 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sinkron GSheet Aktif</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                  <div className="text-xs text-slate-400 font-medium">Progres Tim 1</div>
                  <div className="text-2xl font-extrabold text-sky-400 mt-1">82.5%</div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-3">
                    <div className="bg-sky-500 h-full w-[82.5%]"></div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                  <div className="text-xs text-slate-400 font-medium">Progres Tim 2</div>
                  <div className="text-2xl font-extrabold text-amber-400 mt-1">78.0%</div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-3">
                    <div className="bg-amber-500 h-full w-[78%]"></div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                  <div className="text-xs text-slate-400 font-medium">Status Compare & Selisih</div>
                  <div className="text-2xl font-extrabold text-rose-400 mt-1">12 SKU</div>
                  <div className="text-[11px] text-slate-400 mt-2">Menunggu antrean revisi</div>
                </div>
              </div>

              {/* Quick Sync & System Status Card */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Server className="w-4 h-4 text-indigo-400" />
                  <span>Status Infrastruktur & Integrasi</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Supabase PostgreSQL</div>
                    <div className="text-emerald-400 font-bold mt-1">Connected (RLS Enabled)</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Google Apps Script Sync</div>
                    <div className="text-indigo-400 font-bold mt-1">Ready (Batch 1,000 SKU)</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Terakhir Sinkronisasi</div>
                    <div className="text-white font-bold mt-1">10 Menit Lalu (Incremental)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MASTER ITEM (70K SKU) */}
          {activeTab === 'master' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari SKU atau Nama Barang..."
                      className="w-full bg-slate-950 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <select 
                    value={selectedFamily}
                    onChange={(e) => setSelectedFamily(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-slate-300 text-xs px-3 py-2 rounded-xl focus:outline-none"
                  >
                    <option value="ALL">Semua Family</option>
                    <option value="Building Material">Building Material</option>
                    <option value="Steel">Steel</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Paint">Paint</option>
                    <option value="Plumbing">Plumbing</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                  <button 
                    onClick={handleTriggerSync}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center space-x-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>Sync 70k SKU dari GSheet</span>
                  </button>
                </div>
              </div>

              {/* Master Item Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="p-4">SKU</th>
                      <th className="p-4">Nama Barang</th>
                      <th className="p-4">Family</th>
                      <th className="p-4">Original Code</th>
                      <th className="p-4">Updated At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {masterItems.map(item => (
                      <tr key={item.sku} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-indigo-400">{item.sku}</td>
                        <td className="p-4 font-semibold text-white">{item.nama_barang}</td>
                        <td className="p-4 text-slate-300">{item.family}</td>
                        <td className="p-4 font-mono text-slate-400">{item.original_code}</td>
                        <td className="p-4 text-slate-400 text-[11px]">{item.updated_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: MONITORING SYNC */}
          {activeTab === 'sync' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Server className="w-5 h-5 text-indigo-400" />
                  <span>Kontrol Sinkronisasi Google Sheets & Supabase</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Sinkronisasi master item 70.000 SKU berjalan secara batch (1.000 baris per request) dengan Idempotency Key dan mekanisme retry exponential backoff.
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Status Proses: <strong className="text-indigo-400">{syncStatus}</strong></span>
                    <span className="font-mono text-slate-400">{syncProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${syncProgress}%` }}></div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button 
                    onClick={handleTriggerSync}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20"
                  >
                    Jalankan Manual Sync Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
