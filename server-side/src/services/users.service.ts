import { User, Token } from "../models";
import sendMail, { getEmailVerifyHTML, getPasswordResetHTML } from "../utils/sendMail";
import validators from "../utils/validators";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { generateAcctNo, isFieldAvailable, appError, calcBalance, validateRequestData } from "../utils";
import crypto from 'crypto';
import { attachToken, removeToken, signToken } from "../utils/jwt";
import { clientUrl } from "../utils/constants";

class UserService {
    async signup(req: Request): ServiceResponseType {
        const isAdmin = req.url === '/admin-signup';

        if (isAdmin)
            validateRequestData(req, validators.adminSignup);
        else
            validateRequestData(req, validators.signup);

        // Admin key validation
        if (isAdmin && req.body.adminKey !== process.env.ADMIN_KEY)
            throw appError(401, 'Invalid admin key');


        const { first, last, username, email, phone, password } = req.body;

        // Check for existing email or username
        let user = await User.findOne({ email });
        if (user)
            throw appError(409, 'Email already exists');

        user = await User.findOne({ username });
        if (user)
            throw appError(409, 'Username already exists');

        user = await User.create({
            username,
            email,
            password: await bcrypt.hash(password, 10),
            fullName: `${first} ${last}`,
            phone,
            acctNo: await generateAcctNo(),
            isAdmin,
        });

        // Send verification email
        const verifyToken = crypto.randomBytes(32).toString('hex');
        await Token.create({ email, type: 'email', token: verifyToken });

        const message = getEmailVerifyHTML(user.fullName, `${clientUrl}/auth/verify-email/${verifyToken}`);
        sendMail(email, 'FinEase: Email Verification', message);

        return {
            statusCode: 201,
            message: "User created successfully",
            data: { userId: user.id }
        };
    }

    async login(req: Request, res: Response): ServiceResponseType {
        const { emailOrUsername, password } = validateRequestData(req, validators.login);

        // check if user exists
        const user = await User.findOne({ email: emailOrUsername }) || await User.findOne({ username: emailOrUsername });
        if (!user) {
            throw appError(400, "Invalid credentials");
        }

        // check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw appError(400, "Invalid credentials");
        }

        const token = signToken(user);
        attachToken(res, token);

        return {
            message: 'Login successful',
            data: { token }
        }
    }

    async logout(req: Request, res: Response): ServiceResponseType {
        removeToken(res);
        return {
            message: 'Logged out successfully'
        }
    }

    async isAvailable(req: Request): ServiceResponseType {
        const { field, value } = req.params;
        const available = await isFieldAvailable(field, value);

        if (!available)
            throw appError(409, `${field} is not available`);

        return { message: `${field} is available` };
    }

    async verifyEmail(req: Request): ServiceResponseType {
        const { verifyId } = req.params;
        const token = await Token.findOne({ type: 'email', token: verifyId });
        if (!token) throw appError(400, 'The verification link is invalid');

        const user = await User.findOne({ email: token.email });
        if (!user) throw appError(404, 'User not found');

        if (user.emailVerified) throw appError(400, 'Email already verified');

        user.emailVerified = true;
        await user.save();

        const htmlMessage = `<h1>Hi ${user.fullName}, welcome to FinEase!</h1>`;
        sendMail(user.email, 'Welcome to FinEase', htmlMessage);
        token.deleteOne();
        return { message: 'Email verified successfully' };
    }

    async sendPasswordResetLink(req: Request): ServiceResponseType {
        const { email } = validateRequestData(req, validators.forgotPassword);

        const user = await User.findOne({ email });

        if (!user) throw { statusCode: 404, message: "User with given email does not exist" }

        const resetToken = crypto.randomBytes(32).toString('hex');
        await Token.findOneAndUpdate(
            { email, type: 'password' },
            { token: resetToken, expires: Date.now() + 10 * 60 * 1000 },
            { upsert: true }
        );

        const resetLink = `${clientUrl}/auth/reset-password/${resetToken}`;
        sendMail(email, 'Finease: Password Reset', getPasswordResetHTML(user.fullName, resetLink));
        return { statusCode: 200, message: 'Check your email for password reset link' };
    }

    async resetPassword(req: Request): ServiceResponseType {
        const { password } = validateRequestData(req, validators.resetPassword);
        const { resetId } = req.params;

        const token = await Token.findOne({ token: resetId, type: 'password', expires: { $gt: Date.now() } });
        if (!token) throw appError(404, 'Invalid or expired token');

        const user = await User.findOne({ email: token.email });
        if (!user) throw appError(404, 'User not found');

        user.password = await bcrypt.hash(password, 10);
        await user.save();
        await token.deleteOne();

        return {
            message: 'Password reset successful'
        };
    }

    async allUsers(req: Request): ServiceResponseType {
        console.log(123);
        const requiredInfo = '_id username fullName email phone acctNo createdAt';
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const users = await User
            .find()
            .select(requiredInfo)
            .limit(limit)
            .skip(limit * (page - 1));

        const totalUsers = await User.countDocuments();

        return {
            message: "All registered users" + (req.query.limit ? ` (page ${req.query.page})` : ''),
            data: {
                totalUsers,
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
                users
            }
        }
    }

    async me(req: Request): ServiceResponseType {
        return {
            message: "Logged in user",
            data: { user: req.user }
        }
    }

    async getBalance(req: Request) {
        const user = req.user.id;
        const balance = await calcBalance(user);
        return {
            data: { balance },
            message: "User account balance"
        }
    }

    async getUserFullName(req: Request) {
        const { acctNoOrUsername } = req.query;
        if (!acctNoOrUsername) throw appError(400, 'acctNoOrUsername is required');
        const user = await User.findOne({ acctNo: acctNoOrUsername }).select('fullName') || await User.findOne({ username: acctNoOrUsername }).select('fullName');
        if (!user) throw appError(404, 'User not found');
        return { data: { fullName: user.fullName }, message: "User fullname" }
    }

    async updateUser(req: Request) {
        const { first, last, phone, email, password, oldPassword } = validateRequestData(req, validators.updateUser);
        const user = await User.findById(req.user.id);

        if (!user) throw appError(404, 'User not found');

        if (first || last) {
            if (!first) {
                user.fullName = `${user.fullName.split(' ')[0]} ${last}`;
            } else if (!last) {
                user.fullName = `${first} ${user.fullName.split(' ')[1]}`;
            } else {
                user.fullName = `${first} ${last}`;
            }
        }
        user.phone = phone || user.phone;
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser.id !== user.id) {
                throw appError(409, 'Email is not available');
            } else {
                user.email = email;
            }
        }
        if (password) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) throw appError(401, 'Old password is incorrect');

            user.password = await bcrypt.hash(password, 10);
        }
        await user.save();
        return {
            message: 'User updated successfully',
            data: { user }
        };
    }

    async accountInfo(req: Request) {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password -__v -updatedAt');

        if (!user) throw appError(404, "User not found");

        return {
            message: "User profile",
            data: {
                user: {
                    ...user.toJSON(),
                    balance: await calcBalance(userId)
                },
            }
        }
    }

}

const userServices = new UserService();
export default userServices;
