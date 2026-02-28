#!/bin/bash

API_URL="http://localhost:3000"

echo "========================================="
echo "Security Architect Training Platform"
echo "API Test Script"
echo "========================================="
echo ""

# Test 1: Health Check
echo "1. Health Check..."
curl -s $API_URL/health | jq .
echo ""

# Test 2: Create User
echo "2. Creating test user..."
USER_RESPONSE=$(curl -s -X POST $API_URL/api/auth/guest \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_user"}')
echo $USER_RESPONSE | jq .
USER_ID=$(echo $USER_RESPONSE | jq -r '.user.id')
echo "User ID: $USER_ID"
echo ""

# Test 3: Get lessons
echo "3. Fetching available lessons..."
curl -s "$API_URL/api/lessons?phase=0" | jq '.lessons[] | {id, title, phase_name, day_number}' | head -20
echo ""

# Test 4: Get today's lesson
echo "4. Getting today's lesson plan..."
curl -s "$API_URL/api/daily/today?userId=$USER_ID" | jq '.lesson | {title, difficulty, reading_time_min}'
echo ""

# Test 5: Get progress summary
echo "5. Checking initial progress..."
curl -s "$API_URL/api/progress/summary?userId=$USER_ID" | jq '.summary | {lessons_completed, quiz_average, readiness_level, streak_days}'
echo ""

echo "========================================="
echo "✅ API Test Complete!"
echo ""
echo "Your API is running at: $API_URL"
echo "User ID created: $USER_ID"
echo ""
echo "Try these commands:"
echo "  - List all lessons: curl $API_URL/api/lessons"
echo "  - Get progress: curl '$API_URL/api/progress/summary?userId=$USER_ID'"
echo "  - View incidents: curl '$API_URL/api/incidents'"
echo "========================================="

