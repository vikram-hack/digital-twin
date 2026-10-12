import os
root = r"g:\projects\AI-POWERED DIGITAL TWIN FOR CYBER ATTACK SIMULATION\frontend"

files = {}

files["src/pages/Assets.tsx"] = """import { useState, useEffect } from 'react';
import { getAssets } from '../api/assets';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function Assets() {
  const [assets, setAssets] = useState<any[]>([]);
  useEffect(() => {
    getAssets().then(setAssets).catch(() => setAssets([
      { id: '1', name: 'Web Server', type: 'server', department: 'IT', criticality: 3, ip_address: '10.0.0.1', status: 'normal' },
      { id: '2', name: 'DB Server', type: 'database', department: 'Data', criticality: 5, ip_address: '10.0.0.2', status: 'critical' }
    ]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Assets</h1>
      <Card>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border text-text-muted">
              <th className="p-3">Name</th><th className="p-3">Type</th><th className="p-3">IP</th><th className="p-3">Criticality</th><th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(a => (
              <tr key={a.id} className="border-b border-border hover:bg-white/5">
                <td className="p-3 font-medium">{a.name}</td>
                <td className="p-3">{a.type}</td>
                <td className="p-3 font-mono text-sm">{a.ip_address}</td>
                <td className="p-3">{'★'.repeat(a.criticality)}</td>
                <td className="p-3"><Badge variant={a.status}>{a.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}"""

files["src/pages/Scenarios.tsx"] = """import { Card } from '../components/ui/Card';
export default function Scenarios() {
  const scenarios = [
    { name: 'Ransomware Outbreak', desc: 'Simulates a ransomware attack starting from a phishing email payload on a workstation.' },
    { name: 'Insider Threat', desc: 'A rogue employee attempting to access critical databases.' },
    { name: 'External Web Exploit', desc: 'Exploitation of a vulnerability on the public web server.' }
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Attack Scenarios</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map(s => (
          <Card key={s.name}>
            <h3 className="font-bold text-lg">{s.name}</h3>
            <p className="text-text-secondary mt-2">{s.desc}</p>
            <button className="mt-4 bg-accent hover:bg-accent-glow text-white px-4 py-2 rounded">Run Scenario</button>
          </Card>
        ))}
      </div>
    </div>
  );
}"""

files["src/pages/SecurityControls.tsx"] = """import { useState } from 'react';
import { Card } from '../components/ui/Card';
export default function SecurityControls() {
  const [controls, setControls] = useState([
    { id: '1', name: 'MFA Enforcement', active: true, effectiveness: 90 },
    { id: '2', name: 'Network Segmentation', active: false, effectiveness: 75 },
    { id: '3', name: 'EDR on Endpoints', active: true, effectiveness: 85 }
  ]);
  const toggle = (id: string) => setControls(c => c.map(x => x.id === id ? { ...x, active: !x.active } : x));
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Security Controls</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {controls.map(c => (
          <Card key={c.id}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{c.name}</h3>
              <button onClick={() => toggle(c.id)} className={`px-3 py-1 rounded ${c.active ? 'bg-success text-white' : 'bg-gray-700 text-gray-300'}`}>
                {c.active ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <p className="text-text-secondary text-sm">Effectiveness: {c.effectiveness}%</p>
            <div className="w-full bg-gray-800 h-2 mt-2 rounded overflow-hidden">
              <div className="bg-accent h-full" style={{width: `${c.effectiveness}%`}}></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}"""

for p, content in files.items():
    full_path = os.path.join(root, p)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
print("Updated pages.")
