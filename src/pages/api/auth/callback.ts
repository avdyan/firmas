// Importa el tipo APIRoute desde el módulo "astro".
import type { APIRoute } from "astro";

// Importa el objeto supabase desde el módulo "../../../lib/supabase".
import { supabase } from "../../../lib/supabase";

// Exporta una función asíncrona que se ejecutará cuando se haga una petición GET a esta ruta.
export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  // Obtiene el código de autorización desde los parámetros de búsqueda de la URL.
  const authCode = url.searchParams.get("code");

  // Si no se proporcionó un código de autorización, devuelve una respuesta con un mensaje de error y un estado HTTP 400.
  if (!authCode) {
    return new Response("No code provided", { status: 400 });
  }

  // Intenta intercambiar el código de autorización por una sesión.
  // Si hay un error, se guardará en la variable "error".
  const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);

  // Si hubo un error al intercambiar el código, devuelve una respuesta con el mensaje de error y un estado HTTP 500.
  if (error) {
    return new Response(error.message, { status: 500 });
  }

  // Si el intercambio fue exitoso, guarda los tokens de acceso y de actualización en las cookies.
  const { access_token, refresh_token } = data.session;
  cookies.set("sb-access-token", access_token, {
    path: "/",
    secure: true,
    httpOnly: true,
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
    secure: true,
    httpOnly: true,
  });

  // Redirige al usuario al dashboard.
  return redirect("/dashboard");
};