"use client";

import { useEffect, useState } from "react";

export default function UserInfoCard({ userId }) {
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    const res = await fetch(`/api/users/${userId}`);
    const data = await res.json();
    setUser(data);
  };

  useEffect(() => { loadUser(); }, []);

  if (!user) return <p>Loading user info...</p>;

  return (
    <div className="border rounded p-3 bg-gray-50 mt-2">
      <p><b>Name:</b> {user.name}</p>
      <p><b>Phone:</b> {user.phone}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Address:</b> {user.address}</p>
    </div>
  );
}
