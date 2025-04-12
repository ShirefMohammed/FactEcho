import { connectDB, usersModel } from "@/database";
import { ROLES_LIST } from "@/utils/constants";
import bcrypt from "bcrypt";

export async function authorizeCredentials(credentials: any) {
  try {
    if (!credentials?.email || !credentials?.password) {
      throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان");
    }

    await connectDB();

    const user = await usersModel.findUserByEmail(credentials.email);

    if (!user) {
      throw new Error("المستخدم غير موجود");
    }

    // Check if the user registered via OAuth
    if (user.provider && user.provider_user_id) {
      throw new Error("تم تسجيل المستخدم عبر طريقة تسجيل الدخول الخارجية");
    }

    const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

    if (!isPasswordMatch) {
      throw new Error("كلمة المرور غير صحيحة");
    }

    if (!user.is_verified) {
      throw new Error("الحساب غير مفعل");
    }

    // Fetch user avatar for Admin or Author roles
    const userAvatar = [ROLES_LIST.Admin, ROLES_LIST.Author].includes(user.role)
      ? await usersModel.findUserAvatar(user.user_id)
      : null;

    // Return the user object to be included in the token
    return {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: userAvatar,
    };
  } catch (error: any) {
    throw new Error(error.message || "فشل تسجيل الدخول");
    // console.error("Authorization error:", error);
  }
}