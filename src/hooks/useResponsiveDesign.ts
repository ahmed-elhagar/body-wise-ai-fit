
import { useState, useEffect } from 'react';
import { designSystem } from '@/utils/designSystem';

// Hook for responsive breakpoint detection
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('sm');
  const [isMobile, setIsMobile] = useState(true);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= 1536) {
        setBreakpoint('2xl');
        setIsDesktop(true);
        setIsTablet(false);
        setIsMobile(false);
      } else if (width >= 1280) {
        setBreakpoint('xl');
        setIsDesktop(true);
        setIsTablet(false);
        setIsMobile(false);
      } else if (width >= 1024) {
        setBreakpoint('lg');
        setIsDesktop(true);
        setIsTablet(false);
        setIsMobile(false);
      } else if (width >= 768) {
        setBreakpoint('md');
        setIsDesktop(false);
        setIsTablet(true);
        setIsMobile(false);
      } else {
        setBreakpoint('sm');
        setIsDesktop(false);
        setIsTablet(false);
        setIsMobile(true);
      }
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    // Utility functions
    gtSm: breakpoint !== 'sm',
    gtMd: ['lg', 'xl', '2xl'].includes(breakpoint),
    gtLg: ['xl', '2xl'].includes(breakpoint),
  };
};

// Hook for responsive grid columns
export const useResponsiveGrid = (config: {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}) => {
  const { breakpoint } = useBreakpoint();
  
  const getColumns = () => {
    switch (breakpoint) {
      case '2xl':
      case 'xl':
        return config.xl || config.lg || config.md || config.sm || 1;
      case 'lg':
        return config.lg || config.md || config.sm || 1;
      case 'md':
        return config.md || config.sm || 1;
      case 'sm':
      default:
        return config.sm || 1;
    }
  };

  return {
    columns: getColumns(),
    gridClass: `grid-cols-${getColumns()}`,
  };
};

// Hook for responsive spacing
export const useResponsiveSpacing = () => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  
  return {
    padding: isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8',
    margin: isMobile ? 'm-4' : isTablet ? 'm-6' : 'm-8',
    gap: isMobile ? 'gap-4' : isTablet ? 'gap-6' : 'gap-8',
    
    // Semantic spacing
    containerPadding: isMobile ? 'px-4' : isTablet ? 'px-6' : 'px-8',
    sectionPadding: isMobile ? 'py-8' : isTablet ? 'py-12' : 'py-16',
    cardPadding: isMobile ? 'p-4' : 'p-6',
  };
};

// Hook for responsive typography
export const useResponsiveTypography = () => {
  const { isMobile, isTablet } = useBreakpoint();
  
  return {
    heading: {
      h1: isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl',
      h2: isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl',
      h3: isMobile ? 'text-lg' : 'text-xl',
      h4: isMobile ? 'text-base' : 'text-lg',
    },
    body: {
      large: isMobile ? 'text-base' : 'text-lg',
      normal: 'text-base',
      small: 'text-sm',
    }
  };
};
