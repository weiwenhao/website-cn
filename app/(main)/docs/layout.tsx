"use client"

export default function MdxLayout({ children }: { children: React.ReactNode }) {
    // Create any shared layout or styles here
    return (
        <div className="prose max-w-3xl mx-auto px-4 py-8">
            {children}
        </div>
    )
}
