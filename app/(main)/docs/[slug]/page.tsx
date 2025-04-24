import TableOfContents from '@/components/features/table-of-contents'

export default async function Page({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const { slug } = await params
    const { default: Post } = await import(`@/content/${slug}.mdx`)
   
    
    return (
      <div className="flex flex-col xl:flex-row mx-auto">
        <div className="w-full min-w-0">
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