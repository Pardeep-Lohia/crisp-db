import crypto from "crypto";
import { Invite } from "../../models/Invite.model.js";
import ApiResponse from "../../utils/ApiResponse.util.js";
import ApiError from "../../utils/ApiError.util.js";
import AsyncHandler from "../../utils/AsyncHandler.util.js";

export const sendInvite = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Employee email is required");
  }

  // 🔑 company_id from JWT (VERY IMPORTANT)
  const company_id = req.user.company_id;

  // Generate secure token
  const token = crypto.randomBytes(32).toString("hex");

  // Invite expiry (48 hours)
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  const invite = await Invite.create({
    email,
    company_id,
    token,
    expiresAt,
  });

  // 📨 Here you send email (later)
  const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;

  return res.status(201).json(
    new ApiResponse(
      201,
      { inviteLink },
      "Invite sent successfully"
    )
  );
});
