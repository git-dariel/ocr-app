import { AuthShell } from "@/features/auth/components/auth-shell";

export default function SignUpPage() {
  return (
    <AuthShell
      description="Set up your workspace, organize your capture flow, and move straight into the dashboard."
      eyebrow="Create account"
      fields={[
        {
          label: "Team name",
          type: "text",
          placeholder: "Northwind Ops",
          autoComplete: "organization",
        },
        {
          label: "Work email",
          type: "email",
          placeholder: "you@company.com",
          autoComplete: "email",
        },
        {
          label: "Password",
          type: "password",
          placeholder: "Create a password",
          autoComplete: "new-password",
        },
      ]}
      secondaryHref="/sign-in"
      secondaryLabel="Sign in"
      secondaryPrompt="Already have an account?"
      submitLabel="Create workspace"
      title="Create a clean starting point for receipt extraction."
    />
  );
}
