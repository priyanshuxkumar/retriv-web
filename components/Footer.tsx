import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-none backdrop-blur-sm">
      <div className="mx-auto container flex flex-col gap-8 px-4 md:px-6 ">
        <div className="flex flex-col gap-4 sm:flex-row justify-between items-center py-8">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-bold">Retriv.</span> All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/legal/privacy-policy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/terms-of-services"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}