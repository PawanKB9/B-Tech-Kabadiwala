// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt"; // only if using next-auth

// export async function middleware(req) {
//   const token = await getToken({ req });  // Contains user + role if logged in
//   const { pathname } = req.nextUrl;

//   // Only protect /admin routes
//   if (pathname.startsWith("/Admin")) {
//     // 1. Not logged in → send to login
//     if (!token) {
//       const loginUrl = new URL('/login', req.url);
//       return NextResponse.redirect(loginUrl);
//     }

//     // 2. Logged in but NOT admin → send to not-authorized
//     if (token.role !== "Admin") {
//       const notAuthUrl = new URL('/not-authorized', req.url);
//       return NextResponse.redirect(notAuthUrl);
//     }

//     // 3. Logged in & admin, visiting /admin (root) → redirect to orderStatus
//     if (pathname === "/Admin") {
//       return NextResponse.redirect(new URL("/Admin/orderStatus", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/Admin/:path*", "/Admin"],
// };


import { NextResponse } from "next/server";

export function middleware() {
  // TEMPORARILY ALLOW ALL /admin ROUTES
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
