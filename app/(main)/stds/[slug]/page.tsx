import TableOfContents from '@/components/features/table-of-contents'

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const { default: Post } = await import(`@/content/stds/${slug}.mdx`)

    return (
        <div className="flex flex-col xl:flex-row mx-auto">
            <div className="w-full min-w-0" >
                <Post />
            </div>
            <TableOfContents />
        </div>
    )
}

export async function generateStaticParams() {
    // 动态获取标准库列表
    const { getStdLibs } = await import('@/lib/get-stdlibs')
    const stdLibs = await getStdLibs()

    // 转换为Next.js需要的格式
    return stdLibs.map(lib => ({
        slug: lib.slug
    }))
}