import { LoginPage } from "~/pages/login/login";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Vita AI" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <LoginPage />;
}
