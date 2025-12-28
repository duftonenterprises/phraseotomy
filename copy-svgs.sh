#!/bin/bash

# Script to copy SVG files from parent directory to public/themes
# Run this from the project root

echo "Copying SVG files to public/themes..."

# Create public/themes directory if it doesn't exist
mkdir -p public/themes

# Copy each theme folder
if [ -d "../at home" ]; then
  echo "Copying at home..."
  cp -r "../at home" "public/themes/at home"
fi

if [ -d "../at work" ]; then
  echo "Copying at work..."
  cp -r "../at work" "public/themes/at work"
fi

if [ -d "../lifestyle" ]; then
  echo "Copying lifestyle..."
  cp -r "../lifestyle" "public/themes/lifestyle"
fi

if [ -d "../travel" ]; then
  echo "Copying travel..."
  cp -r "../travel" "public/themes/travel"
fi

if [ -d "../horror" ]; then
  echo "Copying horror..."
  cp -r "../horror" "public/themes/horror"
fi

if [ -d "../adult" ]; then
  echo "Copying adult..."
  cp -r "../adult" "public/themes/adult"
fi

if [ -d "../fantasy" ]; then
  echo "Copying fantasy..."
  cp -r "../fantasy" "public/themes/fantasy"
fi

if [ -d "../sci-fi" ]; then
  echo "Copying sci-fi..."
  cp -r "../sci-fi" "public/themes/sci-fi"
fi

echo "Done! SVG files copied to public/themes"

