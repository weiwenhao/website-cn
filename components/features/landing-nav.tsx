"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function LandingNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>文档</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {/* <ListItem
                title="Get Started"
                href="/docs/get-started"
              >
              </ListItem> */}

              <ListItem
                title="Syntax"
                href="/docs/syntax"
              >
                语法文档
              </ListItem>

              <ListItem
                title="Std Library"
                href="/stds"
              >
                标准库文档
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs/contribute" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              贡献指南
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/news" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              新闻
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            项目列表
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem
                title="Dbdriver"
                href="https://github.com/weiwenhao/dbdriver"
                target="_blank"
                rel="noopener noreferrer"
              >
                mysql/postgresql/redis 驱动
              </ListItem>
              <ListItem
                title="Web Framework"
                href="https://github.com/weiwenhao/emoji-api"
                target="_blank"
                rel="noopener noreferrer"
              >
                虽然是 RESTful api example, 但可以作为 web framework 使用
              </ListItem>
              <ListItem
                title="Parker"
                href="https://github.com/weiwenhao/parker"
                target="_blank"
                rel="noopener noreferrer"
              >
                轻量打包工具
              </ListItem>
              <ListItem
                title="Llama.n"
                href="https://github.com/weiwenhao/llama.n"
                target="_blank"
                rel="noopener noreferrer"
              >
                Llama2 模型 nature 语言实现
              </ListItem>
              <ListItem
                title="Tetris Game"
                href="https://github.com/weiwenhao/tetris"
                target="_blank"
                rel="noopener noreferrer"
              >
                俄罗斯方块游戏，适用于 macOS
              </ListItem>
              <ListItem
                title="Playground Server"
                href="https://github.com/weiwenhao/playground"
                target="_blank"
                rel="noopener noreferrer"
              >
                Playground 服务端 API 实现
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/playground" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Playground
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
