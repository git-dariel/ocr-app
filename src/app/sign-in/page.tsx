import { AuthShell } from "@/features/auth/components/auth-shell";

export default function SignInPage() {
  return (
    <AuthShell
      description="Review extraction output, monitor OCR status, and continue into the dashboard shell."
      eyebrow="Sign in"
      fields={[
        {
          label: "Work email",
          type: "email",
          placeholder: "ops@company.com",
          autoComplete: "email",
        },
        {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
          autoComplete: "current-password",
        },
      ]}
      secondaryHref="/sign-up"
      secondaryLabel="Create account"
      secondaryPrompt="Need a workspace?"
      submitLabel="Enter dashboard"
      title="Return to your receipt operations console."
    />
  );
}
