import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        {user ? (
          <section className="rounded-lg border bg-card p-5">
            <h1 className="font-medium">Sesion iniciada</h1>
            <p className="mt-1 text-muted-foreground">
              Esta es la informacion de tu cuenta.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name ? `Foto de ${user.name}` : "Foto de perfil"}
                  className="h-10 w-10 rounded-full border object-cover"
                />
              ) : null}
              <div className="min-w-0">
                <p className="truncate font-medium">{user.name || "Sin nombre"}</p>
                <p className="truncate text-muted-foreground">
                  {user.email || "Sin email"}
                </p>
              </div>
            </div>
            <SignOutButton />
          </section>
        ) : (
          <div>
            <h1 className="font-medium">Autenticacion lista</h1>
            <p>Inicia sesion desde el boton del header.</p>
          </div>
        )}
      </div>
    </div>
  );
}
