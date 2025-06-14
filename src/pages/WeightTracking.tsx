
import { lazy } from 'react';

// Simple lazy wrapper for weight tracking page
const WeightTrackingPage = lazy(() => import('@/pages/WeightTracking'));

export default WeightTrackingPage;
