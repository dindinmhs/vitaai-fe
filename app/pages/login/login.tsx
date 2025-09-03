import { SignInForm } from "~/components/auth/signin";

export function LoginPage() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4 bg-gray-100 min-h-screen">
      <SignInForm/>
    </main>
  );
}
