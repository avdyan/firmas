// Importa el tipo APIRoute desde el módulo "astro".
import type { APIRoute } from "astro";

// Exporta una función asíncrona que se ejecutará cuando se haga una petición GET a esta ruta.
export const GET: APIRoute = async ({ cookies, redirect }) => {
  // Elimina las cookies "sb-access-token" y "sb-refresh-token".
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });

  // Redirige al usuario a la página de inicio de sesión.
  return redirect("/signin");
};