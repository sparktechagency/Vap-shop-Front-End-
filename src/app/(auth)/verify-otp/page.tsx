import { OTPForm } from "./otp-form";

export default function Page() {
  return (
    <div className="flex w-full items-center justify-center !p-6 md:!p-10">
      <div className="w-full max-w-sm">
        <OTPForm />
      </div>
    </div>
  );
}
