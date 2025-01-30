"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

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
  
const salaryOptions = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

type Props = {
    selectedCategories: string[];  // SSR から受け取った現在のカテゴリ
    selectedSalary: string; 
};

export default function FilterSidebar({selectedCategories, selectedSalary} :Props){
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleCategoryChange = useCallback(
        (cat: string) => {
        // 現在のURLクエリを複製して更新
      const newParams = new URLSearchParams(searchParams.toString());
      const currentCats = newParams.getAll("category");

      if (currentCats.includes(cat)) { // 配列から除去
        const idx = currentCats.indexOf(cat);
        currentCats.splice(idx, 1);
      } else {
        currentCats.push(cat);
      }
      newParams.delete("category");// 一旦 category を全部消してから、改めて追加
      currentCats.forEach(c => newParams.append("category", c));
      newParams.delete("page"); // ページを1に戻す
      router.push(`/jobs?${newParams.toString()}`);
    },
    [router, searchParams]
  );

  const handleSalaryChange = useCallback(
    (newSalary: string) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (newSalary) {
        newParams.set("salaryMin", newSalary);
      } else {
        newParams.delete("salaryMin");
      }
      newParams.delete("page");

      router.push(`/jobs?${newParams.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <aside className="w-1/4 p-4 bg-gray-100">
      <h2 className="font-bold mb-2">求人カテゴリ</h2>
      <div className="flex flex-col mb-4">
        {categoriesData.map(cat => (
          <label key={cat} className="inline-flex items-center mb-1">
            <input
              type="checkbox"
              className="mr-2"
              checked={selectedCategories.includes(cat)}
              onChange={() => handleCategoryChange(cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      <h2 className="font-bold mb-2">年収</h2>
      <select
        className="border p-1"
        value={selectedSalary}
        onChange={(e) => handleSalaryChange(e.target.value)}
      >
        <option value="">指定なし</option>
        {salaryOptions.map(s => (
          <option key={s} value={String(s)}>
            {s}万円以上
          </option>
        ))}
      </select>
    </aside>
  );
}

