# 🍜 Tisgumi Website

Website resmi untuk Tisgumi - platform manajemen restoran dan sistem pemesanan yang modern dan efisien.

## 📋 Deskripsi Project / Project Description

**Bahasa Indonesia:**
Tisgumi Website adalah platform web yang dibangun untuk mengelola operasional restoran secara digital. Website ini terdiri dari dua bagian utama: website publik untuk pelanggan dan panel admin untuk manajemen restoran. Fitur utama meliputi sistem pemesanan, manajemen produk, pengelolaan pelanggan, sistem pembayaran, dan pembuatan invoice otomatis.

**English:**
Tisgumi Website is a web platform built to manage restaurant operations digitally. The website consists of two main parts: a public website for customers and an admin panel for restaurant management. Key features include ordering system, product management, customer management, payment system, and automatic invoice generation.

## ✨ Fitur Utama / Key Features

### 🌐 Website Publik / Public Website

- **Hero Section** - Landing page yang menarik
- **About Us** - Informasi tentang restoran
- **Features** - Highlight layanan unggulan
- **Working Hours** - Jam operasional
- **Testimonials** - Ulasan pelanggan
- **Menu Section** - Tampilan menu restoran
- **Responsive Design** - Tampilan optimal di semua device

### 🔧 Panel Admin / Admin Panel

- **Dashboard** - Overview operasional restoran
- **Product Management** - Kelola produk dan kategori
- **Customer Management** - Database pelanggan
- **Order Management** - Sistem pemesanan
- **Pricing Management** - Manajemen harga produk
- **Admin Management** - Kelola user admin
- **Invoice Generation** - Pembuatan invoice otomatis
- **PDF Export** - Export data ke PDF

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.3.2** - React framework dengan App Router
- **React 19.0.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Database

- **Prisma** - ORM untuk database
- **PostgreSQL** - Database utama
- **Supabase** - Backend as a Service
- **Lucia Auth** - Authentication system
- **bcrypt** - Password hashing

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes
- **ts-node** - TypeScript execution

### Additional Libraries

- **@tanstack/react-table** - Data table component
- **@react-pdf/renderer** - PDF generation
- **date-fns** - Date manipulation
- **clsx** - Conditional CSS classes
- **class-variance-authority** - Component variants

## 📁 Struktur Project / Project Structure

```
tisgumi-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/           # Admin panel routes
│   │   ├── (auth)/            # Authentication routes
│   │   ├── api/               # API routes
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   ├── lib/                   # Utility libraries
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Helper functions
│   └── types/                 # TypeScript type definitions
├── prisma/                    # Database schema & migrations
├── public/                    # Static assets
└── package.json
```

## 🗄️ Database Schema

Project menggunakan PostgreSQL dengan schema yang mencakup:

- **Users** - Admin dan superadmin
- **Customers** - Data pelanggan
- **Categories** - Kategori produk
- **Products** - Produk restoran
- **Orders** - Pesanan pelanggan
- **OrderItems** - Item dalam pesanan
- **Invoices** - Invoice yang dihasilkan
- **CustomProductPricing** - Harga khusus per pelanggan

## 🔐 Authentication & Authorization

- **Lucia Auth** untuk sistem autentikasi
- **Role-based access control** (admin, superadmin)
- **Session management** dengan database
- **Secure password hashing** dengan bcrypt

## 📱 Responsive Design

Website dirancang responsif dengan Tailwind CSS untuk pengalaman optimal di:

- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Vercel (Recommended)

1. Connect repository ke Vercel
2. Set environment variables
3. Deploy otomatis

---

**Tisgumi Website** - Modern Restaurant Management System 🍜
