# TODO.md
## InteriorPro – Interior Design & Renovation Cost Estimation Web App

This document breaks down all product features into actionable development tasks
based on the PRD, Tech Stack, and Project Description.

---

## PHASE 0 – PROJECT SETUP & FOUNDATION

### 0.1 Repository & Tooling
- [ ] Create GitHub repository
- [ ] Add README.md
- [ ] Add TECH_STACK.md
- [ ] Add TODO.md
- [ ] Configure ESLint + Prettier
- [ ] Setup environment variables (.env)

### 0.2 Frontend Setup
- [ ] Initialize Next.js (TypeScript)
- [ ] Install Tailwind CSS
- [ ] Setup ShadCN UI
- [ ] Configure absolute imports
- [ ] Setup basic layout (Header / Footer)

### 0.3 Backend Setup
- [ ] Initialize Node.js + Express
- [ ] Configure TypeScript
- [ ] Setup folder structure (controllers, services, routes)
- [ ] Setup CORS & security middleware
- [ ] Create health-check API

### 0.4 Database Setup
- [ ] Setup PostgreSQL (Neon)
- [ ] Install Prisma ORM
- [ ] Initialize Prisma schema
- [ ] Setup migrations
- [ ] Seed initial data

---

## PHASE 1 – CORE DOMAIN MODELS

### 1.1 User & Roles
- [ ] Create User model
- [ ] Add role field (ADMIN, SALES)
- [ ] Integrate NextAuth.js
- [ ] Protect admin routes
- [ ] Session handling

### 1.2 Property & Project Models
- [ ] PropertyType model (Residential, Commercial, Office)
- [ ] ProjectType model (New, Renovation)
- [ ] Area & room configuration

### 1.3 Package Models
- [ ] Package model (Basic, Standard, Premium)
- [ ] Package pricing per sq.ft
- [ ] Package description & inclusions
- [ ] Admin-configurable package data

---

## PHASE 2 – FURNITURE & RENOVATION MODULES

### 2.1 Furniture Module
- [ ] FurnitureCategory model
- [ ] FurnitureItem model
- [ ] Pricing per unit / sq.ft
- [ ] Package compatibility rules
- [ ] Ready-made furniture flag
- [ ] Furniture image support (Cloudinary)

### 2.2 Renovation Module
- [ ] RenovationType model (Partial / Full)
- [ ] RenovationOptions model:
  - Flooring
  - Painting
  - Electrical
  - Plumbing
  - Ceiling
- [ ] Pricing rules for renovation
- [ ] Enable/disable per project type

---

## PHASE 3 – COST ESTIMATION ENGINE

### 3.1 Pricing Logic
- [ ] Implement base area × package rate logic
- [ ] Add furniture cost aggregation
- [ ] Add renovation cost aggregation
- [ ] Apply location multiplier
- [ ] Final cost calculation service

### 3.2 Location-Based Pricing
- [ ] Location model (City)
- [ ] Cost multiplier per city
- [ ] Admin controls for multipliers

### 3.3 Timeline Estimation
- [ ] Define timeline rules per package
- [ ] Calculate estimated duration
- [ ] Display weeks/months in UI

---

## PHASE 4 – ESTIMATION WIZARD (FRONTEND)

### 4.1 Wizard Flow
- [ ] Step 1: Property type selection
- [ ] Step 2: New / Renovation selection
- [ ] Step 3: Area & room inputs
- [ ] Step 4: Package selection
- [ ] Step 5: Furniture selection
- [ ] Step 6: Renovation options
- [ ] Step 7: Review & estimate

### 4.2 UX Enhancements
- [ ] Progress indicator
- [ ] Validation at each step
- [ ] Real-time price updates
- [ ] Mobile responsiveness

---

## PHASE 5 – COST BREAKDOWN & OUTPUT

### 5.1 Cost Breakdown UI
- [ ] Item-wise pricing table
- [ ] Editable selections
- [ ] Highlight package inclusions
- [ ] Show timeline estimate

### 5.2 PDF Generation
- [ ] Design quotation PDF template
- [ ] Generate PDF using backend
- [ ] Include branding & disclaimer
- [ ] Download PDF functionality
- [ ] Optional PDF storage

---

## PHASE 6 – ADMIN PANEL

### 6.1 Admin Dashboard
- [ ] Admin login
- [ ] Role-based access
- [ ] Dashboard overview metrics

### 6.2 Pricing Management
- [ ] CRUD packages
- [ ] Update per sq.ft rates
- [ ] Furniture pricing controls
- [ ] Renovation pricing controls
- [ ] Location multipliers management

### 6.3 Lead Management
- [ ] Save estimates as leads
- [ ] View all leads
- [ ] Export leads (CSV / PDF)

---

## PHASE 7 – LANDING PAGES & SEO

### 7.1 Marketing Pages
- [ ] Home page
- [ ] Package comparison page
- [ ] How it works page
- [ ] Contact / consultation page

### 7.2 SEO Optimization
- [ ] Meta tags
- [ ] OpenGraph tags
- [ ] Sitemap
- [ ] Page speed optimization

---

## PHASE 8 – ANALYTICS & MONITORING

- [ ] Integrate Google Analytics
- [ ] Setup Sentry for error tracking
- [ ] Track estimation completion events
- [ ] Track lead conversions

---

## PHASE 9 – DEPLOYMENT & RELEASE

### 9.1 Deployment
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Render/Railway
- [ ] Setup environment variables
- [ ] Configure CI/CD

### 9.2 Testing
- [ ] Unit tests for pricing engine
- [ ] API testing
- [ ] Manual UI testing
- [ ] Cross-device testing

---

## PHASE 10 – FUTURE ENHANCEMENTS (POST-MVP)

- [ ] EMI calculator
- [ ] AI package recommendations
- [ ] Vendor marketplace
- [ ] AR / 3D interior previews
- [ ] Mobile app (React Native)

---

## STATUS LEGEND
- ⏳ Pending
- 🔄 In Progress
- ✅ Completed

---

## NOTE
All prices are estimates only and must include a disclaimer
stating that final costs may vary based on site conditions and material availability.

---
