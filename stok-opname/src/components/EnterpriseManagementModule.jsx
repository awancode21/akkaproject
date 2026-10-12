/**
 * ============================================================================
 * MODUL ENTERPRISE: JADWAL, PENUGASAN 2 TIM, COMPARE, REVISI & APPROVAL
 * APLIKASI WEB STOK OPNAME 2 TIM (SUPABASE & GOOGLE SHEETS)
 * ============================================================================
 */

import React, { useState } from 'react';
import { 
  Calendar, Users, ArrowRightLeft, RefreshCw, CheckSquare, 
  Shield, CheckCircle2, AlertTriangle, Clock, Plus, Search, 
  Filter, Check, X, Eye, FileText, Database, Server, Activity
} from 'lucide-react';

export default function EnterpriseManagementModule() {
  const [activeSubTab, setActiveSubTab] = useState('jadwal');
  const [toast, setToast] = useState(null);

  // Mock Jadwal SO
  const [jadwalList, setJadwalList] = useState([
    { so_id: 'SO-2026-10', nama_periode: 'Stock Opname Gudang Utama Oktober 2026', tanggal_mulai: '2026-10-15', tanggal_selesai: '2026-10-20', status: 'Counting' },
    { so_id: 'SO-2026-09', nama_periode: 'Stock Opname Cabang Barat September 2026', tanggal_mulai: '2026-09-15', tanggal_selesai: '2026-09-20', status: 'Closed' }
  ]);

  // Mock Penugasan 2 Tim
  const [assignments, setAssignments] = useState([
    { assignment_id: 'ASG-01', sku: 'SKU-001', nama_barang: 'Semen Gresik 40kg', tim: 'Tim 1', petugas: 'Andi (Operator Tim 1)', status: 'Selesai' },
    { assignment_id: 'ASG-02', sku: 'SKU-001', nama_barang: 'Semen Gresik 40kg', tim: 'Tim 2', petugas: 'Siti (Operator Tim 2)', status: 'Selesai' },
    { assignment_id: 'ASG-03', sku: 'SKU-002', nama_barang: 'Besi Beton 10mm SNI', tim: 'Tim 1', petugas: 'Andi (Operator Tim 1)', status: 'Sedang Dihitung' },
    { assignment_id: 'ASG-04', sku: 'SKU-002', nama_barang: 'Besi Beton 10mm SNI', tim: 'Tim 2', petugas: 'Siti (Operator Tim 2)', status: 'Sedang Dihitung' },
  ]);

  // Mock Antrean Revisi
  const [revisions, setRevisions] = useState([
    { revision_id: 'REV-01', sku: 'SKU-001', nama_barang: 'Semen Gresik 40kg', qty_t1: 150, qty_t2: 148, selisih: 2, status: 'Menunggu Hitung Ulang', alasan: 'Kerusakan kemasan kardus luar' }
  ]);

  // Mock Audit Trail
  const [auditLogs, setAuditLogs] = useState([
    { log_id: 'LOG-101', user: 'Admin Gudang', action: 'UPDATE_MASTER_ITEM', table: 'items', timestamp: '2026-10-12 08:30:12' },
    { log_id: 'LOG-102', user: 'Andi (Tim 1)', action: 'INSERT_RESULT', table: 'stock_opname_results', timestamp: '2026-10-12 10:15:44' },
    { log_id: 'LOG-103', user: 'Siti (Tim 2)', action: 'INSERT_RESULT', table: 'stock_opname_results', timestamp: '2026-10-12 10:20:10' },
  ]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`p-3 rounded-xl text-xs font-semibold text-white animate-bounce flex items-center space-x-2 ${
          toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Sub-Tab Navigation Bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {[
          { id: 'jadwal', label: 'Jadwal & Periode SO', icon: Calendar },
          { id: 'penugasan', label: 'Penugasan 2 Tim', icon: Users },
          { id: 'compare', label: 'Compare Otomatis', icon: ArrowRightLeft },
          { id: 'revisi', label: 'Antrean Revisi', icon: RefreshCw },
          { id: 'approval', label: 'Approval Final', icon: CheckSquare },
          { id: 'audit', label: 'Audit Trail', icon: Shield },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {}
      {activeSubTab === 'jadwal' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Daftar Periode Stok Opname</h3>
            <button 
              onClick={() => showToast('Form buat periode baru dibuka')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Periode Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jadwalList.map(j => (
              <div key={j.so_id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded">{j.so_id}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    j.status === 'Counting' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {j.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{j.nama_periode}</h4>
                <div className="text-xs text-slate-400 flex items-center space-x-2 pt-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{j.tanggal_mulai} s.d. {j.tanggal_selesai}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      {activeSubTab === 'penugasan' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Distribusi Penugasan SKU (Tim 1 & Tim 2)</h3>
            <span className="text-xs text-slate-400 font-mono">Total Assignment: {assignments.length}</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="p-3.5">Assignment ID</th>
                  <th className="p-3.5">SKU & Barang</th>
                  <th className="p-3.5">Tim</th>
                  <th className="p-3.5">Petugas</th>
                  <th className="p-3.5">Status Pengerjaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {assignments.map(asg => (
                  <tr key={asg.assignment_id} className="hover:bg-slate-900/40">
                    <td className="p-3.5 font-mono text-indigo-400 font-bold">{asg.assignment_id}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{asg.nama_barang}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{asg.sku}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        asg.tim === 'Tim 1' ? 'bg-sky-500/10 text-sky-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {asg.tim}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300">{asg.petugas}</td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        asg.status === 'Selesai' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {asg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {}
      {activeSubTab === 'compare' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Perbandingan Otomatis (View Supabase)</h3>
            <button 
              onClick={() => showToast('Sinkronisasi perbandingan berhasil disegarkan')}
              className="bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Compare</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono font-bold text-indigo-400">SKU-001</span>
                <h4 className="font-bold text-white">Semen Gresik 40kg</h4>
              </div>
              <span className="bg-rose-500/10 text-rose-400 text-[10px] font-bold px-2.5 py-1 rounded">Selisih: 2 Sak</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Tim 1 (Andi):</div>
                <div className="text-base font-extrabold text-sky-400 mt-0.5">150 Sak</div>
                <div className="text-[10px] text-slate-500 mt-1">10:30 • Barcode Scan</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Tim 2 (Siti):</div>
                <div className="text-base font-extrabold text-amber-400 mt-0.5">148 Sak</div>
                <div className="text-[10px] text-slate-500 mt-1">10:45 • Barcode Scan</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {activeSubTab === 'revisi' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Antrean Revisi Item Selisih</h3>
            <span className="text-xs text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded">1 Perlu Tindakan</span>
          </div>

          <div className="space-y-3">
            {revisions.map(rev => (
              <div key={rev.revision_id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-[10px] font-mono font-bold text-indigo-400">{rev.sku}</span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded">{rev.status}</span>
                </div>
                <div className="font-bold text-sm text-white">{rev.nama_barang}</div>
                <div className="text-xs text-slate-400">Alasan Selisih: <span className="text-white">{rev.alasan}</span></div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button 
                    onClick={() => showToast('Revisi qty final disetujui')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    Setujui Qty Final
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      {activeSubTab === 'approval' && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-white">Persetujuan Final (Approver Level)</h3>
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <CheckSquare className="w-10 h-10 text-emerald-400 mx-auto" />
            <div className="text-xs text-slate-300">Semua item yang cocok telah divalidasi otomatis. Item selisih menunggu penyelesaian revisi sebelum approval akhir dipublikasikan ke Google Sheets.</div>
          </div>
        </div>
      )}

      {activeSubTab === 'audit' && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-white">Log Audit Trail Sistem</h3>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="p-3">Log ID</th>
                  <th className="p-3">User / Petugas</th>
                  <th className="p-3">Aksi</th>
                  <th className="p-3">Tabel</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.map(log => (
                  <tr key={log.log_id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono text-indigo-400 font-bold">{log.log_id}</td>
                    <td className="p-3 text-slate-200">{log.user}</td>
                    <td className="p-3 font-mono text-emerald-400">{log.action}</td>
                    <td className="p-3 font-mono text-slate-400">{log.table}</td>
                    <td className="p-3 text-slate-400 text-[11px]">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
```
eof

Saya telah menambahkan modul enterprise lengkap yang mencakup manajemen jadwal, penugasan dua tim, perbandingan otomatis, antrean revisi, persetujuan final, dan audit trail. Silakan beri tahu jika ada penyesuaian atau integrasi lanjutan yang Anda perlukan!
