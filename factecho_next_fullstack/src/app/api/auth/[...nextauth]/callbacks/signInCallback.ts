import { connectDB, usersModel } from "@/database";

export async function signInCallback(account: any, profile: any) {
  if (account?.provider === "google") {
    try {
      await connectDB();

      const name = profile.name;
      const email = profile.email;
      const provider = account.provider;
      const provider_user_id = profile.sub || profile.id;

      if (!name || !email || !provider || !provider_user_id) {
        throw new Error("Missing required OAuth fields");
      }

      let user = await usersModel.findUserByOAuth(provider, provider_user_id);

      if (!user) {
        await usersModel.createUser({
          name,
          email,
          is_verified: true,
          provider,
          provider_user_id,
        });
      }

      return true;
    } catch (error) {
      // console.error("OAuth google signIn error:", error);
      return false;
    }
  }

  if (account?.provider === "facebook") {
    try {
      await connectDB();

      const name = profile.name;
      const provider = account.provider;
      const provider_user_id = profile.sub || profile.id;

      if (!name || !provider || !provider_user_id) {
        throw new Error("Missing required OAuth fields");
      }

      let user = await usersModel.findUserByOAuth(provider, provider_user_id);

      if (!user) {
        await usersModel.createUser({
          name,
          is_verified: true,
          provider,
          provider_user_id,
        });
      }

      return true;
    } catch (error) {
      // console.error("OAuth facebook signIn error:", error);
      return false;
    }
  }

  return true;
}
