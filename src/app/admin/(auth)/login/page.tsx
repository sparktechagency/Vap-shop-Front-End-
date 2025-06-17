import { LoginForm } from "./login-form";

export default function Page() {
  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <div className="w-full max-w-sm !mx-auto">
        <LoginForm />
      </div>
    </div>
  );
}
