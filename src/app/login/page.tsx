import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-headline text-3xl font-extrabold text-primary">
        Log In
      </h1>
      <p className="mt-2 text-neutral-900/70">
        Sign in to manage your teacher profile and bookings.
      </p>

      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
