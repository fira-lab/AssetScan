import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/forum(.*)"]);
const isAdminSubRoute = createRouteMatcher(["/adminSub(.*)"]);

const middleware = clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // Handle protected routes
  if (isProtectedRoute(req)) {
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }

  // Handle admin sub-route
  if (isAdminSubRoute(req)) {
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    try {
      const clerkResponse = await fetch(
        `https://api.clerk.dev/v1/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        }
      );

      if (!clerkResponse.ok) {
        throw new Error(`Failed to fetch Clerk user: ${clerkResponse.status}`);
      }

      const clerkUser = await clerkResponse.json();
      const userRole = clerkUser.public_metadata?.role || "user";

      if (userRole !== "admin") {
        // Respond with 403 Forbidden for non-admin users
        return new NextResponse("Access denied: Admins only", { status: 403 });
      }
    } catch (error) {
      console.error("Error during authorization or fetching user:", error);
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }

  // Allow all other requests
  return NextResponse.next();
});

export default middleware;

export const config = {
  matcher: [
    // Match all routes except static files, Next.js internals, and API routes
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
