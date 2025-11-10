"use client";

import { useState, useEffect } from "react";
import { getBanners } from "@/services/clientApi";
import Link from "next/link";

interface Banner {
  _id: string;
  name: string;
  image: string;
  link: string;
}

export default function Slider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const displayBanners = banners.length > 0 ? banners : [];

  useEffect(() => {
    if (displayBanners.length > 0 && isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % displayBanners.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [displayBanners.length, isAutoPlaying]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await getBanners();
      setBanners(response.data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displayBanners.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  if (loading) {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <div className="text-gray-600 font-medium">Loading banners...</div>
          </div>
        </div>
      </div>
    );
  }

  if (displayBanners.length === 0) {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Welcome to Our Store</h2>
            <p className="text-xl mb-6">Discover amazing products and deals</p>
            <Link href="/products" className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-2xl shadow-2xl transition-shadow duration-500">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {displayBanners.map((banner, index) => (
          <div
            key={banner._id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: index === currentSlide ? 1 : 0,
              zIndex: index === currentSlide ? 10 : 0,
              transition: 'opacity 1s ease-in-out'
            }}
          >
            <img
              src={banner.image || "/placeholder.svg"}
              alt={banner.name || "Banner"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-start px-6 md:px-12">
              <div 
                className="text-white max-w-lg"
                style={{
                  opacity: index === currentSlide ? 1 : 0,
                  transform: index === currentSlide ? 'translateY(0)' : 'translateY(1rem)',
                  transition: 'all 0.7s ease-in-out 0.2s'
                }}
              >
                <div className="inline-block bg-green-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-6 shadow-lg">
                  ✨ Featured Collection
                </div>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6 leading-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                  {banner.name || "Featured Product"}
                </h2>
                <p className="text-sm md:text-lg lg:text-xl mb-4 md:mb-8 text-gray-100 hidden sm:block" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                  Discover amazing deals and exclusive offers on our latest collection
                </p>
                <div className="flex gap-2 md:gap-4">
                  <Link 
                    href={banner.link || "/products"}
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 md:px-10 py-2 md:py-4 rounded-full text-sm md:text-base font-semibold transition-all duration-300 shadow-xl"
                  >
                    Shop Now
                  </Link>
                  <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-4 md:px-10 py-2 md:py-4 rounded-full text-sm md:text-base font-semibold transition-all duration-300 hidden sm:block">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-6 z-20 p-2 md:p-4 rounded-full shadow-2xl transition-all duration-300"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#1f2937'
        }}
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-6 z-20 p-2 md:p-4 rounded-full shadow-2xl transition-all duration-300"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#1f2937'
        }}
        aria-label="Next slide"
      >
        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Counter */}
      <div 
        className="absolute top-4 md:top-6 right-4 md:right-6 rounded-full px-3 md:px-6 py-2 md:py-3 shadow-lg z-20"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <div className="text-white text-xs md:text-sm font-semibold">
          {currentSlide + 1} / {displayBanners.length}
        </div>
      </div>

      {/* Slide Indicators */}
      <div 
        className="absolute bottom-4 md:bottom-6 z-20 flex gap-2 md:gap-4"
        style={{
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        {displayBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="rounded-full transition-all duration-300"
            style={{
              width: index === currentSlide ? '16px' : '12px',
              height: index === currentSlide ? '16px' : '12px',
              backgroundColor: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
              transform: index === currentSlide ? 'scale(1.25)' : 'scale(1)',
              boxShadow: index === currentSlide ? '0 4px 6px rgba(0,0,0,0.3)' : 'none'
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play Toggle */}
      <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 z-20">
        <button
          onClick={toggleAutoPlay}
          className="flex items-center gap-2 md:gap-3 text-xs md:text-sm rounded-full px-3 md:px-4 py-2 md:py-3 transition-all duration-300 shadow-lg"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255, 255, 255, 0.8)'
          }}
          aria-label={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
        >
          <div 
            className="rounded-full"
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: isAutoPlaying ? '#4ade80' : '#9ca3af',
              animation: isAutoPlaying ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
            }}
          ></div>
          <span className="font-medium hidden sm:inline">{isAutoPlaying ? 'Auto-play' : 'Paused'}</span>
        </button>
      </div>
    </div>
  );
}