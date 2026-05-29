# 🚀 How to Update & Publish UPF CLI to npm

## Quick Start

```bash
cd frontend-cli

# Run interactive update script
npm run update-npm
```

---

## What It Does

The `update-npm` script automates the entire publish workflow:

1. ✅ Checks git status
2. ✅ Commits your changes
3. ✅ Bumps version (patch/minor/major)
4. ✅ Publishes to npm
5. ✅ Pushes to GitHub

---

## Example Usage

```bash
# Navigate to CLI directory
cd "c:\Users\basir\Documents\upf\PHP\exam final\frontend-cli"

# Run the script
npm run update-npm
```

You'll be prompted:

```
📦 Package: @basir97/upf-cli
📌 Current Version: 0.7.1

❓ Do you have uncommitted changes? (y/n): y
📝 Enter commit message: fix: correct professor sessions route

📋 Choose version bump type:
   1) Patch (bug fixes):     0.7.1 → 0.7.2
   2) Minor (new features):  0.7.1 → 0.8.0
   3) Major (breaking):      0.7.1 → 1.0.0
   4) Custom version

👉 Select option (1-4): 1

❓ Ready to publish @basir97/upf-cli@0.7.2 to npm? (y/n): y
❓ Push changes to GitHub? (y/n): y

✅ Update Complete!
```

---

## Manual Alternative

If you prefer manual control:

```bash
# 1. Commit changes
git add .
git commit -m "fix: your fix description"

# 2. Bump version
npm version patch    # or minor, or major

# 3. Publish
npm publish --access public

# 4. Push to GitHub
git push origin main
```

---

## Verify Publication

```bash
# Check on npm
npm view @basir97/upf-cli

# Test installation (in NEW terminal)
npm install -g @basir97/upf-cli
upf --version
```

---

## More Details

See [NPM_UPDATE_GUIDE.md](./NPM_UPDATE_GUIDE.md) for complete documentation.
