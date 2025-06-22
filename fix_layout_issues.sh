#!/bin/bash

# Fix layout issues by removing Layout imports and wrappers from feature components
# These components are already wrapped in ProtectedLayout in the routing

echo "Fixing layout issues..."

# List of files to fix
files=(
  "src/features/pro/components/ProPage.tsx"
  "src/features/progress/components/WeightTracking.tsx"
  "src/features/progress/components/ProgressPage.tsx"
  "src/features/chat/components/ChatPage.tsx"
  "src/features/goals/components/GoalsPage.tsx"
  "src/features/admin/components/AdminPageMain.tsx"
  "src/features/food-tracker/components/CalorieChecker.tsx"
  "src/features/food-tracker/components/FoodTrackerPage.tsx"
  "src/features/profile/components/SettingsPage.tsx"
  "src/features/notifications/components/NotificationsPage.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Remove Layout import
    sed -i '' '/import Layout from/d' "$file"
    
    # Remove ProtectedRoute import if present
    sed -i '' '/import.*ProtectedRoute/d' "$file"
    
    # Simple pattern replacements for common Layout wrapper patterns
    sed -i '' 's/<Layout>//g' "$file"
    sed -i '' 's/<\/Layout>//g' "$file"
    sed -i '' 's/<ProtectedRoute[^>]*>//g' "$file"
    sed -i '' 's/<\/ProtectedRoute>//g' "$file"
    
    echo "Fixed $file"
  else
    echo "File not found: $file"
  fi
done

echo "Layout fixes completed!" 