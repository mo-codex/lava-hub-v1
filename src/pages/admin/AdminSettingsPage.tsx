import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Shield } from 'lucide-react';
import { Card } from '../../components/ui/Card.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Button } from '../../components/ui/Button.tsx';

export function AdminSettingsPage() {
  const [cutoffHours, setCutoffHours] = useState('2');
  const [waitlistOfferHours, setWaitlistOfferHours] = useState('24');
  const [verificationExpiryHours, setVerificationExpiryHours] = useState('24');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Platform Governance & Timing Settings
        </h1>
        <p className="text-xs text-slate-500">
          Configure default cancellation cutoffs, waitlist promotion expiration windows, and timezone rules.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Platform settings updated successfully.</span>
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <Input
            label="Cancellation Cutoff Window (Hours before start)"
            type="number"
            min={1}
            value={cutoffHours}
            onChange={(e) => setCutoffHours(e.target.value)}
            helperText="Default: 2 hours. Cancellations after this threshold are locked to prevent last-minute empty seats."
          />

          <Input
            label="Waitlist Seat Offer Expiration (Hours)"
            type="number"
            min={1}
            value={waitlistOfferHours}
            onChange={(e) => setWaitlistOfferHours(e.target.value)}
            helperText="Time a promoted student has to accept an offered seat before auto-cascading to the next person in line."
          />

          <Input
            label="Email Verification Expiration (Hours)"
            type="number"
            min={1}
            value={verificationExpiryHours}
            onChange={(e) => setVerificationExpiryHours(e.target.value)}
            helperText="Validity window for guest email verification magic links."
          />

          <div className="pt-2">
            <Button type="submit" className="text-xs font-bold py-2.5">
              <Save className="w-3.5 h-3.5 mr-1.5" />
              <span>Save System Settings</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
