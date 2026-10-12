import os
import json

root = r"g:\projects\AI-POWERED DIGITAL TWIN FOR CYBER ATTACK SIMULATION\frontend"
os.makedirs(root, exist_ok=True)

files = {}

files["package.json"] = """{
  "name": "cybertwin-ai-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.27.0",
    "@xyflow/react": "^12.3.2",
    "recharts": "^2.13.3",
    "lucide-react": "^0.462.0",
    "zustand": "^5.0.1",
    "axios": "^1.7.7",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3",
    "vite": "^5.4.10"
  }
}"""

files["vite.config.ts"] = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})"""

files["tailwind.config.ts"] = """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: { DEFAULT: '#0a0e1a', surface: '#0f1629', elevated: '#1a2035' },
        border: { DEFAULT: '#1e293b', light: '#2d3748' },
        accent: { DEFAULT: '#3b82f6', glow: '#60a5fa' },
        danger: { DEFAULT: '#ef4444', glow: '#f87171' },
        warning: { DEFAULT: '#f59e0b' },
        success: { DEFAULT: '#10b981' },
        critical: { DEFAULT: '#dc2626' },
        text: { primary: '#e2e8f0', secondary: '#94a3b8', muted: '#64748b' }
      }
    },
  },
  plugins: [],
}"""

files["postcss.config.js"] = """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}"""

files["tsconfig.json"] = """{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}"""

files["tsconfig.node.json"] = """{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "tailwind.config.ts"]
}"""

files["index.html"] = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CyberTwin AI</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>"""

files["src/index.css"] = """@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: dark; }
body { background-color: #0a0e1a; color: #e2e8f0; }

@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
}
.node-compromised { animation: pulse-red 2s infinite; }

@keyframes flow {
  from { stroke-dashoffset: 20; }
  to { stroke-dashoffset: 0; }
}
.edge-attack-path { stroke-dasharray: 5; animation: flow 0.5s linear infinite; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0f1629; }
::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
"""

files["src/main.tsx"] = """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)"""

files["src/App.tsx"] = """import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import DigitalTwin from './pages/DigitalTwin';
import AttackSimulation from './pages/AttackSimulation';
import AttackPath from './pages/AttackPath';
import Assets from './pages/Assets';
import Scenarios from './pages/Scenarios';
import SecurityControls from './pages/SecurityControls';
import MitreAttack from './pages/MitreAttack';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/twin" element={<DigitalTwin />} />
          <Route path="/simulation" element={<AttackSimulation />} />
          <Route path="/attack-path" element={<AttackPath />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/controls" element={<SecurityControls />} />
          <Route path="/mitre" element={<MitreAttack />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}"""

for p, content in files.items():
    full_path = os.path.join(root, p)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Created base files.")
