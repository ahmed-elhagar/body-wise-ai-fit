
// Bundle optimization utilities
export const bundleOptimizer = {
  // Dynamically import heavy libraries only when needed
  loadChartLibrary: () => import('recharts'),
  loadDateLibrary: () => import('date-fns'),
  loadFormLibrary: () => import('react-hook-form'),
  
  // Code splitting helpers
  splitByRoute: (routeName: string) => {
    const routeLoaders = {
      dashboard: () => import('@/pages/Dashboard'),
      'meal-plan': () => import('@/pages/MealPlan'),
      exercise: () => import('@/pages/Exercise'),
      profile: () => import('@/pages/Profile'),
      admin: () => import('@/pages/Admin'),
      coach: () => import('@/pages/Coach')
    };
    
    return routeLoaders[routeName as keyof typeof routeLoaders];
  },
  
  // Feature-based splitting
  splitByFeature: (featureName: string) => {
    const featureLoaders = {
      'meal-planning': () => import('@/features/meal-plan'),
      'exercise-programs': () => import('@/features/exercise'),
      'food-tracking': () => import('@/features/food-tracker'),
      'goal-setting': () => import('@/features/goals')
    };
    
    return featureLoaders[featureName as keyof typeof featureLoaders];
  }
};

// Tree shaking helpers
export const optimizedImports = {
  // Import only needed date-fns functions
  formatDate: () => import('date-fns/format'),
  parseDate: () => import('date-fns/parse'),
  addDays: () => import('date-fns/addDays'),
  
  // Import specific lodash functions
  debounce: () => import('lodash/debounce'),
  throttle: () => import('lodash/throttle'),
  cloneDeep: () => import('lodash/cloneDeep')
};

// Resource optimization
export const resourceOptimizer = {
  // Compress images
  optimizeImage: (src: string, quality: number = 0.8) => {
    if ('createImageBitmap' in window) {
      return createImageBitmap(new Image(), {
        resizeQuality: 'high',
        resizeWidth: 400, // Max width
        resizeHeight: 300  // Max height
      });
    }
    return Promise.resolve(src);
  },
  
  // Lazy load images
  createLazyImageObserver: () => {
    if ('IntersectionObserver' in window) {
      return new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
          }
        });
      });
    }
    return null;
  }
};
