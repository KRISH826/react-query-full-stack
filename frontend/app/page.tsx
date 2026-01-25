"use client"

import { useGetUsersQuery } from "@/services/userApi";

export default function Home() {
  const { data, isLoading, error } = useGetUsersQuery()
  return (
    <div>
      <h1 className="text-3xl font-bold underline text-violet-500">Home</h1>
      {isLoading && <p>Loading...</p>}
      {error && (
        <p>
          Error:{" "}
          {"status" in error
            ? `Status: ${error.status} ${JSON.stringify(error.data)}`
            : error.message}
        </p>
      )}
      {data && (
        <ul>
          {data.map((user) => (
            <li key={user.id}>{user.firstName} {user.lastName}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
