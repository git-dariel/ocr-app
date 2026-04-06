"use client";

import { type ReactNode, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";

import type { BirPurchaseLineItem, BirPurchaseTotals, OcrReceiptResponse } from "@/features/ocr/types";
import { buildPurchasesRlfContent, downloadRlfFile } from "@/features/ocr/utils/export-rlf";

type BirPurchasesInquiryTableProps = {
  result: OcrReceiptResponse | null;
};

type MoneyKey =
  | "exempt"
  | "zeroRated"
  | "taxableNetOfVat"
  | "totalPurchase"
  | "services"
  | "capitalGoods"
  | "goodsOtherThanCapitalGoods"
  | "inputTax";

const moneyColumns: { key: MoneyKey; label: string }[] = [
  { key: "exempt", label: "Exempt" },
  { key: "zeroRated", label: "Zero-Rated" },
  { key: "taxableNetOfVat", label: "Taxable (Net of VAT)" },
  { key: "totalPurchase", label: "Total Purchase" },
  { key: "services", label: "Services" },
  { key: "capitalGoods", label: "Capital Goods" },
  { key: "goodsOtherThanCapitalGoods", label: "Goods Other than Capital Goods" },
  { key: "inputTax", label: "Total Input Tax" },
];

function toMoneyInput(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

function parseMoneyValue(rawValue: string): number {
  const normalized = rawValue.replace(/,/g, "").trim();
  if (!normalized) {
    return 0;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function updateTextField(
  lineItems: BirPurchaseLineItem[],
  index: number,
  key:
    | "tin"
    | "registeredName"
    | "lastName"
    | "firstName"
    | "middleName"
    | "substreetStreetBarangay"
    | "districtCityZipCode",
  value: string,
): BirPurchaseLineItem[] {
  return lineItems.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row));
}

function updateMoneyField(
  lineItems: BirPurchaseLineItem[],
  index: number,
  key: MoneyKey,
  value: string,
): BirPurchaseLineItem[] {
  return lineItems.map((row, rowIndex) =>
    rowIndex === index ? { ...row, [key]: parseMoneyValue(value) } : row,
  );
}

function computeBirTotalsFromLineItems(lineItems: BirPurchaseLineItem[]): BirPurchaseTotals {
  return lineItems.reduce<BirPurchaseTotals>(
    (acc, row) => {
      acc.exempt += row.exempt;
      acc.zeroRated += row.zeroRated;
      acc.taxableNetOfVat += row.taxableNetOfVat;
      acc.totalPurchase += row.totalPurchase;
      acc.inputTax += row.inputTax;
      return acc;
    },
    {
      exempt: 0,
      zeroRated: 0,
      taxableNetOfVat: 0,
      totalPurchase: 0,
      inputTax: 0,
    },
  );
}

export function BirPurchasesInquiryTable({ result }: BirPurchasesInquiryTableProps) {
  const [lineItems, setLineItems] = useState<BirPurchaseLineItem[]>(() => result?.structured.lineItems ?? []);
  const [manualTotals] = useState<BirPurchaseTotals | null>(null);
  const [moneyDrafts, setMoneyDrafts] = useState<Record<string, string>>({});

  const computedTotals = useMemo(() => computeBirTotalsFromLineItems(lineItems), [lineItems]);

  function setLineItemsAndResetTotals(nextLineItems: BirPurchaseLineItem[]): void {
    setLineItems(nextLineItems);
  }

  function getMoneyDraftKey(index: number, key: MoneyKey): string {
    return `${index}:${key}`;
  }

  function commitMoneyField(index: number, key: MoneyKey): void {
    const draftKey = getMoneyDraftKey(index, key);
    const draftValue = moneyDrafts[draftKey];
    if (draftValue === undefined) {
      return;
    }

    setLineItemsAndResetTotals(updateMoneyField(lineItems, index, key, draftValue));
    setMoneyDrafts((prev) => {
      const next = { ...prev };
      delete next[draftKey];
      return next;
    });
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#171815]">
      <div className="border-b border-slate-100 px-6 py-5 dark:border-white/8">
        <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">Purchases Inquiry</p>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-stone-500">
          Editable OCR fields in aligned form layout.
        </p>
      </div>

      <div className="p-5">
        {!result ? (
          <p className="text-sm text-slate-400 dark:text-stone-500">
            Structured receipt fields appear here after a successful extraction run.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="rounded-[16px] border border-amber-200 bg-amber-50/70 px-4 py-3 text-amber-800 dark:border-amber-700/40 dark:bg-amber-950/20 dark:text-amber-300">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-xs font-medium">
                  Double-check extracted fields against the receipt image. OCR can misread text and amounts.
                </p>
              </div>
            </div>

            {lineItems.length === 0 ? (
              <div className="rounded-[18px] border border-slate-200 px-3 py-8 text-center text-slate-400 dark:border-white/10 dark:text-stone-500">
                No line items extracted yet.
              </div>
            ) : (
              lineItems.map((item, index) => (
                <div
                  key={`${item.sequence}-${index}`}
                  className="space-y-4 rounded-[18px] border border-slate-200 p-4 dark:border-white/10"
                >
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <Field label="Sequence">
                      <input
                        className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-white/10 dark:bg-[#11120f] dark:text-stone-200"
                        type="number"
                        value={item.sequence}
                        onChange={(event) => {
                          const next = Number(event.target.value);
                          setLineItemsAndResetTotals(
                            lineItems.map((row, rowIndex) =>
                              rowIndex === index ? { ...row, sequence: Number.isFinite(next) ? next : row.sequence } : row,
                            ),
                          );
                        }}
                      />
                    </Field>
                    <Field label="TIN">
                      <input
                        className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-white/10 dark:bg-[#11120f] dark:text-stone-200"
                        value={item.tin}
                        onChange={(event) =>
                          setLineItemsAndResetTotals(updateTextField(lineItems, index, "tin", event.target.value))
                        }
                      />
                    </Field>
                    <Field label="Registered Name" className="xl:col-span-2">
                      <input
                        className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-white/10 dark:bg-[#11120f] dark:text-stone-200"
                        value={item.registeredName}
                        onChange={(event) =>
                          setLineItemsAndResetTotals(
                            updateTextField(lineItems, index, "registeredName", event.target.value),
                          )
                        }
                      />
                    </Field>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="First Name">
                      <input
                        className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-white/10 dark:bg-[#11120f] dark:text-stone-200"
                        value={item.firstName}
                        onChange={(event) =>
                          setLineItemsAndResetTotals(updateTextField(lineItems, index, "firstName", event.target.value))
                        }
                      />
                    </Field>
                    <Field label="Middle Name">
                      <input
                        className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-white/10 dark:bg-[#11120f] dark:text-stone-200"
                        value={item.middleName}
                        onChange={(event) =>
                          setLineItemsAndResetTotals(updateTextField(lineItems, index, "middleName", event.target.value))
                        }
                      />
                    </Field>
                    <Field label="Last Name">
                      <input
                        className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-white/10 dark:bg-[#11120f] dark:text-stone-200"
                        value={item.lastName}
                        onChange={(event) =>
                          setLineItemsAndResetTotals(updateTextField(lineItems, index, "lastName", event.target.value))
                        }
                      />
                    </Field>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Substreet / Street / Barangay">
                      <input
                        className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-white/10 dark:bg-[#11120f] dark:text-stone-200"
                        value={item.substreetStreetBarangay}
                        onChange={(event) =>
                          setLineItemsAndResetTotals(
                            updateTextField(lineItems, index, "substreetStreetBarangay", event.target.value),
                          )
                        }
                      />
                    </Field>
                    <Field label="District, City, Zip Code">
                      <input
                        className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-white/10 dark:bg-[#11120f] dark:text-stone-200"
                        value={item.districtCityZipCode}
                        onChange={(event) =>
                          setLineItemsAndResetTotals(
                            updateTextField(lineItems, index, "districtCityZipCode", event.target.value),
                          )
                        }
                      />
                    </Field>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {moneyColumns.map((column) => (
                      <Field key={column.key} label={column.label}>
                        {(() => {
                          const draftKey = getMoneyDraftKey(index, column.key);
                          const inputValue =
                            moneyDrafts[draftKey] !== undefined
                              ? moneyDrafts[draftKey]
                              : String(item[column.key] ?? "");
                          return (
                        <input
                          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-right text-slate-700 dark:border-white/10 dark:bg-[#11120f] dark:text-stone-200"
                          value={inputValue}
                          onChange={(event) =>
                            setMoneyDrafts((prev) => ({
                              ...prev,
                              [draftKey]: event.target.value,
                            }))
                          }
                          onBlur={() => commitMoneyField(index, column.key)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.currentTarget.blur();
                            }
                          }}
                        />
                          );
                        })()}
                      </Field>
                    ))}
                  </div>
                </div>
              ))
            )}

            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-full bg-[#145d66] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0e4d55] dark:hover:bg-[#1a7a86]"
                onClick={() => {
                  const content = buildPurchasesRlfContent(lineItems, computedTotals);
                  downloadRlfFile(content);
                }}
              >
                Export RLF
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-1 text-[11px] font-semibold text-slate-500 dark:text-stone-400">{label}</p>
      {children}
    </div>
  );
}

