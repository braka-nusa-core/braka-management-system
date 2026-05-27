"use client";

import { useState } from "react";
import { Building2, FileText, Bell, Palette, Save } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToastActions } from "@/hooks/use-toast-actions";

type SettingsTab = "agency" | "invoice" | "notifications" | "branding";

const TABS: { label: string; value: SettingsTab; icon: React.ElementType }[] = [
  { label: "Agency Info", value: "agency", icon: Building2 },
  { label: "Invoice", value: "invoice", icon: FileText },
  { label: "Notifications", value: "notifications", icon: Bell },
  { label: "Branding", value: "branding", icon: Palette },
];

const labelCls = "text-xs font-medium text-[#A1A1AA]";
const selectCls = "w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635]";

function SettingsCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
      <div className="mb-4 border-b border-white/[0.06] pb-4">
        <h3 className="text-sm font-semibold text-[#F4F4F5]">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-[#A1A1AA]">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ label, description, defaultOn = false }: { label: string; description?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/[0.04] last:border-0">
      <div>
        <p className="text-sm font-medium text-[#F4F4F5]">{label}</p>
        {description && <p className="mt-0.5 text-xs text-[#A1A1AA]">{description}</p>}
      </div>
      <button
        onClick={() => setOn((p) => !p)}
        className={`relative shrink-0 h-5 w-9 rounded-full transition-colors ${on ? "bg-[#A3E635]" : "bg-[#18181B] border border-white/10"}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${on ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("agency");
  const t = useToastActions();

  const [agency, setAgency] = useState({
    name: "PT Braka Solusi Teknik",
    tagline: "Professional Maintenance & Engineering Services",
    email: "invoice@braka.co.id",
    phone: "021-5555-1234",
    address: "Jl. Kebayoran Baru No. 88, Jakarta Selatan 12110",
    npwp: "12.345.678.9-012.000",
    website: "https://braka.co.id",
  });

  const [invoice, setInvoice] = useState({
    prefix: "INV",
    nextNumber: "0045",
    taxRate: "11",
    paymentTerms: "14",
    bank: "Bank Central Asia (BCA)",
    accountNumber: "1234 5678 9012",
    accountName: "PT Braka Solusi Teknik",
    defaultNotes: "Payment via bank transfer. Please include invoice number as reference.",
    dueDateBuffer: "14",
  });

  function Field({ label, value, onChange, type = "text", span2 = false }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; span2?: boolean;
  }) {
    return (
      <div className={span2 ? "sm:col-span-2" : ""}>
        <label className={labelCls}>{label}</label>
        <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5" />
      </div>
    );
  }

  return (
    <DashboardLayout title="Settings">
      <PageHeader
        title="Settings"
        description="Manage your agency preferences and system configuration."
        breadcrumbs={[{ label: "Settings" }]}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar tabs */}
        <div className="shrink-0 lg:w-48">
          <nav className="space-y-0.5 rounded-xl border border-white/[0.06] bg-[#111827] p-2">
            {TABS.map((tab_) => {
              const Icon = tab_.icon;
              return (
                <button
                  key={tab_.value}
                  onClick={() => setTab(tab_.value)}
                  className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${tab === tab_.value
                      ? "bg-[#A3E635]/10 text-[#A3E635]"
                      : "text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#F4F4F5]"
                    }`}
                >
                  <Icon size={15} />
                  {tab_.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-4">
          {/* Agency Info */}
          {tab === "agency" && (
            <SettingsCard title="Agency Information" description="This information appears on invoices and client-facing documents.">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Agency Name" value={agency.name} onChange={(v) => setAgency({ ...agency, name: v })} span2 />
                <Field label="Tagline" value={agency.tagline} onChange={(v) => setAgency({ ...agency, tagline: v })} span2 />
                <Field label="Email" value={agency.email} onChange={(v) => setAgency({ ...agency, email: v })} type="email" />
                <Field label="Phone" value={agency.phone} onChange={(v) => setAgency({ ...agency, phone: v })} type="tel" />
                <Field label="Address" value={agency.address} onChange={(v) => setAgency({ ...agency, address: v })} span2 />
                <Field label="NPWP" value={agency.npwp} onChange={(v) => setAgency({ ...agency, npwp: v })} />
                <Field label="Website" value={agency.website} onChange={(v) => setAgency({ ...agency, website: v })} type="url" />
              </div>
              <div className="mt-4 flex justify-end">
                <Button size="sm" className="gap-2" onClick={() => t.settingsSaved()}>
                  <Save size={13} /> Save Changes
                </Button>
              </div>
            </SettingsCard>
          )}

          {/* Invoice Settings */}
          {tab === "invoice" && (
            <>
              <SettingsCard title="Invoice Numbering" description="Configure how invoice numbers are generated.">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Invoice Prefix" value={invoice.prefix} onChange={(v) => setInvoice({ ...invoice, prefix: v })} />
                  <Field label="Next Number" value={invoice.nextNumber} onChange={(v) => setInvoice({ ...invoice, nextNumber: v })} />
                  <Field label="Default Tax Rate (%)" value={invoice.taxRate} onChange={(v) => setInvoice({ ...invoice, taxRate: v })} type="number" />
                  <Field label="Payment Terms (days)" value={invoice.paymentTerms} onChange={(v) => setInvoice({ ...invoice, paymentTerms: v })} type="number" />
                </div>
              </SettingsCard>

              <SettingsCard title="Bank Account" description="Default payment account shown on invoices.">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Bank Name" value={invoice.bank} onChange={(v) => setInvoice({ ...invoice, bank: v })} span2 />
                  <Field label="Account Number" value={invoice.accountNumber} onChange={(v) => setInvoice({ ...invoice, accountNumber: v })} />
                  <Field label="Account Name" value={invoice.accountName} onChange={(v) => setInvoice({ ...invoice, accountName: v })} />
                </div>
              </SettingsCard>

              <SettingsCard title="Default Notes">
                <textarea
                  rows={3}
                  value={invoice.defaultNotes}
                  onChange={(e) => setInvoice({ ...invoice, defaultNotes: e.target.value })}
                  className="w-full resize-none rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635]"
                />
                <div className="mt-4 flex justify-end">
                  <Button size="sm" className="gap-2" onClick={() => t.settingsSaved()}>
                    <Save size={13} /> Save Changes
                  </Button>
                </div>
              </SettingsCard>
            </>
          )}

          {/* Notifications */}
          {tab === "notifications" && (
            <SettingsCard title="Notification Preferences" description="Control which notifications you receive.">
              <div>
                <ToggleRow label="Invoice Due Soon" description="Notify before invoice due date" defaultOn />
                <ToggleRow label="Invoice Overdue" description="Notify when invoice becomes overdue" defaultOn />
                <ToggleRow label="Payment Received" description="Notify when payment is confirmed" defaultOn />
                <ToggleRow label="Contract Expiring" description="Notify before maintenance contract expires" defaultOn />
                <ToggleRow label="New Client Added" description="Notify when a new client is created" />
                <ToggleRow label="System Updates" description="Notify on system and app updates" />
              </div>
              <div className="mt-4 space-y-3 border-t border-white/[0.06] pt-4">
                <p className="text-xs font-medium text-[#A1A1AA]">Reminder Lead Time</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Invoice reminder (days before)</label>
                    <select className={`${selectCls} mt-1.5`} defaultValue="7">
                      {[3, 5, 7, 14, 30].map((d) => <option key={d} value={d}>{d} days</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Contract reminder (days before)</label>
                    <select className={`${selectCls} mt-1.5`} defaultValue="14">
                      {[7, 14, 30, 60].map((d) => <option key={d} value={d}>{d} days</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button size="sm" className="gap-2" onClick={() => t.settingsSaved()}>
                  <Save size={13} /> Save Changes
                </Button>
              </div>
            </SettingsCard>
          )}

          {/* Branding */}
          {tab === "branding" && (
            <>
              <SettingsCard title="Brand Preview" description="Preview how your agency appears on client documents.">
                <div className="rounded-xl border border-white/[0.06] bg-[#09090B] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A3E635]">
                      <span className="text-lg font-black text-[#09090B]">B</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#F4F4F5]">PT Braka Solusi Teknik</p>
                      <p className="text-xs text-[#A1A1AA]">Professional Maintenance & Engineering Services</p>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-[#A3E635]/30 to-transparent mb-3" />
                  <div className="space-y-1 text-xs text-[#A1A1AA]">
                    <p>Jl. Kebayoran Baru No. 88, Jakarta Selatan 12110</p>
                    <p>021-5555-1234 · invoice@braka.co.id</p>
                    <p className="text-[10px] text-[#A1A1AA]/40">NPWP: 12.345.678.9-012.000</p>
                  </div>
                </div>
              </SettingsCard>

              <SettingsCard title="Accent Color" description="Primary color used across invoices and portal.">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#A3E635] ring-2 ring-[#A3E635]/30" />
                  <div>
                    <p className="text-sm font-medium text-[#F4F4F5]">Lime Green</p>
                    <p className="text-xs text-[#A1A1AA]">#A3E635 · Brand default</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-[#A1A1AA]/60">Custom color picker coming in next update.</p>
              </SettingsCard>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}