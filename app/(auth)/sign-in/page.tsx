import React from "react";
import Image from "next/image";
import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { GithubSignInForm } from "../../../features/auth/components/github-sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in with your GitHub account",
};

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const { callbackUrl } = await searchParams;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted px-6">
      <Card className="relative z-10 w-full max-w-md border-border/50 bg-card/80 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center">
            <div>
              <Image
                src="/images/gitmate-logo-with-text.png"
                alt="GitMate"
                width={160}
                height={160}
                className="block dark:hidden w-auto"
              />
              <Image
                src="/images/gitmate-logo-with-text-dark.png"
                alt="GitMate"
                width={200}
                height={200}
                className="hidden dark:block w-auto"
              />
            </div>
          </div>

          <div>
            
            <CardDescription className="mt-2 text-base">
              Sign in to continue
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <GithubSignInForm callbackUrl={callbackUrl ?? ""} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or sign in using
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>

                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </Link>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <Button className="w-full" variant={"outline"} size="lg">
            Sign In
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/"
              className="font-medium text-foreground hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignInPage;
