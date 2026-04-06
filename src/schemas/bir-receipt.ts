import { z } from "zod";

const moneyNumberSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();
    if (normalized.length === 0) {
      return 0;
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : value;
  }

  return value;
}, z.number().finite());

export const birPurchaseLineItemSchema = z.object({
  sequence: z.number().int().positive(),
  tin: z.string().trim().optional().default(""),
  registeredName: z.string().trim().optional().default(""),
  lastName: z.string().trim().optional().default(""),
  firstName: z.string().trim().optional().default(""),
  middleName: z.string().trim().optional().default(""),
  substreetStreetBarangay: z.string().trim().optional().default(""),
  districtCityZipCode: z.string().trim().optional().default(""),
  exempt: moneyNumberSchema.default(0),
  zeroRated: moneyNumberSchema.default(0),
  taxableNetOfVat: moneyNumberSchema.default(0),
  totalPurchase: moneyNumberSchema.default(0),
  services: moneyNumberSchema.default(0),
  capitalGoods: moneyNumberSchema.default(0),
  goodsOtherThanCapitalGoods: moneyNumberSchema.default(0),
  inputTax: moneyNumberSchema.default(0),
});

export const birPurchaseTotalsSchema = z.object({
  exempt: moneyNumberSchema.default(0),
  zeroRated: moneyNumberSchema.default(0),
  taxableNetOfVat: moneyNumberSchema.default(0),
  totalPurchase: moneyNumberSchema.default(0),
  inputTax: moneyNumberSchema.default(0),
});

export const birStructuredReceiptSchema = z.object({
  schemaVersion: z.literal("1").default("1"),
  company: z
    .object({
      tin: z.string().trim().optional().default(""),
      registeredName: z.string().trim().optional().default(""),
    })
    .optional(),
  lineItems: z.array(birPurchaseLineItemSchema).default([]),
  totals: birPurchaseTotalsSchema.default({
    exempt: 0,
    zeroRated: 0,
    taxableNetOfVat: 0,
    totalPurchase: 0,
    inputTax: 0,
  }),
});

export type BirPurchaseLineItem = z.infer<typeof birPurchaseLineItemSchema>;
export type BirPurchaseTotals = z.infer<typeof birPurchaseTotalsSchema>;
export type BirStructuredReceipt = z.infer<typeof birStructuredReceiptSchema>;

export function createDefaultBirLineItem(sequence = 1): BirPurchaseLineItem {
  return {
    sequence,
    tin: "",
    registeredName: "",
    lastName: "",
    firstName: "",
    middleName: "",
    substreetStreetBarangay: "",
    districtCityZipCode: "",
    exempt: 0,
    zeroRated: 0,
    taxableNetOfVat: 0,
    totalPurchase: 0,
    services: 0,
    capitalGoods: 0,
    goodsOtherThanCapitalGoods: 0,
    inputTax: 0,
  };
}

export function computeBirTotalsFromLineItems(lineItems: BirPurchaseLineItem[]): BirPurchaseTotals {
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

export function normalizeBirStructuredReceipt(input: unknown): BirStructuredReceipt {
  const parsed = birStructuredReceiptSchema.parse(input ?? {});
  return {
    ...parsed,
    totals: parsed.lineItems.length > 0 ? computeBirTotalsFromLineItems(parsed.lineItems) : parsed.totals,
  };
}
