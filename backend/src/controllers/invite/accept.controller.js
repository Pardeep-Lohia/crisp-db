import { Invite } from "../../models/Invite.model.js";
import { CompanyUser } from "../../models/CompanyUser.model.js";

export const acceptInvite = AsyncHandler(async (req, res) => {
  const { token, username, password } = req.body;

  const invite = await Invite.findOne({ token, used: false });

  if (!invite) {
    throw new ApiError(400, "Invalid or expired invite");
  }

  if (invite.expiresAt < new Date()) {
    throw new ApiError(400, "Invite expired");
  }

  // Create employee
  await CompanyUser.create({
    company_id: invite.company_id,
    username,
    email: invite.email,
    password_hash: password,
    role: invite.role,
  });

  invite.used = true;
  await invite.save();

  return res.status(201).json(
    new ApiResponse(201, null, "Employee onboarded successfully")
  );
});
