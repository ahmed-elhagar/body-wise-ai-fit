
# Component Patterns

## Cards
```tsx
// Standard Card
<Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  {/* Content */}
</Card>

// Elevated Card
<Card className="bg-white rounded-2xl shadow-lg border-0 p-6">
  {/* Content */}
</Card>
```

## Buttons
```tsx
// Primary Button
<Button className="bg-fitness-primary-500 hover:bg-fitness-primary-600 text-white">
  Primary Action
</Button>

// Secondary Button
<Button variant="outline" className="border-fitness-primary-500 text-fitness-primary-500">
  Secondary Action
</Button>
```

## Layout Patterns
```tsx
// Page Container
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
  {/* Page content */}
</div>

// Content Wrapper
<div className="max-w-7xl mx-auto px-6 py-8">
  {/* Content */}
</div>
```

## Meal Plan Specific
```tsx
// Meal Card
<Card className="meal-card hover:shadow-lg transition-all duration-200">
  {/* Meal content */}
</Card>

// Progress Ring
<div className="w-16 h-16 relative">
  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
    {/* Progress circle */}
  </svg>
</div>
```
