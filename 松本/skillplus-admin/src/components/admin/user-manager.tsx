"use client";

import { useState, useEffect, useCallback } from "react";

interface UserRow {
  id: string;
  name: string;
  companyName: string;
  role: string;
  createdAt: string;
}

interface TrainingItem {
  id: string;
  name: string;
}

interface CategoryItem {
  id: string;
  trainingId: string;
  name: string;
}

async function fetchUsers(): Promise<UserRow[]> {
  const res = await fetch("/api/admin?type=users");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
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

  // アクセス制御用state
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessUserId, setAccessUserId] = useState<string | null>(null);
  const [accessUserName, setAccessUserName] = useState("");
  const [allTrainings, setAllTrainings] = useState<TrainingItem[]>([]);
  const [categoriesByTraining, setCategoriesByTraining] = useState<Record<string, CategoryItem[]>>({});
  const [selectedTrainingIds, setSelectedTrainingIds] = useState<Set<string>>(new Set());
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
  const [accessLoading, setAccessLoading] = useState(false);
  const [accessSaving, setAccessSaving] = useState(false);

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

  // アクセス制御モーダルを開く
  const handleOpenAccess = async (u: UserRow) => {
    setAccessUserId(u.id);
    setAccessUserName(u.name);
    setAccessLoading(true);
    setShowAccessModal(true);

    // 研修一覧とユーザーのアクセス設定を並行で取得
    const [trainingsRes, accessRes] = await Promise.all([
      fetch("/api/admin?type=trainings").then((r) => r.json()),
      fetch(`/api/admin?type=userAccess&userId=${u.id}`).then((r) => r.json()),
    ]);

    const trainings: TrainingItem[] = (trainingsRes || []).map((t: Record<string, string>) => ({ id: t.id, name: t.name }));
    setAllTrainings(trainings);

    const accessTrainingIds: string[] = accessRes.trainingIds || [];
    const accessCategoryIds: string[] = accessRes.categoryIds || [];
    setSelectedTrainingIds(new Set(accessTrainingIds));
    setSelectedCategoryIds(new Set(accessCategoryIds));

    // チェック済み研修のカテゴリーを取得
    const catMap: Record<string, CategoryItem[]> = {};
    await Promise.all(
      trainings.map(async (t) => {
        const cats = await fetch(`/api/admin?type=categories&trainingId=${t.id}`).then((r) => r.json());
        catMap[t.id] = (cats || []).map((c: Record<string, string>) => ({ id: c.id, trainingId: c.trainingId || t.id, name: c.name }));
      })
    );
    setCategoriesByTraining(catMap);
    setAccessLoading(false);
  };

  // 研修チェックボックスのトグル
  const toggleTraining = (trainingId: string) => {
    setSelectedTrainingIds((prev) => {
      const next = new Set(prev);
      if (next.has(trainingId)) {
        next.delete(trainingId);
        // この研修のカテゴリーも全て外す
        const cats = categoriesByTraining[trainingId] || [];
        setSelectedCategoryIds((prevCats) => {
          const nextCats = new Set(prevCats);
          cats.forEach((c) => nextCats.delete(c.id));
          return nextCats;
        });
      } else {
        next.add(trainingId);
      }
      return next;
    });
  };

  // カテゴリーチェックボックスのトグル
  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // アクセス設定を保存
  const handleSaveAccess = async () => {
    if (!accessUserId) return;
    setAccessSaving(true);
    await post({
      action: "setUserAccess",
      userId: accessUserId,
      trainingIds: Array.from(selectedTrainingIds),
      categoryIds: Array.from(selectedCategoryIds),
    });
    setAccessSaving(false);
    setShowAccessModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">ユーザー管理</h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ id: "", name: "", password: "", companyName: "", role: "student" }); }}
          className="text-sm text-gray-700 hover:text-black cursor-pointer"
        >
          ＋ ユーザー追加
        </button>
      </div>

      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between py-3 px-4 border border-gray-200 rounded">
            <div>
              <p className="text-sm font-medium">{u.name}</p>
              <p className="text-xs text-gray-700">
                ID: {u.id} ・ {u.companyName} ・ {u.role === "admin" ? "管理者" : "受講生"}
              </p>
            </div>
            <div className="flex gap-3">
              {u.role !== "admin" && (
                <button onClick={() => handleOpenAccess(u)} className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">閲覧権限</button>
              )}
              <button onClick={() => handleEdit(u)} className="text-xs text-gray-700 hover:text-black cursor-pointer">編集</button>
              <button onClick={() => handleDelete(u.id)} className="text-xs text-gray-600 hover:text-red-500 cursor-pointer">削除</button>
            </div>
          </div>
        ))}
      </div>

      {/* ユーザー追加/編集フォーム */}
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
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-700 cursor-pointer">キャンセル</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* アクセス制御モーダル */}
      {showAccessModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={() => setShowAccessModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold mb-1">閲覧権限の設定</h3>
            <p className="text-xs text-gray-500 mb-4">{accessUserName}（{accessUserId}）</p>

            {accessLoading ? (
              <p className="text-sm text-gray-500 py-8 text-center">読み込み中...</p>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-3">
                  チェックが無い場合は全て閲覧可能です。チェックを入れると、選択した研修・カテゴリーのみ閲覧可能になります。
                </p>
                <div className="space-y-3">
                  {allTrainings.map((t) => {
                    const cats = categoriesByTraining[t.id] || [];
                    const isTrainingChecked = selectedTrainingIds.has(t.id);
                    return (
                      <div key={t.id} className="border border-gray-200 rounded p-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isTrainingChecked}
                            onChange={() => toggleTraining(t.id)}
                            className="cursor-pointer"
                          />
                          <span className="text-sm font-medium">{t.name}</span>
                        </label>
                        {isTrainingChecked && cats.length > 0 && (
                          <div className="ml-6 mt-2 space-y-1">
                            {cats.map((c) => (
                              <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedCategoryIds.has(c.id)}
                                  onChange={() => toggleCategory(c.id)}
                                  className="cursor-pointer"
                                />
                                <span className="text-xs">{c.name}</span>
                              </label>
                            ))}
                            <p className="text-xs text-gray-400 mt-1">
                              カテゴリーにチェックが無い場合は、この研修の全カテゴリーが閲覧可能です
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSaveAccess}
                    disabled={accessSaving}
                    className="px-4 py-2 bg-black text-white text-sm rounded cursor-pointer disabled:opacity-50"
                  >
                    {accessSaving ? "保存中..." : "保存"}
                  </button>
                  <button onClick={() => setShowAccessModal(false)} className="px-4 py-2 text-sm text-gray-700 cursor-pointer">キャンセル</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
