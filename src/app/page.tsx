// import { supabase } from '@/utils/supabase'

// type Job = {
//   id: string
//   category: string
//   salary: number
//   title: string
// }
// // SSRを都度行うための設定
// export const revalidate = 0

// // SSRでjobsを取得する関数
// async function getJobs(searchParams?: {category?: string; salaryMin?: number}){
//   let query = supabase.from('jobs').select('*').order('id', {ascending: false})

//   if(searchParams?.category){
//     query = query.eq('category', searchParams.category)
//   }
//   if(searchParams?.salaryMin){
//     query = query.gte('salary', searchParams.salaryMin)
//   }

//   const {data, error} = await query
//   if(error){
//     console.error(error)
//     return []
//   }
//   return data as Job[]
// }

// export default async function JobsPage({
//   searchParams,
// }:{
//   searchParams: { category?: string; salaryMin?: string }
// }) {
//   const category = searchParams?.category || undefined
//   const salaryMin = searchParams?.salaryMin ? Number(searchParams.salaryMin) : undefined

//   const jobs = await getJobs({
//     category,
//     salaryMin,
//   })
//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">求人一覧</h1>

//       {/* 
//         フィルターUIなどをここに置いてもOK。
//         例: 
//         <Link href="/jobs?category=エンジニア&salaryMin=500">エンジニア・500万円以上</Link>
//       */}

//       <ul>
//         {jobs.map((job) => (
//           <li key={job.id} className="border p-2 mb-2">
//             <div>カテゴリ: {job.category}</div>
//             <div>年収: {job.salary}万円</div>
//             <div>タイトル: {job.title}</div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// 'use client'

// import { useEffect, useState } from 'react'
// import { useSearchParams } from 'next/navigation'

// type Job = {
//   id: string
//   category: string
//   salary: number
//   title: string
// }

// export default function JobsPage() {
//   const [jobs, setJobs] = useState<Job[]>([])
//   const searchParams = useSearchParams()

//   useEffect(() => {
//     const fetchJobs = async () => {
//       const category = searchParams.get('category') || undefined
//       const salaryMin = searchParams.get('salaryMin') ? Number(searchParams.get('salaryMin')) : undefined

//       const res = await fetch(`/api/jobs?category=${category || ''}&salaryMin=${salaryMin || ''}`)
//       const data = await res.json()
//       setJobs(data)
//     }

//     fetchJobs()
//   }, [searchParams])

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">求人一覧</h1>
//       <ul>
//         {jobs.map((job) => (
//           <li key={job.id} className="border p-2 mb-2">
//             <div>カテゴリ: {job.category}</div>
//             <div>年収: {job.salary}万円</div>
//             <div>タイトル: {job.title}</div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/jobs');  // `/jobs` にリダイレクト
}

