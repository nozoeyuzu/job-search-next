import Link from "next/link";
export const dynamic = "force-dynamic";
import FilterSidebar from "../components/FilterSidebar";

export const revalidate = 0;

interface Job {
    id: string;
    category: string;
    salary: number;
    title: string;
  }

interface SearchParams {
    category?: string | string[];
    salaryMin?: string;  
    page?: string;       
  }

async function getJobs(searchParams: Record<string, string | string[] | undefined>) {
    const urlParams = new URLSearchParams();
    if (searchParams.category) {
      // categoryが配列か単一か判定
      if (Array.isArray(searchParams.category)) {
        searchParams.category.forEach((c) => {
          urlParams.append("category", c);
        });
      } else {
        urlParams.set("category", searchParams.category);
      }
    }
    if (searchParams.salaryMin) {
        // salaryMin が配列でないことを確認してから set する
        if (Array.isArray(searchParams.salaryMin)) {
          urlParams.set("salaryMin", searchParams.salaryMin[0]); 
        } else {
          urlParams.set("salaryMin", searchParams.salaryMin);
        }
      }
    if (searchParams.page)  {
        // page も同様に配列かどうか確認
        if (Array.isArray(searchParams.page)) {
          urlParams.set("page", searchParams.page[0]); 
        } else {
          urlParams.set("page", searchParams.page); 
        }
      }
  
    // API呼び出し
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/jobs?${urlParams.toString()}`, {
      cache: "no-store",
      headers: {
        "Accept-Encoding": "gzip", // ✅ Gzip 圧縮をリクエスト
      },
    });
    
    if (!res.ok) {
      throw new Error("求人情報の取得に失敗しました");
    }
    return res.json(); 
  }

  export default async function JobsPage({
    searchParams,
  }: {
    searchParams: Promise<SearchParams>;
  }) {
    const resolvedSearchParams = await searchParams; // 非同期解決
    const categoryParamArray = Array.isArray(resolvedSearchParams?.category)
      ? resolvedSearchParams.category
      : resolvedSearchParams?.category
      ? [resolvedSearchParams.category]
      : [];
    const salaryMinParam = resolvedSearchParams?.salaryMin || "";
    const pageParam = resolvedSearchParams?.page
      ? Number(resolvedSearchParams.page)
      : 1;  
  
    // データ取得
    const { jobs, total_count } = await getJobs({
      category: categoryParamArray,
      salaryMin: salaryMinParam,
      page: String(pageParam),
    });
  
    // ページネーション計算
    const perPage = 10;
    const totalPages = Math.ceil(total_count / perPage);
  
    return(
        <div className="min-h-screen flex flex-col">
        {/* ヘッダー */}
        <header className="bg-blue-900 text-white p-6 flex justify-between">
          <div className="font-bold text-2xl">求人検索アプリ</div>
          <nav>
            <Link href="/jobs" className="mr-4 text-lg">
              求人検索
            </Link>
            <Link href="/post" className="text-lg">求人投稿</Link>
          </nav>
        </header>
  
        {/* メインコンテンツ */}
        <div className="flex flex-1">
        {/* サイドバーをクライアントコンポーネントとして設置 */}
        <FilterSidebar
          selectedCategories={categoryParamArray}
          selectedSalary={salaryMinParam}
        />
  
          {/* 求人リスト */}
          <main className="w-3/4 p-4">
            <div className="font-bold mb-2 text-xl">求人一覧</div>
            <div className="mb-4">該当件数: {total_count}件</div>
            <div className="space-y-4">
              {jobs.map((job: Job) => (
                <div key={job.id} className="border p-4 rounded-md border-gray-400 ">
                  <div className="font-bold text-lg">{job.title}</div>
                  <div>カテゴリ: {job.category}</div>
                  <div>年収: {job.salary}万円</div>
                </div>
              ))}
            </div>
  
            {/* ページネーション (単純化) */}
            {totalPages > 1 && (
              <div className="flex gap-2 justify-center mt-4">
                {/* 前へ */}
                <Link
                  href={`/jobs?${new URLSearchParams({
                    category: categoryParamArray.join(","), 
                    salaryMin: salaryMinParam,
                    page: String(Math.max(1, pageParam - 1)),
                  }).toString()}`}
                  className="px-3 py-1 bg-white"
                >
                  &lt;
                </Link>
  
                {/* 5ページ分表示 */}
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const startPage = Math.max(
                    1,
                    Math.min(pageParam - 2, totalPages - 4)
                  );
                  const pageNumber = startPage + index;
                  return (
                    <Link
                      key={pageNumber}
                      href={`/jobs?${new URLSearchParams({
                        category: categoryParamArray.join(","),
                        salaryMin: salaryMinParam,
                        page: String(pageNumber),
                      }).toString()}`}
                      className={`px-3 py-1 ${
                        pageNumber === pageParam
                          ? "bg-blue-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      {pageNumber}
                    </Link>
                  );
                })}
  
                {/* 次へ */}
                <Link
                  href={`/jobs?${new URLSearchParams({
                    category: categoryParamArray.join(","),
                    salaryMin: salaryMinParam,
                    page: String(Math.min(totalPages, pageParam + 1)),
                  }).toString()}`}
                  className="px-3 py-1 bg-white"
                >
                  &gt;
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }