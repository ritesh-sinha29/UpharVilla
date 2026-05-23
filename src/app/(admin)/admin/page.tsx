"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const AdminHomePage = () => {
  const { data: session } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);

  if (!session && session !== undefined) {
    <div className="">
      <p>Unauthenticated.</p>
    </div>;
  }
  return (
    <div className="min-h-screen bg-background p-2">
      <h1 className="font-serif font-semibold text-xl">
        Welcome {session?.user?.name}
      </h1>
    </div>
  );
};

export default AdminHomePage;
