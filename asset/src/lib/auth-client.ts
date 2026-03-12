import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient();

await authClient.signIn.email({
  email: "test@user.com",
  password: "password1234",
});
