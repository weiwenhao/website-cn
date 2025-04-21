import TableOfContents from '@/components/features/table-of-contents'

export default async function Page({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const { slug } = await params
    const { default: Post } = await import(`@/content/${slug}.mdx`)
   
    
    return (
      <div className="flex flex-col xl:flex-row max-w-7xl mx-auto px-4 py-8">
        <div className="flex-1 max-w-3xl mx-auto xl:mx-0">
          <Post />
        </div>
        <TableOfContents />
      </div>
    )
  }
   
  // export function generateStaticParams() {
  //   return [{ slug: 'welcome' }, { slug: 'about' }]
  // }
   
  // export const dynamicParams = false