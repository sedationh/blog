'use client'

import clsx from 'clsx'
import Image from 'next/image'
import type { FC } from 'react'
import React, { memo, useRef, useState } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

// 简单的懒加载组件
const LazyLoad: FC<{ 
  children: React.ReactNode
  offset?: number 
}> = ({ children, offset = 30 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: `${offset}px`,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [offset])

  return (
    <div ref={ref}>
      {isVisible ? children : <div className="h-48 bg-gray-100 animate-pulse rounded" />}
    </div>
  )
}

// 视频组件
const Video: FC<{
  src: string
  className?: string
  style?: React.CSSProperties
  playsInline?: boolean
  autoPlay?: boolean
}> = ({ src, className, style, playsInline, autoPlay }) => (
  <video
    src={src}
    className={clsx('max-w-full h-auto rounded-lg', className)}
    style={style}
    playsInline={playsInline}
    autoPlay={autoPlay}
    controls
    preload="metadata"
  />
)

// 分割线组件
const Divider: FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('border-t border-gray-300', className)} />
)

// 检查是否为视频文件
const isVideoExt = (ext: string): boolean => {
  const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'm4v']
  return videoExts.includes(ext.toLowerCase())
}

// 固定缩放图片组件
const FixedZoomedImage: FC<{
  src: string
  alt?: string
  containerWidth?: number
}> = ({ src, alt, containerWidth = 800 }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div className="my-4 text-center -mx-2 sm:mx-0">
      <PhotoView src={src}>
        <div className="relative inline-block cursor-pointer group max-w-full w-full">
          <Image
            src={src}
            alt={alt || "Image"}
            width={800}
            height={600}
            className={clsx(
              'w-full h-auto rounded-lg shadow-sm transition-all duration-200',
              'group-hover:shadow-md group-hover:scale-[1.02]',
              !imageLoaded && 'opacity-0',
              imageError && 'hidden'
            )}
            style={{ maxWidth: '100%' }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            unoptimized={src.startsWith('http')}
          />
          
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
          )}
          
          {imageError && (
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-gray-400 text-sm">
                <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>图片加载失败</p>
                <p className="text-xs mt-1">{src}</p>
              </div>
            </div>
          )}

        </div>
      </PhotoView>
      
      {/* 图片描述 */}
      {alt && alt !== "Image" && (
        <p className="mt-2 text-sm text-gray-600 italic text-center">
          {alt}
        </p>
      )}
    </div>
  )
}

export const MarkdownImage: FC<{ src: string; alt?: string }> = (props) => {
  const { src, alt } = props
  
  // 清理 alt 文本（移除可能的前缀）
  const cleanAlt = alt?.replace(/^[¡!]/, '')
  
  // 获取文件扩展名
  const ext = src.split('.').pop() || ''

  // 如果是视频文件
  if (isVideoExt(ext)) {
    return (
      <div className="flex flex-col items-center my-6 -mx-2 sm:mx-0">
        <LazyLoad>
          <Video
            src={src}
            className="fit w-full max-w-full"
            playsInline
            autoPlay={false}
          />
        </LazyLoad>

        {cleanAlt && (
          <div className="mt-4 flex flex-col items-center justify-center text-sm">
            <Divider className="w-20 opacity-80 mb-2" />
            <span className="text-gray-600 italic">{cleanAlt}</span>
          </div>
        )}
      </div>
    )
  }

  // 普通图片
  return (
    <LazyLoad>
      <FixedZoomedImage src={src} alt={cleanAlt} />
    </LazyLoad>
  )
}

// PhotoProvider 包装器组件
export const MarkdownImageProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PhotoProvider
      photoClosable
      maskOpacity={0.8}
      bannerVisible={false}
      loadingElement={
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      }
    >
      {children}
    </PhotoProvider>
  )
} 