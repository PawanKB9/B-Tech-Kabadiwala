"use client"; // Required for Next.js App Router

export default function NotAuthorized() {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>403 - Not Authorized</h1>
      <p>You do not have permission to view this page.</p>
    </div>
  );
}