// Importa el tipo APIRoute desde el módulo "astro".
import type { APIRoute } from "astro";

// Importa el objeto supabase desde el módulo "../../../lib/supabase".
import { supabase } from "../../../lib/supabase";

// Exporta una función asíncrona que se ejecutará cuando se haga una petición POST a esta ruta.
export const POST: APIRoute = async ({ request, redirect }) => {
  // Obtiene los datos del formulario enviados en la petición.
  const formData = await request.formData();
  
  // Obtiene el email y la contraseña del formulario. Si no existen, se devolverán como undefined.
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  // Si no se proporcionaron el email o la contraseña, devuelve una respuesta con un mensaje de error y un estado HTTP 400.
  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  // Intenta registrar al usuario con el email y la contraseña proporcionados.
  // Si hay un error, se guardará en la variable "error".
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  // Si hubo un error al registrar al usuario, devuelve una respuesta con el mensaje de error y un estado HTTP 500.
  if (error) {
    return new Response(error.message, { status: 500 });
  }

  // Si el registro fue exitoso, redirige al usuario a la página de inicio de sesión.
  return redirect("/signin");
};