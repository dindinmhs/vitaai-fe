
import { SignInForm } from "components/auth/signin";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Vita AI" },
    { name: "description", content: "AI untuk kesehatan" },
  ];
}

export default function Home() {
  return <SignInForm/>;
}
