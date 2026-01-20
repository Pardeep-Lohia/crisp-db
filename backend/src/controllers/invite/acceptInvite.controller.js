import { Invite } from "../../models/Invite.model.js";
import { CompanyUser } from "../../models/CompanyUser.model.js";
import ApiResponse from "../../utils/ApiResponse.util.js";
import ApiError from "../../utils/ApiError.util.js";
import AsyncHandler from "../../utils/AsyncHandler.util.js";

// =========================
// Accept Invite & Signup Employee
// =========================
export const accept_invite_and_signup = AsyncHandler(async (req, res) => {
  const { token, username, password } = req.body;

  if (!token || !username || !password) {
    throw new ApiError(400, "Token, username and password are required");
  }

  // 🔍 Find invite
  const invite = await Invite.findOne({ token, used: false });

  if (!invite) {
    throw new ApiError(400, "Invalid or expired invite");
  }

  if (invite.expiresAt < new Date()) {
    throw new ApiError(400, "Invite has expired");
  }

  // ❌ Prevent duplicate account
  const existingUser = await CompanyUser.findOne({ email: invite.email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  // ✅ Create employee
  const employee = await CompanyUser.create({
    company_id: invite.company_id,
    username,
    email: invite.email, // 🔑 from invite
    password_hash: password,
    role: invite.role, // company_agent
  });

  // ✅ Mark invite as used
  invite.used = true;
  await invite.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        _id: employee._id,
        username: employee.username,
        email: employee.email,
        role: employee.role,
      },
      "Employee onboarded successfully"
    )
  );
});
