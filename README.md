# WebStruct Dark — وب‌ساخت دارک

**WebStruct Dark** is a modern, open-source React template with a dark theme. This bilingual (Persian/English) template is built with React 19, TypeScript, Tailwind CSS, and includes beautiful GSAP animations, RTL/LTR support, and shadcn/ui components.

## Live Demo — دموی زنده

- **Dark Template**: https://maddixmhn-rhaegal.vercel.app
- **Blue Template**: https://maddixmhn-viserion.vercel.app

**وب‌ساخت دارک** یک قالب React مدرن و متن‌باز با تم دارک است. این قالب دو زبانه (فارسی/انگلیسی) با React 19، TypeScript، Tailwind CSS ساخته شده و شامل انیمیشن‌های GSAP، پشتیبانی از راست‌چین و چپ‌چین و کامپوننت‌های shadcn/ui می‌باشد.

---

## Features — ویژگی‌ها

- ⚛ **React 19** — Latest React with hooks and concurrent features
- 🦾 **TypeScript** — Full type safety and developer experience
- 🎨 **Tailwind CSS** — Utility-first styling with dark mode
- 🌓 **Dark/Light Mode** — Toggle between dark and light themes
- 🌐 **RTL/LTR Support** — Full bilingual Persian and English interface
- 🎞 **GSAP Animations** — Smooth scroll-triggered animations
- 🧩 **shadcn/ui** — Beautiful and accessible UI components
- 📱 **Responsive** — Mobile-first responsive design
- 📰 **RSS Feeds** — Built-in RSS news aggregator
- 🔓 **Open Source** — Free under the MIT license

---

## Quick Start — شروع سریع

```bash
# Clone the repository
git clone <repo-url>
cd jahannama

# Install dependencies — نصب وابستگی‌ها
npm install --legacy-peer-deps

# Start development server — اجرای سرور توسعه
npm run dev

# Build for production — ساخت نسخه نهایی
npm run build
```

---

## Deploy on Vercel — استقرار در Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Simply connect your Git repository or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

The `vercel.json` file is already configured for this project.

---

## Project Structure — ساختار پروژه

```
src/
├── components/       # Reusable components — کامپوننت‌های قابل استفاده
│   └── ui/           # shadcn/ui components
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and RSS
├── sections/         # Page sections — بخش‌های صفحه
└── types/            # TypeScript types
public/
└── images/           # Static assets
```

---

## Customization — شخصی‌سازی

Edit `tailwind.config.js` to customize colors, fonts, and theme. The primary and secondary colors are defined in `src/index.css` using CSS custom properties.

برای تغییر رنگ‌ها، فونت‌ها و تم، فایل `tailwind.config.js` را ویرایش کنید.

---

## License — مجوز

MIT License — free for personal and commercial use.

مجوز MIT — آزاد برای استفاده شخصی و تجاری.
