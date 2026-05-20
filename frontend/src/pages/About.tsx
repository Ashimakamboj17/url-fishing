import { Shield, Brain, Cpu, Database, BarChart3 } from 'lucide-react';

export default function About() {
  const modelMetrics = [
    { label: 'Overall Accuracy', value: '96.5%', description: 'Proportion of correctly classified safe & phishing URLs' },
    { label: 'Model Precision', value: '97.4%', description: 'Ratio of true phishing alerts to all positive verdicts' },
    { label: 'Recall / Sensitivity', value: '95.8%', description: 'Ability to detect all actual phishing threats present' },
    { label: 'F1 Security Score', value: '96.6%', description: 'Harmonic mean of precision and recall performance' },
  ];

  const extractedFeatures = [
    {
      name: 'URL Length Checking',
      desc: 'Phishing websites often employ exceptionally long URLs to conceal fake subdomains or hide redirection redirects.',
      severity: 'Medium'
    },
    {
      name: 'IP Address Presence',
      desc: 'Legitimate sites rarely use raw IP addresses (e.g. 192.168.1.1) in hostnames. Phishing scams use them to bypass DNS registration alerts.',
      severity: 'Critical'
    },
    {
      name: 'At Symbol (@) Detection',
      desc: 'Browsers ignore any text before an "@" symbol in URLs and go straight to the destination host. Scammers use this to fake trust (e.g. google.com@scam-site.com).',
      severity: 'Critical'
    },
    {
      name: 'Redirection (//) Indicator',
      desc: 'The presence of double slashes in the path component indicates a direct redirect to an external, untrusted third-party host.',
      severity: 'High'
    },
    {
      name: 'Shortened URLs (e.g., bit.ly)',
      desc: 'Shortening services mask the real destination. Phishing campaigns widely distribute shortened URLs to hide their servers.',
      severity: 'High'
    },
    {
      name: 'Prefix/Suffix (-) in Domains',
      desc: 'Phishing brands frequently add hyphens to famous domains (e.g. pay-pal-verify.com) to deceive users into believing they are official.',
      severity: 'Medium'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Intro section */}
      <div className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Brain className="w-40 h-40 text-cyber-neon" />
        </div>
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex gap-2 items-center text-cyber-neon text-sm font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4" /> Heuristics & Machine Learning
          </div>
          <h2 className="text-3xl font-extrabold text-cyber-text">How PhishGuard Detects Threats</h2>
          <p className="text-cyber-muted text-base leading-relaxed">
            PhishGuard works by combining heuristics extraction with an advanced Scikit-Learn **Random Forest Classifier** machine learning model. When a URL is scanned, it is instantly dissected into numeric features, which are then run through our pre-trained model to output a safety verdict and confidence score.
          </p>
        </div>
      </div>

      {/* Model Performance */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-cyber-text">
          <BarChart3 className="w-5 h-5 text-cyber-neon" /> Random Forest Classifier Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {modelMetrics.map((metric, idx) => (
            <div key={idx} className="glass-panel p-6 border-b border-b-cyber-border hover:border-b-cyber-neon/40 transition-colors">
              <span className="text-cyber-muted text-xs font-semibold uppercase tracking-wider">{metric.label}</span>
              <h4 className="text-3xl font-black text-cyber-neon mt-2 font-mono">{metric.value}</h4>
              <p className="text-xs text-cyber-muted mt-2 leading-relaxed">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-cyber-border bg-cyber-darker/30">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyber-purple" />
            Heuristics Analysis Breakdown
          </h3>
          <p className="text-xs text-cyber-muted mt-1">Some of the key parameters extracted during URL heuristic scans</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cyber-border bg-cyber-dark/40">
                <th className="py-4 px-6 font-semibold text-cyber-muted text-xs uppercase tracking-wider">Feature Parameter</th>
                <th className="py-4 px-6 font-semibold text-cyber-muted text-xs uppercase tracking-wider">Detection Logic / Description</th>
                <th className="py-4 px-6 font-semibold text-cyber-muted text-xs uppercase tracking-wider w-32">Risk Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40">
              {extractedFeatures.map((f, index) => (
                <tr key={index} className="hover:bg-cyber-darker/20 transition-colors">
                  <td className="py-4 px-6 font-semibold text-cyber-text text-sm font-mono">{f.name}</td>
                  <td className="py-4 px-6 text-sm text-cyber-muted leading-relaxed">{f.desc}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                      f.severity === 'Critical' ? 'text-cyber-red bg-cyber-red/10' :
                      f.severity === 'High' ? 'text-orange-500 bg-orange-500/10' : 'text-cyber-neon bg-cyber-neon/10'
                    }`}>
                      {f.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Stack */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-cyber-green" /> Technical Stack Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-cyber-darker/60 p-4 rounded-lg border border-cyber-border">
            <span className="block text-[10px] text-cyber-muted uppercase tracking-wider font-semibold">Backend Engine</span>
            <span className="block text-sm text-cyber-text font-bold mt-1 font-mono">FastAPI</span>
          </div>
          <div className="bg-cyber-darker/60 p-4 rounded-lg border border-cyber-border">
            <span className="block text-[10px] text-cyber-muted uppercase tracking-wider font-semibold">Database Store</span>
            <span className="block text-sm text-cyber-text font-bold mt-1 font-mono">SQLite / SQLAlchemy</span>
          </div>
          <div className="bg-cyber-darker/60 p-4 rounded-lg border border-cyber-border">
            <span className="block text-[10px] text-cyber-muted uppercase tracking-wider font-semibold">Heuristics ML</span>
            <span className="block text-sm text-cyber-text font-bold mt-1 font-mono">Scikit-Learn</span>
          </div>
          <div className="bg-cyber-darker/60 p-4 rounded-lg border border-cyber-border">
            <span className="block text-[10px] text-cyber-muted uppercase tracking-wider font-semibold">Frontend Interface</span>
            <span className="block text-sm text-cyber-text font-bold mt-1 font-mono">React / Vite / Tailwind</span>
          </div>
        </div>
      </div>
    </div>
  );
}
