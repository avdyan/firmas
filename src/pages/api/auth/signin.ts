// Importa el tipo APIRoute desde el módulo "astro".
import type { APIRoute } from "astro";

// Importa el objeto supabase desde el módulo "../../../lib/supabase".
import { supabase } from "../../../lib/supabase";

// Importa el tipo Provider desde el módulo "@supabase/supabase-js".
import type { Provider } from "@supabase/supabase-js";

// Exporta una función asíncrona que se ejecutará cuando se haga una petición POST a esta ruta.
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // Obtiene los datos del formulario enviados en la petición.
  const formData = await request.formData();
  
  // Obtiene el email, la contraseña y el proveedor del formulario. Si no existen, se devolverán como undefined.
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const provider = formData.get("provider")?.toString();

  // Si se proporcionó un proveedor, intenta iniciar sesión con OAuth.
  if (provider) {
    // Intenta iniciar sesión con el proveedor proporcionado.
    // Si hay un error, se guardará en la variable "error".
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        // Redirige al usuario a la URL de callback dependiendo del entorno.
        redirectTo: import.meta.env.DEV
          ? "http://localhost:4321/api/auth/callback"
          : "https://https://firmas-three.vercel.app/api/auth/callback",
      },
    });

    // Si hubo un error al iniciar sesión, devuelve una respuesta con el mensaje de error y un estado HTTP 500.
    if (error) {
      return new Response(error.message, { status: 500 });
    }

    // Si el inicio de sesión fue exitoso, redirige al usuario a la URL proporcionada por el proveedor de OAuth.
    return redirect(data.url);
  }

  // Si no se proporcionaron el email o la contraseña, devuelve una respuesta con un mensaje de error y un estado HTTP 400.
  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  // Intenta iniciar sesión con el email y la contraseña proporcionados.
  // Si hay un error, se guardará en la variable "error".
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Si hubo un error al iniciar sesión, devuelve una respuesta con el mensaje de error y un estado HTTP 500.
  if (error) {
    return new Response(error.message, { status: 500 });
  }

  // Si el inicio de sesión fue exitoso, guarda los tokens de acceso y de actualización en las cookies.
  const { access_token, refresh_token } = data.session;
  cookies.set("sb-access-token", access_token, {
    sameSite: "strict",
    path: "/",
    secure: true,
  });
  cookies.set("sb-refresh-token", refresh_token, {
    sameSite: "strict",
    path: "/",
    secure: true,
  });

  // Redirige al usuario al dashboard.
  return redirect("/dashboard");
};