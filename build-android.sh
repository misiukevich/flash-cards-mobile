#!/bin/bash

echo "Building Android APK..."

# Clean previous builds
cd android
./gradlew clean

# Build release APK
./gradlew assembleRelease

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ APK built successfully!"
    echo "📱 APK location: android/app/build/outputs/apk/release/app-release.apk"
    echo "📦 AAB location: android/app/build/outputs/bundle/release/app-release.aab"
else
    echo "❌ Build failed!"
    exit 1
fi

cd ..
