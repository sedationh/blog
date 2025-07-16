'use client'

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import BackButton from "@/app/blog/[id]/BackButton";
import { siteConfig } from "@/config/site";

export default function Header() {
  const pathname = usePathname();

  // 判断是否在博客详情页
  const isBlogDetailPage = pathname?.startsWith('/blog/') && pathname !== '/blog';
  // 判断是否在首页
  const isHomePage = pathname === '/';

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 h-16">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧：头像和导航 */}
          <div className="flex items-center space-x-4">
            {/* 头像 */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/avatar.jpg"
                alt="SedationH Avatar"
                width={40}
                height={40}
                className="aspect-square rounded-full border border-slate-200 hover:border-slate-300 transition-colors"
                priority
              />
            </Link>

            {/* 根据页面显示不同的导航 */}
            {isBlogDetailPage && <BackButton />}
            {isHomePage && (
              <Link
                href="/"
                className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
              >
                {siteConfig.name}
              </Link>
            )}
          </div>

          {/* 右侧：GitHub 链接（仅在首页显示） */}
          {isHomePage && (
            <div className="flex items-center space-x-6">
              <Link
                href={siteConfig.github.url}
                target="_blank"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                GitHub
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 