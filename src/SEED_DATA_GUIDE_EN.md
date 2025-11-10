# 🌱 Test Data Seeding Guide

Quick guide to create bilingual test projects in your Supabase database.

---

## 🚀 Quick Start

### Access the Seed Data Page

Visit: `http://localhost:5173/en/seed-data` or `http://localhost:5173/fr/seed-data`

### Get Your Access Token

1. Login to Dashboard: `http://localhost:5173/login`
2. Open browser console (F12) and run:
   ```javascript
   const { data } = await supabase.auth.getSession()
   console.log(data.session.access_token)
   ```
3. Copy the token and paste it in the "Access Token" field

### Create Test Projects

1. Paste your access token
2. Click "Create test projects"
3. Wait for the seeding to complete
4. View your projects at `/en/projects` or in the Dashboard

---

## 📦 What Gets Created

**6 professional bilingual projects:**

1. **Modern E-commerce Platform** 🛒 - Web, React/Node.js, €35k
2. **Fitness Mobile App** 📱 - Mobile, React Native/AI, €48k
3. **SaaS Analytics Dashboard** 📊 - Web, Kubernetes, €62k
4. **Corporate Website** 🏢 - Design, Next.js/SEO, €22k
5. **RESTful API Platform** 🔌 - Consulting, Microservices, €75k
6. **UI/UX Design System** 🎨 - Design, Storybook, €38k

Each project includes:
- ✅ Complete bilingual content (FR/EN)
- ✅ Images, technologies, testimonials
- ✅ Budget, timeline, status
- ✅ Challenges, solutions, results

---

## 🗑️ Delete Test Data

⚠️ **Warning:** This deletes ALL projects, not just test projects!

1. Click "Delete all projects"
2. Confirm in the popup
3. Projects are deleted one by one

---

## 🔧 Customization

Edit `/utils/seedTestProjects.ts` to add/modify projects.

Project structure:
```typescript
{
  name_fr: "French name",
  name_en: "English name",
  description_fr: "...",
  description_en: "...",
  category_fr: "web",
  category_en: "web",
  status: "completed",
  budget: 35000,
  startDate: "2024-01-15",
  technologies: ["React", "Node.js"],
  // ... more fields
}
```

---

## 🐛 Troubleshooting

**"Access token required"**
→ Login and copy your token from console

**"Server unavailable"**
→ Check Supabase server is running
→ Click "Reconnect"

**"Unauthorized"**
→ Your token expired, login again

**Projects don't appear**
→ Refresh the page
→ Check browser console for errors

---

## 📚 Related Docs

- Main README: `/README.md`
- Database Example: `/EXAMPLE_DATABASE_BILINGUAL_EN.md`
- Quick Start: `/QUICK_START_EXAMPLE.md`

---

## ✅ Production Checklist

Before going live:

- [ ] Delete all test projects
- [ ] Create real projects in Dashboard
- [ ] Replace Unsplash images with your own
- [ ] Test all links work
- [ ] Verify FR/EN display
- [ ] Remove or protect `/seed-data` route

---

Ready to create your test projects! 🚀

For questions: check the documentation or browser console.
