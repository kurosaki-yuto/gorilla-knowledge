"use client";

import { useState, useEffect, useCallback } from "react";

interface UserRow {
  id: string;
  name: string;
  companyName: string;
  role: string;
  createdAt: string;
}

async function fetchUsers(): Promise<UserRow[]> {
  const res = await fetch("/api/admin?type=users");
  return res.json();
}

async function post(body: Record<string, unknown>) {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export function UserManager() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ id: "", name: "", password: "", companyName: "", role: "student" });

  const load = useCallback(async () => { setUsers(await fetchUsers()); }, []);
  useEffect(() => { load(); }, [load]);

  const handleSubmit = async () => {
    if (editingId) {
      await post({ action: "updateUser", id: editingId, name: form.name, companyName: form.companyName, role: form.role, password: form.password || undefined });
    } else {
      await post({ action: "createUser", id: form.id, name: form.name, password: form.password, companyName: form.companyName, role: form.role });
    }
    setShowForm(false);
    setEditingId(null);
    setForm({ id: "", name: "", password: "", companyName: "", role: "student" });
    load();
  };

  const handleEdit = (u: UserRow) => {
    setEditingId(u.id);
    setForm({ id: u.id, name: u.name, password: "", companyName: u.companyName, role: u.role });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このユーザーを削除しますか？")) return;
    await post({ action: "deleteUser", id });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">ユーザー管理</h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ id: "", name: "", password: "", companyName: "", role: "student" }); }}
          className="text-sm text-gray-500 hover:text-black cursor-pointer"
        >
          ＋ ユーザー追加
        </button>
      </div>

      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between py-3 px-4 border border-gray-200 rounded">
            <div>
              <p className="text-sm font-medium">{u.name}</p>
              <p className="text-xs text-gray-500">
                ID: {u.id} ・ {u.companyName} ・ {u.role === "admin" ? "管理者" : "受講生"}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEdit(u)} className="text-xs text-gray-500 hover:text-black cursor-pointer">編集</button>
              <button onClick={() => handleDelete(u.id)} className="text-xs text-gray-400 hover:text-red-500 cursor-pointer">削除</button>
            </div>
          </div>
        ))}
      </div>

      {/* フォーム */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold mb-4">{editingId ? "ユーザー編集" : "ユーザー追加"}</h3>
            <div className="space-y-3">
              <input
                value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })}
                disabled={!!editingId}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black disabled:bg-gray-50"
                placeholder="ユーザーID"
              />
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black" placeholder="氏名" />
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black" placeholder={editingId ? "パスワード（変更する場合のみ）" : "パスワード"} />
              <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black" placeholder="会社名" />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black">
                <option value="student">受講生</option>
                <option value="admin">管理者</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSubmit} className="px-4 py-2 bg-black text-white text-sm rounded cursor-pointer">{editingId ? "保存" : "追加"}</button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500 cursor-pointer">キャンセル</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
