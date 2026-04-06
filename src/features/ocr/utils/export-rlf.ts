import type { BirPurchaseLineItem, BirPurchaseTotals } from "@/features/ocr/types";

function escapeRlfText(value: string): string {
  return value.replace(/\|/g, "/").replace(/\r?\n/g, " ").trim();
}

function toMoney(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

export function buildPurchasesRlfContent(lineItems: BirPurchaseLineItem[], totals: BirPurchaseTotals): string {
  const lines: string[] = [];

  lines.push("RLF|PURCHASES_INQUIRY|1");
  lines.push(
    [
      "TOTALS",
      toMoney(totals.exempt),
      toMoney(totals.zeroRated),
      toMoney(totals.taxableNetOfVat),
      toMoney(totals.totalPurchase),
      toMoney(totals.inputTax),
    ].join("|"),
  );

  lineItems.forEach((item) => {
    lines.push(
      [
        "ITEM",
        String(item.sequence),
        escapeRlfText(item.tin),
        escapeRlfText(item.registeredName),
        escapeRlfText(item.lastName),
        escapeRlfText(item.firstName),
        escapeRlfText(item.middleName),
        escapeRlfText(item.substreetStreetBarangay),
        escapeRlfText(item.districtCityZipCode),
        toMoney(item.exempt),
        toMoney(item.zeroRated),
        toMoney(item.taxableNetOfVat),
        toMoney(item.totalPurchase),
        toMoney(item.services),
        toMoney(item.capitalGoods),
        toMoney(item.goodsOtherThanCapitalGoods),
        toMoney(item.inputTax),
      ].join("|"),
    );
  });

  return lines.join("\r\n");
}

export function downloadRlfFile(content: string): void {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const fileName = `purchases-${year}${month}${day}-${hours}${minutes}.RLF`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
