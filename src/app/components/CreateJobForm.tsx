'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const categoriesData = [
  "事務",
  "エンジニア",
  "営業",
  "デザイン",
  "マーケティング",
  "財務・経理",
  "人事",
  "カスタマーサポート",
  "製造",
  "医療・介護",    
];

const CreateJobPage: React.FC = () => {
    const [category, setCategory] = useState('');
    const [salary, setSalary] = useState<number | "">("");
    const [title, setTitle] = useState('');
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!title || !category || salary === "") {
          alert("すべての項目を入力してください");
          return;
        }

        try {
          const res = await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category,
              salary: Number(salary),
              title,
            }),
          });
    
          const data = await res.json();
    
          if (data.success) {
            router.push('/'); // 成功したら求人一覧へ遷移
          } else {
            alert('投稿に失敗しました: ' + data.message);
          }
        } catch (error) {
          console.error("エラー:", error);
          alert("投稿に失敗しました");
        }
      };

        return (
      <div className="flex flex-1 justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
          <h2 className="text-xl font-bold mb-4">求人投稿</h2>

          {/* カテゴリ選択 */}
          <label className="block mb-2">
            カテゴリを選択
            <select
              className="border w-full p-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">選択してください</option>
              {categoriesData.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          {/* 年収入力 */}
          <label className="block mb-2">
            年収 (万円)
            <input
              type="number"
              className="border w-full p-2"
              value={salary}
              onChange={(e) => setSalary(e.target.value ? Number(e.target.value) : "")}
            />
          </label>

          {/* 求人タイトル入力 */}
          <label className="block mb-4">
            求人タイトル
            <input
              type="text"
              className="border w-full p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          {/* 投稿ボタン */}
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            投稿
          </button>
        </form>
      </div>
  );
}
export default CreateJobPage;