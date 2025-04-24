'use server'

import { readdirSync, readFileSync } from 'fs'
import { join } from 'node:path'
import matter from 'gray-matter'

export interface NewsItem {
  title: string
  date: string
  slug: string
  tags?: string[]
}

/**
 * 动态获取新闻列表
 * 通过读取content/news目录下的所有mdx文件
 * 并解析其中的frontmatter信息
 */
export async function getNews(): Promise<NewsItem[]> {
  try {
    const newsDir = join(process.cwd(), 'content/news')
    const files = readdirSync(newsDir)
    
    // 过滤出所有mdx文件并解析frontmatter
    const newsItems = files
      .filter(file => file.endsWith('.mdx'))
      .map(file => {
        const filePath = join(newsDir, file)
        const fileContent = readFileSync(filePath, 'utf8')
        const { data } = matter(fileContent)
        const slug = file.replace('.mdx', '')
        console.log('slug', slug)
        
        return {
          title: data.title || slug,
          date: data.date ? new Date(data.date).toISOString() : '',
          slug: slug,
          tags: data.tags || []
        }
      })
      
    // 按日期降序排序（最新的在前面）
    return newsItems.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  } catch (error) {
    console.error('获取新闻列表失败:', error)
    return [] // 出错时返回空数组
  }
}