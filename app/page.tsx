"use client";
import { UserMenuWithSession } from "@/features/auth/components/user-menu";
import {authClient} from "@/lib/auth-client";

export default function Home() {
  const {data} = authClient.useSession();
  console.log("Session data: ", data);


  return (
    <>
      <UserMenuWithSession variant="compact" />
      <div>Home page</div>
    </>
  );
}
