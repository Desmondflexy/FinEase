import User from "../models/users";
import sendMail, { getEmailVerifyHTML, getPasswordResetHTML } from "../utils/sendMail";
import validators from "../utils/validators";
import { Request } from "express";
import bcrypt from 'bcryptjs';
import { generateAcctNo, isFieldAvailable, appError, calcBalance } from "../utils/utils";
import Token from "../models/token";
import crypto from 'crypto';
import { signToken } from "../utils/jwt";
import { clientUrl } from "../utils/constants";

class UserService {
    async signup(req: Request) {
        const isAdmin = req.url === '/admin-signup';

        // Validate the request body
        const error = isAdmin
            ? validators.adminSignup.validate(req.body, validators.options).error
            : validators.signup.validate(req.body, validators.options).error;

        if (error)
            throw { statusCode: 400, message: error.message };

        // Admin key validation
        if (isAdmin && req.body.adminKey !== process.env.ADMIN_KEY)
            throw { statusCode: 401, message: 'Invalid admin key' };


        const { first, last, username, email, phone, password } = req.body;

        // Check for existing email or username
        let user = await User.findOne({ email });
        if (user)
            throw { statusCode: 409, message: 'Email already exists' };

        user = await User.findOne({ username });
        if (user)
            throw { statusCode: 409, message: 'Username already exists' };

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
            userId: user.id
        };
    }

    async login(req: Request) {
        const { error } = validators.login.validate(req.body, validators.options);
        if (error) {
            throw { statusCode: 400, message: error.message }
        }

        const { emailOrUsername, password } = req.body;

        // check if user exists
        const user = await User.findOne({ email: emailOrUsername }) || await User.findOne({ username: emailOrUsername });
        if (!user) {
            throw { statusCode: 401, message: "Invalid credentials" }
        }

        // check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw { statusCode: 401, message: "Invalid credentials" }
        }

        const token = signToken(user);

        return {
            statusCode: 200,
            message: 'Login successful',
            token
        }
    }

    async logout(req: Request) {
        return {
            statusCode: 200,
            message: 'Logged out successfully'
        }
    }

    async isAvailable(req: Request) {
        const { field, value } = req.params;
        const available = await isFieldAvailable(field, value);

        if (available) {
            return { statusCode: 200, message: `${field} is available` };
        } else {
            throw { statusCode: 409, message: `${field} is not available` }
        }
    }

    async verifyEmail(req: Request) {
        const { verifyId } = req.params;
        const token = await Token.findOne({ type: 'email', token: verifyId });
        if (!token) throw { statusCode: 400, message: 'The verification link is invalid' };
        const user = await User.findOne({ email: token.email });
        if (!user) throw { statusCode: 404, message: 'User not found' }
        if (user.emailVerified) throw { statusCode: 400, message: 'Email is already verified' };

        user.emailVerified = true;
        await user.save();

        const htmlMessage = `<h1>Hi ${user.fullName}, welcome to FinEase!</h1>`;
        sendMail(user.email, 'Welcome to FinEase', htmlMessage);
        token.deleteOne();
        return { statusCode: 200, message: 'Email verified successfully' };
    }

    async sendPasswordResetLink(req: Request) {
        const { error } = validators.forgotPassword.validate(req.body, validators.options);
        if (error) throw { statusCode: 400, message: error.message };

        const { email } = req.body;
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

    async resetPassword(req: Request) {
        const { error } = validators.resetPassword.validate(req.body, validators.options);
        if (error) throw appError(400, error.message);

        const { password } = req.body;
        const { resetId } = req.params;

        const token = await Token.findOne({ token: resetId, type: 'password', expires: { $gt: Date.now() } });
        if (!token) throw appError(404, 'Invalid or expired token');

        const user = await User.findOne({ email: token.email });
        if (!user) throw appError(404, 'User not found');

        user.password = await bcrypt.hash(password, 10);
        await user.save();
        await token.deleteOne();

        return {
            statusCode: 200,
            message: 'Password reset successful'
        };
    }

    async allUsers(req: Request) {
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
            statusCode: 200,
            message: "All registered users" + (req.query.limit ? ` (page ${req.query.page})` : ''),
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            users
        }
    }

    async me(req: Request) {
        return {
            statusCode: 200,
            message: "Logged in user",
            data: req.user
        }
    }

    async getBalance(req: Request) {
        const user = req.user.id;
        const balance = await calcBalance(user);
        return { data: { balance }, statusCode: 200, message: "User account balance" }
    }

    async getUserFullName(req: Request) {
        const { acctNoOrUsername } = req.query;
        const user = await User.findOne({ acctNo: acctNoOrUsername }).select('fullName') || await User.findOne({ username: acctNoOrUsername }).select('fullName');
        if (!user) throw appError(404, 'User not found');
        return { data: { fullName: user.fullName }, statusCode: 200, message: "User full name" }
    }

    async updateUser(req: Request) {
        const { error } = validators.updateUser.validate(req.body, validators.options);
        if (error) throw appError(400, error.message);

        const { first, last, phone, email, password, oldPassword } = req.body;
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
            statusCode: 200,
            message: 'User updated successfully',
            data: user
        };
    }

    async accountInfo(req:Request) {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password -__v -updatedAt');

        if (!user) throw appError(404, "User not found");

        return {
            message: "User profile",
            data: {
                ...user.toJSON(),
                balance: await calcBalance(userId)
            },
            statusCode: 200
        }
    }

}

const userServices = new UserService();
export default userServices;
