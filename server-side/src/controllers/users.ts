import { Request, Response } from "express";
import User from "../models/users";
import * as validators from "../utils/validators";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAcctNo, isFieldAvailable } from "../utils/utils";
import { calcBalance } from "../utils/utils";

export async function signup(req: Request, res: Response) {
  const isAdmin = req.url === '/admin-signup';
  try {
    let error;
    if (isAdmin) {
      error = validators.adminSignup.validate(req.body, validators.options).error;
    } else {
      error = validators.signup.validate(req.body, validators.options).error;
    }

    if (error) {
      res.status(400);
      return res.json({
        success: false,
        message: error.message,
        error: 'Bad request'
      });
    }

    if (isAdmin) {
      // check if admin key is valid
      if (req.body.adminKey !== process.env.ADMIN_KEY) {
        res.status(401);
        return res.json({
          success: false,
          message: 'Invalid admin key',
          error: 'Unauthorized'
        });
      }
    }

    const { first, last, username, email, phone, password } = req.body;

    // check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      res.status(409);
      return res.json({
        success: false,
        message: 'Email already exists',
        error: 'Conflict'
      });
    }

    user = await User.findOne({ username });

    if (user) {
      res.status(409);
      return res.json({
        success: false,
        message: 'Username already exists',
        error: 'Conflict'
      });
    }

    // create user
    await User.create({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      fullName: `${first} ${last}`,
      phone,
      acctNo: await generateAcctNo(),
      isAdmin
    })

    res.status(201);
    res.json({
      success: true,
      message: "User created successfully",
    })
  }

  catch (error: any) {
    console.error(error);
    res.status(500)
    return res.json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { error } = validators.login.validate(req.body, validators.options);
    if (error) {
      res.status(400);
      return res.json({
        message: error.message,
        error: "Bad request"
      });
    }

    const { emailOrUsername, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email: emailOrUsername }) || await User.findOne({ username: emailOrUsername });
    if (!user) {
      res.status(401);
      return res.json({
        success: false,
        message: "Invalid credentials",
        error: "Unauthorized"
      });
    }

    // check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      return res.json({
        success: false,
        message: "Invalid credentials",
        error: "Unauthorized"
      })
    }

    // grant user a token
    const secretKey = process.env.JWT_SECRET as string;
    const expiresIn = Number(process.env.JWT_EXPIRES_IN) * 3600;

    const jwtPayload = {
      id: user._id,
      isAdmin: user.isAdmin,
      username: user.username
    };

    const token = jwt.sign(jwtPayload, secretKey, { expiresIn });

    // attach the token to the headers; save in cookies
    res.setHeader('Authorization', `Bearer ${token}`);
    res.cookie('token', token, { maxAge: expiresIn * 1000, httpOnly: true });

    res.status(200);
    return res.json({
      success: true,
      message: "Login successful",
      token
    })
  }

  catch (error: any) {
    console.error(error);
    res.status(500)
    return res.json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}

export async function accountInfo(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password -__v -updatedAt');

    if (!user) {
      res.status(404);
      return res.json({
        success: false,
        message: "User not found",
        error: "Not found"
      })
    }

    return res.json({
      success: true,
      message: "User profile",
      user: {
        ...user.toJSON(),
        balance: await calcBalance(userId)
      }
    })
  }

  catch (error: any) {
    console.error(error);
    res.status(500)
    return res.json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}

export function logout(req: Request, res: Response) {
  res.clearCookie('token');
  res.json({
    message: 'Logged out successfully',
  });
}

export function me(req: Request, res: Response) {
  return res.json({
    success: true,
    message: "Logged in user",
    me: req.user
  })
}

export async function allUsers(req: Request, res: Response) {
  try {
    const requiredInfo = '_id username fullName email phone acctNo createdAt';
    const users = await User.find().select(requiredInfo);
    res.status(200);
    return res.json({
      success: true,
      message: "All registered users",
      users
    })

  }
  catch (error: any) {
    console.error(error);
    res.status(500)
    return res.json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}

export async function getBalance(req: Request, res: Response) {
  try {
    const user = req.user.id;
    const balance = await calcBalance(user);
    return res.json(
      {
        success: true,
        balance
      }
    )
  }
  catch (error: any) {
    console.error(error);
    res.status(500);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}

export async function isAvailable(req: Request, res: Response) {
  try {
    const { field, value } = req.params;
    const available = await isFieldAvailable(field, value);

    if (available) {
      return res.json({ message: `${field} is available` });
    } else {
      return res.status(409).json({ message: `${field} is not available` });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUserFullName(req: Request, res: Response) {
  try {
    const { acctNoOrUsername } = req.query;
    const user = await User.findOne({ acctNo: acctNoOrUsername }).select('fullName') || await User.findOne({ username: acctNoOrUsername }).select('fullName');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.send(user.fullName);

  } catch (error) { /* empty */ }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { error } = validators.updateUser.validate(req.body, validators.options);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { first, last, phone, email, password, oldPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(409).json({ message: 'Email already exists' });
      } else {
        user.email = email;
      }
    }
    if (password) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Old password is incorrect!' });
      }
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    return res.json({
      message: 'User updated successfully',
      user
    });

  } catch (error: any) {
    console.error(error);
    res.status(500);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}