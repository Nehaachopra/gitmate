"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useFormStatus } from "react-dom";
import {signInWithGitHub} from "../actions/index";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.09 3.29 9.41 7.86 10.94.58.1.79-.25.79-.56v-2.17c-3.2.69-3.88-1.38-3.88-1.38-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.76 2.67 1.25 3.32.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.44-2.27 1.17-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.14 1.18a10.8 10.8 0 0 1 5.72 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.73.81 1.17 1.83 1.17 3.08 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.04.78 2.11v3.13c0 .31.21.67.8.56A11.53 11.53 0 0 0 23.5 12C23.5 5.66 18.35.5 12 .5Z" />
    </svg>
  );
}

export function SubmitButton() {
  const { pending } = useFormStatus();
  let buttonLabel = "Continue with GitHub";
  let buttonIcon = <GitHubIcon />;
  if (pending) {
    buttonLabel = "Redirecting to github ...";
    buttonIcon = <Spinner className="size-4" />;
  }

  return (
    <Button
      type="submit"
      variant="outline"
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
