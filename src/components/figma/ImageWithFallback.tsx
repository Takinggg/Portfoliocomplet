import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

// Placeholder blur SVG (10x10 gray)
const BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjVmNWY1Ii8+PC9zdmc+'

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean; // Disable lazy loading for above-the-fold images
  blur?: boolean; // Enable blur placeholder effect
  sizes?: string; // Responsive sizes attribute
  quality?: number; // Image quality (not used here but kept for API compatibility)
}

/**
 * Convertit une requête de recherche Unsplash en URL d'image
 * Si src est déjà une URL, la retourne telle quelle
 */
function convertToUnsplashUrl(src: string): string {
  if (!src) return src
  
  // Si c'est déjà une URL valide, la retourner
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src
  }
  
  // Sinon, c'est une requête de recherche Unsplash, la convertir
  const query = encodeURIComponent(src)
  return `https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`
}

/**
 * Génère les variantes WebP/AVIF si l'URL est d'Unsplash
 * Sinon retourne l'URL d'origine
 */
function generateImageVariants(src: string, quality: number = 80) {
  if (!src) return { webp: '', avif: '', original: src }
  
  // Convertir d'abord en URL si c'est une requête de recherche
  const fullUrl = convertToUnsplashUrl(src)
  
  // Si c'est une image Unsplash, on peut ajouter des paramètres de format
  if (fullUrl.includes('unsplash.com') || fullUrl.includes('images.unsplash.com')) {
    const url = new URL(fullUrl)
    
    // WebP version
    const webpUrl = new URL(fullUrl)
    webpUrl.searchParams.set('fm', 'webp')
    webpUrl.searchParams.set('q', quality.toString())
    
    // AVIF version (Unsplash supporte AVIF)
    const avifUrl = new URL(fullUrl)
    avifUrl.searchParams.set('fm', 'avif')
    avifUrl.searchParams.set('q', quality.toString())
    
    return {
      avif: avifUrl.toString(),
      webp: webpUrl.toString(),
      original: fullUrl
    }
  }
  
  // Pour les autres URLs, on retourne juste l'original
  return { webp: '', avif: '', original: fullUrl }
}

/**
 * Génère le srcset pour des images responsive
 * Utile pour Unsplash qui supporte le redimensionnement
 */
function generateSrcSet(src: string, widths: number[] = [640, 750, 828, 1080, 1200, 1920]) {
  if (!src) return ''
  
  if (src.includes('unsplash.com') || src.includes('images.unsplash.com')) {
    return widths
      .map(width => {
        const url = new URL(src)
        url.searchParams.set('w', width.toString())
        url.searchParams.set('fit', 'max')
        return `${url.toString()} ${width}w`
      })
      .join(', ')
  }
  
  return ''
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const { 
    src, 
    alt, 
    style, 
    className, 
    priority = false, 
    loading, 
    blur = true, 
    sizes,
    quality = 80,
    ...rest 
  } = props

  // Default to lazy loading unless priority is set
  const loadingStrategy = priority ? 'eager' : (loading || 'lazy')
  
  // Generate image variants
  const variants = generateImageVariants(src || '', quality)
  const srcSet = generateSrcSet(src || '')
  
  // Sizes par défaut si non fourni
  const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src={ERROR_IMG_SRC} 
            alt="Error loading image" 
            {...rest} 
            data-original-url={src} 
          />
        </div>
      </div>
    )
  }

  return (
    <picture>
      {/* AVIF version (meilleure compression) */}
      {variants.avif && (
        <source 
          type="image/avif" 
          srcSet={variants.avif}
          sizes={defaultSizes}
        />
      )}
      
      {/* WebP version (bonne compression, bon support) */}
      {variants.webp && (
        <source 
          type="image/webp" 
          srcSet={variants.webp}
          sizes={defaultSizes}
        />
      )}
      
      {/* Image principale avec srcset responsive */}
      <img 
        src={variants.original} 
        srcSet={srcSet || undefined}
        sizes={srcSet ? defaultSizes : undefined}
        alt={alt} 
        className={`${className ?? ''} ${!isLoaded && blur ? 'blur-sm' : ''} transition-all duration-300`}
        style={{
          ...style,
          backgroundColor: !isLoaded && blur ? '#f5f5f5' : 'transparent',
        }}
        loading={loadingStrategy}
        decoding="async"
        {...rest} 
        onError={handleError}
        onLoad={handleLoad}
      />
    </picture>
  )
}
