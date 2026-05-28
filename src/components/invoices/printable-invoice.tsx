"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import type { Invoice, InvoiceItem } from "@/types/invoice";
import brakaLogo from "@/assets/braka-nusa-core-logo.png";

// ── Constants ─────────────────────────────────────────────────────────────────
// A4 at 96 dpi: 794 × 1123 px
const A4_W_PX = 794;
const PAGE_PAD = 48; // px top/bottom padding per page

const COMPANY = {
    name: "Braka Nusa Core",
    tagline: "Precision Over Noise",
    address: "Jl. H. Sulaiman No.Blok A2, Bedahan, Kec. Sawangan, Kota Depok, Jawa Barat 16519",
    phone: "0813-1562-6403",
    email: "brakanusacore@gmail.com",
};

const PAYMENT_INFO = {
    bankName: "Bank Central Asia (BCA)",
    accountNumber: "2370373461",
    accountName: "Sakha Naufal Huda",
};

function formatRp(v: number) { return `Rp ${v.toLocaleString("id-ID")}`; }
function formatDate(d: string) {
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function getTaxAmount(invoice: Invoice) {
    return Math.max(invoice.total - invoice.subtotal, 0);
}

function getTaxRate(invoice: Invoice) {
    if (!invoice.subtotal) return 0;
    return Math.round((getTaxAmount(invoice) / invoice.subtotal) * 100);
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function InvoiceHeader({ invoice }: { invoice: Invoice }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
            {/* Company */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Image
                        src={brakaLogo}
                        alt="Braka Nusa Core"
                        width={40}
                        height={40}
                        unoptimized
                        style={{ objectFit: "contain" }}
                    />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{COMPANY.name}</div>
                        <div style={{ fontSize: 11, color: "#666" }}>{COMPANY.tagline}</div>
                    </div>
                </div>
                <div style={{ fontSize: 11, color: "#555", lineHeight: 1.8 }}>
                    <div>{COMPANY.address}</div>
                    <div>{COMPANY.phone} · {COMPANY.email}</div>
                </div>
            </div>

            {/* Invoice meta */}
            <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#A3E635", letterSpacing: "-1px" }}>INVOICE</div>
                <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: "#111", marginTop: 2 }}>
                    {invoice.invoiceNumber}
                </div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 8, lineHeight: 2 }}>
                    <div><span style={{ color: "#999" }}>Issued: </span>{formatDate(invoice.invoiceDate)}</div>
                    <div>
                        <span style={{ color: "#999" }}>Due: </span>
                        <span style={{ color: invoice.status === "overdue" ? "#ef4444" : "#111", fontWeight: invoice.status === "overdue" ? 600 : 400 }}>
                            {formatDate(invoice.dueDate)}
                        </span>
                    </div>
                    {invoice.paidAt && (
                        <div style={{ color: "#22c55e" }}>Paid {formatDate(invoice.paidAt)}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ClientSection({ invoice }: { invoice: Invoice }) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: invoice.maintenanceName ? "1fr 1fr" : "1fr", gap: 16, marginBottom: 32 }}>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#999", marginBottom: 10 }}>
                    Bill To
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 6 }}>{invoice.clientName}</div>
                <div style={{ fontSize: 11, color: "#666", lineHeight: 1.8 }}>
                    <div>Attn: Finance Department</div>
                    <div>{invoice.clientEmail}</div>
                </div>
            </div>
            {invoice.maintenanceName && (
                <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#999", marginBottom: 10 }}>
                        Reference
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: "#A3E635", marginTop: 6 }}>
                        {invoice.maintenanceName}
                    </div>
                </div>
            )}
        </div>
    );
}

function TableHeader() {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 60px 110px 110px",
            background: "#f9fafb",
            borderTop: "1px solid #e5e7eb",
            borderBottom: "1px solid #e5e7eb",
            padding: "10px 16px",
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#888",
        }}>
            <div>Description</div>
            <div style={{ textAlign: "center" }}>Qty</div>
            <div style={{ textAlign: "right" }}>Unit Price</div>
            <div style={{ textAlign: "right" }}>Amount</div>
        </div>
    );
}

function TableRow({ item, shade }: { item: InvoiceItem; shade: boolean }) {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 60px 110px 110px",
            padding: "11px 16px",
            borderBottom: "1px solid #f3f4f6",
            background: shade ? "#fafafa" : "#fff",
            fontSize: 12,
        }}>
            <div style={{ color: "#222" }}>{item.description}</div>
            <div style={{ textAlign: "center", color: "#666" }}>{item.qty}</div>
            <div style={{ textAlign: "right", color: "#666" }}>{formatRp(item.unitPrice)}</div>
            <div style={{ textAlign: "right", fontWeight: 600, color: "#111" }}>{formatRp(item.amount)}</div>
        </div>
    );
}

function InvoiceTotals({ invoice }: { invoice: Invoice }) {
    return (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <div style={{ width: 280 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12, borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ color: "#666" }}>Subtotal</span>
                    <span style={{ color: "#111" }}>{formatRp(invoice.subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12, borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ color: "#666" }}>PPN {getTaxRate(invoice)}%</span>
                    <span style={{ color: "#111" }}>{formatRp(getTaxAmount(invoice))}</span>
                </div>
                <div style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "10px 14px", marginTop: 8,
                    background: "rgba(163,230,53,0.1)",
                    border: "1px solid rgba(163,230,53,0.3)",
                    borderRadius: 8,
                }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>Total</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#5a7a00" }}>{formatRp(invoice.total)}</span>
                </div>
            </div>
        </div>
    );
}

function PaymentSection() {
    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "16px", marginTop: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#999", marginBottom: 12 }}>
                Payment Information
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                    { label: "Bank", value: PAYMENT_INFO.bankName },
                    { label: "Account Number", value: PAYMENT_INFO.accountNumber },
                    { label: "Account Name", value: PAYMENT_INFO.accountName },
                ].map(({ label, value }) => (
                    <div key={label}>
                        <div style={{ fontSize: 10, color: "#999", marginBottom: 2 }}>{label}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>{value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function InvoiceFooter({ invoice }: { invoice: Invoice }) {
    return (
        <div style={{ marginTop: 24 }}>
            {invoice.notes && (
                <div style={{ border: "1px solid #f3f4f6", borderRadius: 8, padding: "12px 16px", marginBottom: 24, background: "#fafafa" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#999", marginBottom: 6 }}>
                        Notes
                    </div>
                    <div style={{ fontSize: 11, color: "#666", lineHeight: 1.7 }}>{invoice.notes}</div>
                </div>
            )}
            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16, textAlign: "center", fontSize: 10, color: "#bbb" }}>
                Thank you for your business · {COMPANY.name} · {COMPANY.email}
            </div>
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function PrintableInvoice({ invoice }: { invoice: Invoice }) {
    const [status, setStatus] = useState<"idle" | "generating" | "done" | "error">("idle");
    const containerRef = useRef<HTMLDivElement>(null);

    const generatePdf = useCallback(async () => {
        setStatus("generating");
        try {
            const { default: html2canvas } = await import("html2canvas");
            const { default: jsPDF } = await import("jspdf");

            const container = containerRef.current;
            if (!container) throw new Error("Container not found");

            // Collect all page zones
            const zones = Array.from(
                container.querySelectorAll<HTMLElement>("[data-pdf-zone]")
            );

            // A4 dimensions in mm and pt
            const A4_W_MM = 210;
            const A4_H_MM = 297;

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            let currentPageHeightMM = 0;
            let isFirstPageInDoc = true;

            for (let zi = 0; zi < zones.length; zi++) {
                const zone = zones[zi];

                // Capture at 2× for retina-quality
                const canvas = await html2canvas(zone, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: "#ffffff",
                    windowWidth: A4_W_PX,
                    width: zone.scrollWidth,
                    height: zone.scrollHeight,
                    logging: false,
                });

                const canvasW = canvas.width;
                const canvasH = canvas.height;

                // Convert canvas px → mm proportionally
                // canvas was captured at scale=2 inside A4_W_PX container
                // so 1 logical px = A4_W_MM / A4_W_PX mm
                const pxToMm = A4_W_MM / A4_W_PX;
                const imgW_MM = (canvasW / 2) * pxToMm; // divide by scale
                const imgH_MM = (canvasH / 2) * pxToMm;

                // Check if zone fits remaining space on current page
                const remainingMM = A4_H_MM - currentPageHeightMM;

                if (!isFirstPageInDoc && imgH_MM > remainingMM) {
                    // Need a new page
                    pdf.addPage();
                    currentPageHeightMM = 0;
                }

                // If zone is taller than a full page, we must slice it
                if (imgH_MM > A4_H_MM) {
                    // Slice the canvas into A4-height chunks
                    const sliceHeightPx = Math.floor((A4_H_MM / pxToMm) * 2); // ×2 for scale

                    let sliceOffsetPx = 0;
                    while (sliceOffsetPx < canvasH) {
                        const remainingPx = canvasH - sliceOffsetPx;
                        const thisSlicePx = Math.min(sliceHeightPx, remainingPx);
                        const thisSliceMM = (thisSlicePx / 2) * pxToMm;

                        // Create a slice canvas
                        const sliceCanvas = document.createElement("canvas");
                        sliceCanvas.width = canvasW;
                        sliceCanvas.height = thisSlicePx;
                        const ctx = sliceCanvas.getContext("2d");
                        if (!ctx) break;
                        ctx.drawImage(canvas, 0, -sliceOffsetPx);

                        const sliceDataUrl = sliceCanvas.toDataURL("image/png");

                        if (sliceOffsetPx > 0) {
                            pdf.addPage();
                            currentPageHeightMM = 0;
                        }

                        pdf.addImage(sliceDataUrl, "PNG", 0, currentPageHeightMM, imgW_MM, thisSliceMM);
                        currentPageHeightMM += thisSliceMM;
                        sliceOffsetPx += thisSlicePx;

                        if (currentPageHeightMM >= A4_H_MM - 0.5) {
                            currentPageHeightMM = A4_H_MM; // mark page full
                        }
                    }
                } else {
                    // Zone fits — place it
                    pdf.addImage(
                        canvas.toDataURL("image/png"),
                        "PNG",
                        0,
                        currentPageHeightMM,
                        imgW_MM,
                        imgH_MM,
                    );
                    currentPageHeightMM += imgH_MM;
                }

                isFirstPageInDoc = false;

                // If page is now full after this zone, add a new page for next zone
                if (zi < zones.length - 1 && currentPageHeightMM >= A4_H_MM - 2) {
                    pdf.addPage();
                    currentPageHeightMM = 0;
                }
            }

            pdf.save(`${invoice.invoiceNumber}.pdf`);
            setStatus("done");
        } catch (err) {
            console.error("PDF generation error:", err);
            setStatus("error");
        }
    }, [invoice.invoiceNumber]);

    useEffect(() => {
        // Auto-trigger after paint
        const t = setTimeout(() => {
            void generatePdf();
        }, 600);
        return () => clearTimeout(t);
    }, [generatePdf]);

    // Split items into page 1 chunk (first 6 rows) and continuation chunks
    const ITEMS_PAGE1 = 6;
    const ITEMS_PER_CONT = 12;
    const page1Items = invoice.items.slice(0, ITEMS_PAGE1);
    const contItems = invoice.items.slice(ITEMS_PAGE1);
    const contPages: InvoiceItem[][] = [];
    for (let i = 0; i < contItems.length; i += ITEMS_PER_CONT) {
        contPages.push(contItems.slice(i, i + ITEMS_PER_CONT));
    }

    const baseStyle: CSSProperties = {
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        background: "#ffffff",
        color: "#111111",
        width: A4_W_PX,
        boxSizing: "border-box",
        padding: `${PAGE_PAD}px`,
    };

    return (
        <>
            {/* Status overlay */}
            <div style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
                background: status === "error" ? "#fee2e2" : "#f0fdf4",
                padding: "12px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: "1px solid #e5e7eb",
                fontSize: 13,
            }}>
                <span>
                    {status === "idle" && "Preparing invoice PDF..."}
                    {status === "generating" && "⏳ Generating PDF — please wait..."}
                    {status === "done" && "✅ PDF downloaded successfully."}
                    {status === "error" && "❌ PDF generation failed. Try again."}
                </span>
                {(status === "idle" || status === "error") && (
                    <button
                        onClick={generatePdf}
                        style={{
                            background: "#A3E635", color: "#09090B",
                            border: "none", borderRadius: 6,
                            padding: "6px 16px", fontWeight: 700,
                            cursor: "pointer", fontSize: 12,
                        }}
                    >
                        {status === "error" ? "Retry" : "Generate PDF"}
                    </button>
                )}
            </div>

            {/* Hidden render container — positioned off-screen, exact A4 width */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: "-9999px",
                    width: A4_W_PX,
                    background: "#fff",
                    zIndex: -1,
                }}
                ref={containerRef}
            >
                {/* ═══════════════════════════════════════════════════════
            ZONE 1: Page 1 — Header + Client + first table rows
        ═══════════════════════════════════════════════════════ */}
                <div data-pdf-zone="page1" style={baseStyle}>
                    {/* Top lime accent line */}
                    <div
                        style={{
                            height: 3,
                            backgroundColor: "#A3E635",
                            marginBottom: 32,
                            marginLeft: -PAGE_PAD,
                            marginRight: -PAGE_PAD,
                            marginTop: -PAGE_PAD,
                        }}
                    />

                    <InvoiceHeader invoice={invoice} />

                    {/* Horizontal divider */}
                    <div
                        style={{
                            height: 1,
                            backgroundColor: "rgba(163,230,53,0.4)",
                            marginBottom: 28,
                        }}
                    />

                    <ClientSection invoice={invoice} />

                    {/* Items section label */}
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#999", marginBottom: 10 }}>
                        Services & Items
                    </div>

                    <TableHeader />
                    {page1Items.map((item, i) => (
                        <TableRow key={item.id} item={item} shade={i % 2 === 1} />
                    ))}

                    {/* If no continuation, close with totals + footer here */}
                    {contPages.length === 0 && (
                        <>
                            <InvoiceTotals invoice={invoice} />
                            <PaymentSection />
                            <InvoiceFooter invoice={invoice} />
                        </>
                    )}
                </div>

                {/* ═══════════════════════════════════════════════════════
            ZONE 2+: Continuation pages — table rows only
        ═══════════════════════════════════════════════════════ */}
                {contPages.map((chunk, pageIdx) => {
                    const isLastChunk = pageIdx === contPages.length - 1;
                    return (
                        <div
                            key={pageIdx}
                            data-pdf-zone={`continuation-${pageIdx}`}
                            style={{ ...baseStyle, paddingTop: 32 }}
                        >
                            {/* Subtle continuation label */}
                            <div style={{ fontSize: 10, color: "#bbb", marginBottom: 8, fontStyle: "italic" }}>
                                {invoice.invoiceNumber} — continued
                            </div>

                            <TableHeader />
                            {chunk.map((item, i) => (
                                <TableRow key={item.id} item={item} shade={i % 2 === 1} />
                            ))}

                            {/* Last chunk gets totals + footer */}
                            {isLastChunk && (
                                <>
                                    <InvoiceTotals invoice={invoice} />
                                    <PaymentSection />
                                    <InvoiceFooter invoice={invoice} />
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
