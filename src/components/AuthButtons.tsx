"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn, signOut } from "next-auth/react";

const AuthButtons = ({ authed }: { authed: boolean }) => {
  return authed ? (
    <div>
      <Button variant={"outline"} onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  ) : (
    <div>
      <Button variant={"outline"} onClick={() => signIn("google")}>
        Sign In
      </Button>
    </div>
  );
};

export default AuthButtons;
