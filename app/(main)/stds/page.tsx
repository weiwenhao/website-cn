import { redirect } from 'next/navigation'
import { getStdLibs } from '@/lib/get-stdlibs'

export default async function DefaultPage() {
  // 动态获取标准库列表并重定向到第一个标准库
  const stdLibs = await getStdLibs()
  const firstLib = stdLibs.length > 0 ? stdLibs[0].slug : 'co'
  
  redirect(`/stds/${firstLib}`)
}