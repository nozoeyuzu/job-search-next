import Link from "next/link";
import CreateJobForm from "@/app/components/CreateJobForm";

export default function CreateJobPage(){
  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="bg-blue-900 text-white p-4 flex justify-between">
        <div className="font-bold text-xl">求人検索アプリ</div>
        <div>
          <Link href="/" className="mr-4">求人検索</Link>
          <Link href="/post">求人投稿</Link>
        </div>
      </header>

      {/* クライアントコンポーネント */}
      <CreateJobForm />
    </div>
  );
}