# EduVault - Solved Question Paper & Study Material Marketplace

EduVault is a premium, client-side-first educational question paper and reference keys marketplace. It is built using **Next.js 16 (App Router)** and styled using the **Tailwind CSS v4** engine.

---

## 🌟 Core Features

- **🎓 Educational Taxonomy Map**: Custom Anna University / Madras University classifications mapping regulations, semesters, departments, and specific subject codes.
- **🛡️ Multi-Role Dashboard Workspaces**:
  - **Student**: Browse materials, unlock premium files using ad views countdown simulation, make purchases, check out carts, manage billing cycles, and submit custom requests.
  - **Dealer (Content Provider)**: Upload solved materials via a multi-step upload wizard, configure access controls, view revenue analytics, and request payouts.
  - **Main Admin**: Platform metrics analytics (GMV, net cuts), moderate dealer uploads side-by-side with watermarked PDF previews, adjust dealer commission splits, manage taxonomy nodes, and track audit logs.
- **⚡ Interactive Ad-Unlock Simulation**: Simulated 10-second count-down timer with daily quota checks.
- **📄 Blurred Watermarked PDF Viewer**: Simulated watermark overlays and custom preview page bounds.
- **🔌 Unified React State Context**: Bypasses any external database by reading/writing directly to browser `localStorage`. Exposes a global reset database button for easy test replication.

---

## 🚀 Getting Started

No external server or database setup is required. To run the sandbox, execute:

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔑 Demo Workspace Credentials

Use the quick-login role shortcuts on the login page, or manually log in with:

- **Admin Console**: `admin@eduvault.demo` / Password: `Admin@123`
- **Dealer Console**: `dealer@eduvault.demo` / Password: `Dealer@123`
- **Student Console**: `student@eduvault.demo` / Password: `Student@123`

---

## 🏗️ Architecture details

- **Persistent Layer**: `src/lib/storage.ts` coordinates all reads and writes to browser `localStorage`.
- **Global Context Provider**: `src/lib/context.tsx` handles business logic: cart calculations, payment distributions, taxonomy updates, and ticketing communication lists.
- **Design System**: Global custom colors declared via Tailwind v4 `@theme` directives in `src/app/globals.css`.

---

## 🛠️ Build and Compilation Checks

Validate Next.js build compilation and static page optimization with:

```bash
npm run build
```
