"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useFormStatus } from "react-dom";
import {signInWithGitHub} from "../actions/index";
import GithubIcon from "@/assets/icons/github";

export function SubmitButton() {
  const { pending } = useFormStatus();
  let buttonLabel = "Continue with GitHub";
  let buttonIcon = <GithubIcon className="size-6"/>;
  if (pending) {
    buttonLabel = "Redirecting to github ...";
    buttonIcon = <Spinner className="size-6" />;
  }

  return (
    <Button
      type="submit"
      size="lg"
      className="w-full gap-3"
      disabled={pending}
    >
      <span>{buttonLabel}</span>
      {buttonIcon}
    </Button>
  );
}

type GitHubSignInFormProps = {
  callbackUrl: string;

}

export function GithubSignInForm({callbackUrl}: GitHubSignInFormProps) {
  return (
    <form action={signInWithGitHub} className="w-full">
      {callbackUrl ? (<input type="hidden" name="callbackUrl" value={callbackUrl}/>) : null}
      <SubmitButton/>
    </form>
  ) 
}
