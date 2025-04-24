'use server'

import { readdirSync } from 'fs'
import { join } from 'node:path'

export interface StdLib {
  name: string
  slug: string
}

/**
 * 动态获取标准库列表
 * 通过读取content/stds目录下的所有mdx文件
 */
export async function getStdLibs(): Promise<StdLib[]> {
  try {
    const stdLibsDir = join(process.cwd(), 'content/stds')
    const files = readdirSync(stdLibsDir)
    
    // 过滤出所有mdx文件并转换为标准库对象
    return files
      .filter(file => file.endsWith('.mdx'))
      .map(file => {
        const slug = file.replace('.mdx', '')
        return {
          name: slug,
          slug: slug
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name)) // 按名称字母顺序排序
  } catch (error) {
    console.error('get std fils faild:', error)
    return [] // 出错时返回空数组
  }
}