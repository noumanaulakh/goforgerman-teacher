import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-headline text-3xl font-extrabold text-primary">
        Create Your Account
      </h1>
      <p className="mt-2 text-neutral-900/70">
        Sign up to get a personalized teacher recommendation.
      </p>

      <div className="mt-8">
        <SignupForm />
      </div>
    </div>
  );
}
