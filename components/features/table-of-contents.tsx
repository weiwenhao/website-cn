'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TOCItem {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('h2'))
      .filter((element) => element.id)
      .map((element) => ({
        id: element.id,
        text: element.textContent || '',
        level: parseInt(element.tagName.substring(1), 10)
      }))
    setHeadings(elements)

    const handleScroll = () => {
      const headingElements = Array.from(document.querySelectorAll('h2'))
        .filter((element) => element.id)
      const visibleHeadings = headingElements.filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.top >= 0 && rect.top <= window.innerHeight / 2
      })
      if (visibleHeadings.length > 0) {
        setActiveId(visibleHeadings[0].id)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (headings.length === 0) return null

  return (
    <div className="hidden xl:block xl:w-64 xl:flex-shrink-0">
      <div className="sticky top-16 h-[calc(100vh-4rem)] w-full py-0 px-8 overflow-y-auto">
        <div className="text-md font-medium mb-4 pl-3">On this page</div>
        <nav className="text-sm">
          <ul className="space-y-2 list-none pl-0">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    'block text-muted-foreground hover:text-foreground py-1 px-2 no-underline transition-colors',
                    activeId === heading.id ? 'text-foreground font-bold' : ''
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector(`#${heading.id}`)?.scrollIntoView({
                      behavior: 'smooth'
                    })
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}