import { CompanyUser } from '../models/CompanyUser.model.js';
import { Company } from '../models/Company.model.js';
import AsyncHandler from '../utils/AsyncHandler.util.js';
import ApiError from '../utils/ApiError.util.js';
import ApiResponse from '../utils/ApiResponse.util.js';
import HTTP_STATUS from '../constants/httpStatusCodes.constant.js';

/**
 * Generate Access and Refresh Tokens
 */
export const generateTokens = async (user) => {
  if (!user) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'User is required for token generation'
    );
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refresh_token = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

/**
 * Login Controller
 */
export const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate request payload
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  // Retrieve user by email
  const user = await CompanyUser.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Validate password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateTokens(user);

  // Configure secure cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'none',
  };

  res
    .cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: Number(process.env.ACCESS_COOKIE_MAX_AGE),
    })
    .cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: Number(process.env.REFRESH_COOKIE_MAX_AGE),
    });

  // Send response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone_number : user.phone_number,
        role: user.role,
        company_id: user.company_id
      },
      'Login successful'
    )
  );
});
