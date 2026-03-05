import { redirect } from "next/navigation";

// Signup is handled on the login page via toggle
export default function SignUpPage() {
  redirect("/login");
}
