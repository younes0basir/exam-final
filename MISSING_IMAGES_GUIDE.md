# 📸 Missing Images Guide - Quick Reference

## ⚠️ Required Images (5 Total)

Place all images in the `images/` folder with exact filenames.

---

## 1️⃣ architecture-systeme.png

**What:** System architecture diagram  
**Size:** ~800x600 pixels  
**Format:** PNG  

### Content to Include:
```
┌─────────────────────────────────────────┐
│         CLIENT LAYER (Frontend)         │
│  ┌──────────┐  ┌──────────┐            │
│  │  React   │  │   CLI    │            │
│  │  App     │  │  Tool    │            │
│  └────┬─────┘  └────┬─────┘            │
└───────┼──────────────┼──────────────────┘
        │              │
        │  HTTP/REST   │
        │  + JWT       │
        ▼              ▼
┌─────────────────────────────────────────┐
│       API LAYER (Backend)               │
│  ┌──────────────────────────────┐      │
│  │   Laravel 11 REST API        │      │
│  │  - Authentication (Sanctum)  │      │
│  │  - Business Logic            │      │
│  │  - Data Validation           │      │
│  └──────────────┬───────────────┘      │
└─────────────────┼──────────────────────┘
                  │
                  │  Eloquent ORM
                  │  SQL Queries
                  ▼
┌─────────────────────────────────────────┐
│      DATA LAYER (Database)              │
│  ┌──────────────────────────────┐      │
│  │   MySQL 8.0 Database         │      │
│  │  - 15 Tables                 │      │
│  │  - Relationships             │      │
│  │  - Indexes                   │      │
│  └──────────────────────────────┘      │
└─────────────────────────────────────────┘
```

### How to Create:
- **Tool:** draw.io (free, online)
- **URL:** https://app.diagrams.net
- **Template:** Use "Deployment" or "Network" template
- **Colors:** 
  - Frontend: Blue (#3B82F6)
  - Backend: Green (#10B981)
  - Database: Orange (#F59E0B)
- **Export:** File → Export as → PNG (scale 2x for quality)

---

## 2️⃣ admin-dashboard.png

**What:** Admin dashboard screenshot  
**Size:** Full HD (1920x1080) recommended  
**Format:** PNG  

### Steps to Capture:
1. Start backend: `cd backend && php artisan serve`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser: http://localhost:5173
4. Login with:
   - Email: `admin@upf.ma`
   - Password: `password`
5. Navigate to admin dashboard
6. Ensure charts and statistics are visible
7. Press `F11` for fullscreen
8. Take screenshot:
   - Windows: `Win + Shift + S` → Select area
   - Or use browser extension (GoFullPage)
9. Save as `images/admin-dashboard.png`

### What Should Be Visible:
- ✅ Dashboard title "Tableau de Bord"
- ✅ Stat cards (Students, Professors, Filières, Requests)
- ✅ At least one chart/graph
- ✅ Quick action buttons
- ✅ Navigation sidebar
- ✅ User profile/header

---

## 3️⃣ professor-dashboard.png

**What:** Professor dashboard screenshot  
**Size:** Full HD (1920x1080) recommended  
**Format:** PNG  

### Steps to Capture:
1. Logout from admin account
2. Login with:
   - Email: `l.benali@upf.ma`
   - Password: `password`
3. Navigate to professor dashboard
4. Ensure modules/courses are visible
5. Take screenshot (same method as above)
6. Save as `images/professor-dashboard.png`

### What Should Be Visible:
- ✅ Professor name/welcome message
- ✅ List of teaching modules
- ✅ Student lists or grade management section
- ✅ Navigation sidebar (professor-specific links)
- ✅ Any announcements or recent activity

---

## 4️⃣ student-dashboard.png

**What:** Student dashboard screenshot  
**Size:** Full HD (1920x1080) recommended  
**Format:** PNG  

### Steps to Capture:
1. Logout from professor account
2. Login with:
   - Email: `a.bennani2@student.upf.ma`
   - Password: `password`
3. Navigate to student dashboard
4. Ensure grades/timetable are visible
5. Take screenshot
6. Save as `images/student-dashboard.png`

### What Should Be Visible:
- ✅ Student name/welcome message
- ✅ Current grades or GPA
- ✅ Timetable/schedule view
- ✅ Recent announcements
- ✅ Navigation sidebar (student-specific links)
- ✅ Quick actions (view documents, submit requests)

---

## 5️⃣ tests-api.png

**What:** API testing screenshot (Postman or Browser DevTools)  
**Size:** ~1200x800 pixels  
**Format:** PNG  

### Option A: Using Postman (Recommended)
1. Download Postman: https://www.postman.com
2. Create new request:
   - Method: `GET`
   - URL: `http://localhost:8000/api/admin/stats`
   - Headers: 
     - `Authorization: Bearer YOUR_TOKEN`
     - `Accept: application/json`
3. Send request
4. Ensure response shows:
   - Status: `200 OK`
   - JSON body with statistics
5. Take screenshot showing both request and response
6. Save as `images/tests-api.png`

### Option B: Using Browser DevTools
1. Login to application
2. Open DevTools (`F12`)
3. Go to "Network" tab
4. Perform an action (e.g., load dashboard)
5. Find API request in network list
6. Click on it to see details
7. Screenshot showing:
   - Request URL
   - Status code (200)
   - Response JSON (formatted)
8. Save as `images/tests-api.png`

### What Should Be Visible:
- ✅ Request method (GET/POST)
- ✅ Endpoint URL
- ✅ Status code: 200 OK
- ✅ Response headers (Content-Type: application/json)
- ✅ Response body (JSON data)
- ✅ Response time (< 200ms ideal)

---

## 🎨 Image Quality Tips

### General Guidelines:
- **Resolution:** Minimum 150 DPI for print quality
- **Format:** PNG (lossless compression)
- **File Size:** Keep under 2MB each
- **Naming:** Exact filenames as specified (case-sensitive)

### For Screenshots:
- Use **fullscreen mode** (F11) to hide browser chrome
- Ensure **good contrast** (dark text on light background)
- **Crop** unnecessary parts (browser tabs, taskbar)
- Check that text is **readable** when printed
- Avoid **blurry** or pixelated images

### For Diagrams:
- Use **consistent colors** throughout
- Keep text **large enough** to read (min 12pt)
- Use **professional fonts** (Arial, Helvetica)
- Add **legend** if using multiple colors
- Export at **2x scale** for crisp edges

---

## 📁 Folder Structure Verification

After adding all images, your structure should be:

```
exam final/
├── images/
│   ├── logo-upf.jpg              ✅ Already there
│   ├── usecase-diagram.png       ✅ Already there
│   ├── class-diagram.png         ✅ Already there
│   ├── sequence-diagram.png      ✅ Already there
│   ├── architecture-systeme.png  ⬅️ ADD THIS
│   ├── admin-dashboard.png       ⬅️ ADD THIS
│   ├── professor-dashboard.png   ⬅️ ADD THIS
│   ├── student-dashboard.png     ⬅️ ADD THIS
│   └── tests-api.png             ⬅️ ADD THIS
├── rapport.tex                   ✅ Updated
└── ... (other files)
```

---

## ✅ Verification Checklist

Before compiling LaTeX:

- [ ] All 5 new images created
- [ ] All images in `images/` folder
- [ ] Filenames match exactly (case-sensitive)
- [ ] Images open correctly (not corrupted)
- [ ] Text in screenshots is readable
- [ ] Diagram has professional appearance
- [ ] File sizes reasonable (< 2MB each)

---

## 🔧 Quick Creation Tools

### Free Online Tools:
1. **draw.io** - Architecture diagrams
   - https://app.diagrams.net
   - No signup required
   - Export as PNG

2. **Canva** - Professional diagrams
   - https://canva.com
   - Free templates available

3. **Screenshot tools:**
   - Windows: Built-in Snipping Tool (`Win + Shift + S`)
   - Browser: GoFullPage extension
   - Online: https://screenshot.guru

### Paid Tools (Optional):
- **Lucidchart** - Professional diagrams ($7.95/mo)
- **Snagit** - Advanced screenshots ($62.99 one-time)
- **Adobe XD** - UI mockups ($9.99/mo)

---

## ⏱️ Time Estimate

| Task | Time |
|------|------|
| Create architecture diagram | 15-20 min |
| Capture admin dashboard | 5 min |
| Capture professor dashboard | 5 min |
| Capture student dashboard | 5 min |
| Capture API test | 10 min |
| **Total** | **~40 minutes** |

---

## 🆘 Troubleshooting

### Problem: Images don't appear in PDF
**Solution:**
- Check filename spelling (case-sensitive!)
- Verify images are in `images/` folder
- Try compiling LaTeX twice
- Check image format (PNG/JPG only)

### Problem: Images too small/large
**Solution:**
- Adjust `\includegraphics[width=...]` in LaTeX
- Recommended: 0.9\textwidth for full-page, 0.5\textwidth for half-page

### Problem: Blurry images
**Solution:**
- Use PNG format (not JPG for diagrams)
- Export at higher resolution (2x scale)
- Avoid resizing in LaTeX (resize source image instead)

### Problem: Text unreadable in screenshots
**Solution:**
- Increase browser zoom before screenshot (125-150%)
- Use high-DPI display if available
- Crop to show only essential content

---

## 📞 Need Help?

If you're stuck creating the architecture diagram, I can:
1. Generate a PlantUML code snippet you can render online
2. Create a simple ASCII diagram you can trace
3. Provide a draw.io XML template

Just let me know! 😊

---

**Next Step:** Create these 5 images, then compile your LaTeX file to PDF! 🎓✨
