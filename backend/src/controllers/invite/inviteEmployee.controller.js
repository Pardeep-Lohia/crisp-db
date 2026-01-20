import crypto from "crypto";
import { Invite } from "../../models/Invite.model.js";
import { CompanyUser } from "../../models/CompanyUser.model.js";
import ApiResponse from "../../utils/ApiResponse.util.js";
import ApiError from "../../utils/ApiError.util.js";
import AsyncHandler from "../../utils/AsyncHandler.util.js";

// =========================
// Invite Employee from the same Company
// =========================
export const invite_employee_from_same_company = AsyncHandler(
  async (req, res) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Employee email is required");
    }

    // ✅ Allow only admin & super admin
    if (!["super_admin", "company_admin"].includes(req.user.role)) {
      throw new ApiError(403, "You are not allowed to invite employees");
    }

    const company_id = req.user.company_id;

    // ❌ Prevent inviting existing user
    const existingUser = await CompanyUser.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User already exists with this email");
    }

    // ❌ Prevent duplicate active invite
    const existingInvite = await Invite.findOne({
      email,
      company_id,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (existingInvite) {
      throw new ApiError(400, "Invite already sent to this email");
    }

    // 🔑 Generate secure token
    const token = crypto.randomBytes(32).toString("hex");

    // ⏱ Invite expiry (48 hours)
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    // ✅ Create invite
    await Invite.create({
      email,
      company_id,
      token,
      expiresAt,
      role: "company_agent",
    });

    // 📨 Invite link (frontend)
    const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;

    return res.status(201).json(
      new ApiResponse(
        201,
        { inviteLink },
        "Invite sent successfully"
      )
    );
  }
);
