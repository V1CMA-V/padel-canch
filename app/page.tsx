import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Autenticacion lista</h1>
          <p>Inicia sesion solo con Google desde la vista dedicada.</p>
          <Button asChild className="mt-2">
            <Link href="/sign-in">Ir a Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
