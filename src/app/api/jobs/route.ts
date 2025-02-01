import { NextResponse } from "next/server";
import { supabase } from '@/utils/supabase';
import zlib from "zlib"; // Gzip 圧縮を適用

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const categoryArray = url.searchParams.getAll("category");
        const salaryMin = url.searchParams.get("salaryMin")
          ? Number(url.searchParams.get("salaryMin"))
          : undefined;

         // ページ数を取得（指定が無い場合は1ページ目とする）
        const pageParam = url.searchParams.get("page");
        const page = pageParam ? parseInt(pageParam, 10) : 1;
        const limit = 10;
        const from = (page - 1) * limit;
        const to = from + limit - 1; // range は開始～終了のindex指定

        // let countQuery = supabase
        //     .from("jobs")
        //     .select("id", { count: "exact", head: true });

        // if (categoryArray.length > 0) {
        //     countQuery = countQuery.in("category", categoryArray);
        // }
        // if (salaryMin) {
        //     countQuery = countQuery.gte("salary", salaryMin);
        // }

        // const { count, error: countError } = await countQuery;
        // if (countError) {
        //     return NextResponse.json({ error: countError.message }, { status: 500 });
        // }
    
        // let dataQuery = supabase
        //     .from("jobs")
        //     .select("id, title, category, salary")
        //     .order("id", { ascending: true })
        //     .range(from, to);

        // if (categoryArray.length > 0) {
        //     dataQuery = dataQuery.in("category", categoryArray);
        // }
        // if (salaryMin) {
        //     dataQuery = dataQuery.gte("salary", salaryMin);
        // }

        // const { data, error: dataError } = await dataQuery;
        // if (dataError) {
        //     return NextResponse.json({ error: dataError.message }, { status: 500 });
        // }
        
        // ✅ Supabase クエリを作成
        let query = supabase
        .from("jobs")
        .select("id, title, category, salary", { count: "exact" })
        .order("id", { ascending: true })
        .range(from, to);

        // ✅ カテゴリフィルタリング
        if (categoryArray.length > 0) {
            query = query.in("category", categoryArray);
        }
        
        // ✅ 最低給与フィルタリング
        if (salaryMin) {
            query = query.gte("salary", salaryMin);
        }

        // ✅ クエリ実行
        const { data, count, error } = await query.throwOnError();
        if (error) throw error;

        // ✅ Gzip 圧縮を適用
        const compressedData = zlib.gzipSync(
            JSON.stringify({ jobs: data ?? [], total_count: count ?? 0 })
        );

        return new Response(compressedData, {
            headers: {
              "Content-Encoding": "gzip",
              "Content-Type": "application/json",
            },
          });


    } catch (error) {
        console.error("❌ API Error:", error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const{ category, salary, title} = await request.json();

        if (!category || !salary || !title) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        const { data, error} = await supabase
        .from ("jobs")
        .insert ([{category, salary, title}])
        .select("id, title, category, salary");

        if(error){
            throw error
        }
        
        return NextResponse.json({success: true, data}, {status: 200})
    } catch (err: unknown) {
        return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 })
    }
}