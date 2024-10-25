import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/sign-in", "/advisor/sign-in", "/advisor/sign-up"];

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    if(request.nextUrl.pathname.includes('api')){
      return response;
    }

    // redirect to home if user is authenticated
    if (authRoutes.includes(request.nextUrl.pathname) && !user.error) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    // redirect to advisor home if user is an advisor
    if (!request.nextUrl.pathname.includes('advisor') && user.data.user && user?.data.user?.user_metadata.userType === "advisor") {
      return NextResponse.redirect(new URL("/advisor/home", request.url));
    }

    // redirect to home if user is not an advisor
    if (request.nextUrl.pathname.includes('advisor') && user.data.user && user?.data.user?.user_metadata.userType !== "advisor") {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
