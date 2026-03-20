const BYTE_UNITS = ["B", "KB", "MB", "GB"] as const;

export function formatBytes(value: number): string {
  if (value === 0) {
    return "0 B";
  }

  const exponent = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    BYTE_UNITS.length - 1,
  );
  const size = value / 1024 ** exponent;
  return `${size.toFixed(exponent === 0 ? 0 : 2)} ${BYTE_UNITS[exponent]}`;
}
