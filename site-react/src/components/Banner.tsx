//@ts-ignore
import React, { useEffect, useRef, useState } from 'react'

// ✅ IMPORT DAS IMAGENS DESKTOP
import bannerVisionDesktop from '../assets/banners/vision3x1.jpg'
import banner1GbDesktop from '../assets/banners/1gb3x1.jpg'
import bannerFullDesktop from '../assets/banners/full3x1.jpg'
import bannerServerDesktop from '../assets/banners/server3x1.jpg'

// ✅ IMPORT DAS IMAGENS MOBILE
import bannerVisionMobile from '../assets/banners/vision2x1.png'
import bannerFullMobile from '../assets/banners/full2x1.png'
import bannerPromoMobile from '../assets/banners/promo2x1.png'
import bannerServerMobile from '../assets/banners/server2x1.png'

export default function Banner() {
  const bannerRef = useRef<HTMLDivElement | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)//@ts-ignore
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  const desktopImages = [
    bannerVisionDesktop,
    banner1GbDesktop,
    bannerFullDesktop,
    bannerServerDesktop,
  ]
  const mobileImages = [
    bannerVisionMobile,
    bannerFullMobile,
    bannerPromoMobile,
    bannerServerMobile,
  ]

  const getSlides = () => {
    const banner = bannerRef.current
    if (!banner) return []
    return Array.from(
      banner.querySelectorAll(`img.${isMobile ? 'mobile' : 'desktop'}`)
    ) as HTMLImageElement[]
  }

  const showSlide = (index: number) => {
    const slides = getSlides()
    slides.forEach((img, i) => {
      img.style.display = i === index ? 'block' : 'none'
    })
    setCurrentIndex(index)
  }

  const nextSlide = () => {
    const slides = getSlides()
    const nextIndex = (currentIndex + 1) % slides.length
    showSlide(nextIndex)
  }

  const prevSlide = () => {
    const slides = getSlides()
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length
    showSlide(prevIndex)
  }

  const createInterval = () => {
    clearExistingInterval()
    const id = setInterval(() => {
      nextSlide()
    }, 6000)
    setIntervalId(id)
  }

  const clearExistingInterval = () => {
    if (intervalId) clearInterval(intervalId)
  }

  const handleDotClick = (index: number) => {
    showSlide(index)
    createInterval()
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    showSlide(0)
    createInterval()

    const banner = bannerRef.current
    if (!banner) return

    let startX = 0
    let isDragging = false

    const touchStart = (e: TouchEvent) => {
      isDragging = true
      startX = e.touches[0].clientX
    }

    const touchMove = (e: TouchEvent) => {
      if (!isDragging) return
      const diffX = e.touches[0].clientX - startX
      if (Math.abs(diffX) > 50) {
        isDragging = false
        diffX > 0 ? prevSlide() : nextSlide()
        createInterval()
      }
    }

    const touchEnd = () => {
      isDragging = false
    }

    banner.addEventListener('touchstart', touchStart)
    banner.addEventListener('touchmove', touchMove)
    banner.addEventListener('touchend', touchEnd)

    return () => {
      banner.removeEventListener('touchstart', touchStart)
      banner.removeEventListener('touchmove', touchMove)
      banner.removeEventListener('touchend', touchEnd)
    }
  }, [isMobile])

  const imagesToRender = isMobile ? mobileImages : desktopImages
  const total = imagesToRender.length

  return (
    <>
      <style>
        {`
          .banner-wrapper {
            width: 100%;
            display: flex;
            justify-content: center;
            padding: 20px 0;
            background-color: #1d1d1b;
          }
          .banner {
            position: relative;
            width: 95%;
            border-left: 8px solid #1d1d1b;
            border-right: 8px solid #1d1d1b;
            border-radius: 16px;
            overflow: hidden;
            background-color: #1d1d1b;
            touch-action: pan-y;
          }
          .banner img {
            display: none;
            width: 100%;
            height: auto;
            border-radius: 16px;
            user-select: none;
            -webkit-user-drag: none;
          }
          .dots-container {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            z-index: 20;
          }
          .dot {
            width: 10px;
            height: 10px;
            background-color: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .dot.active {
            background-color: #fbcc0a;
          }
          @media (max-width: 600px) {
            .banner {
              width: 100%;
              border-left: 1px solid #1d1d1b;
              border-right: 1px solid #1d1d1b;
              border-radius: 12px;
            }
            .banner img {
              border-radius: 1px;
            }
          }
        `}
      </style>

      <div className="banner-wrapper">
        <div className="banner" ref={bannerRef}>
          {imagesToRender.map((src, i) => (
            <img
              key={i}
              src={src}
              className={isMobile ? 'mobile' : 'desktop'}
              alt={`Banner ${i + 1}`}
            />
          ))}
          <div className="dots-container">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`dot ${i === currentIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
