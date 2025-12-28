# GitHub Backup Setup

## Quick Setup (if git is installed):

```bash
cd "/Users/robertdufton/Documents/phraseotomy/local play app"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Phraseotomy local play app"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/duftonenterprises/phraseotomy.git

# Push to GitHub
git push -u origin main
```

## If you need to create the GitHub repo first:

1. Go to https://github.com/duftonenterprises/phraseotomy
2. If the repo is empty, GitHub will show you commands to push
3. Or create a new repo if needed

## What to include in .gitignore:

The `.gitignore` file should already exclude:
- `node_modules/`
- `dist/`
- `.DS_Store`
- `*.log`

## Note:
- Don't commit the `public/themes/` folder if it's large (SVG files)
- Or commit it if you want it backed up
- The source code and config files are the most important

