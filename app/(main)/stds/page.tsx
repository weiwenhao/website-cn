import { redirect } from 'next/navigation'
import { getStdLibsList } from '@/lib/stdlibs-config'


export default async function DefaultPage() {
  // 动态获取标准库列表并重定向到第一个标准库
  const stdLibs = getStdLibsList()
  const firstLib = stdLibs.length > 0 ? stdLibs[0].slug : 'co'
  
  redirect(`/stds/${firstLib}`)
}