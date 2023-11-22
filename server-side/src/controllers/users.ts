import { Request, Response } from "express";
import User from "../models/users";
import * as validators from "../utils/validators";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAcctNo } from "../utils/utils";

export async function signup(req: Request, res: Response) {
  try {
    const { error } = validators.signup.validate(req.body, validators.options);

    if (error) {
      res.status(400);
      return res.json({
        success: false,
        message: error.message,
        error: 'Bad request'
      });
    }

    const { first, last, email, phone, password } = req.body;

    // check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      res.status(409);
      return res.json({
        success: false,
        message: 'User already exists',
        error: 'Conflict'
      });
    }

    // create user
    user = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
      fullName: `${first} ${last}`,
      phone,
      acctNo: await generateAcctNo(),
    })

    res.status(201);
    res.json({
      success: true,
      message: "User created successfully",
      data: user
    })
  }

  catch (error: any) {
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

    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      return res.json({
        success: false,
        message: "Email not found",
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
    
    const payload = {
      id: user._id,
      isAdmin: user.isAdmin
    };

    const token = jwt.sign(payload, secretKey, { expiresIn });

    // attach the token to the headers; save in cookies
    res.setHeader('Authorization', `Bearer ${token}`);
    res.cookie('token', token, { maxAge: expiresIn * 1000, httpOnly: true });

    res.status(200);
    return res.json({
      success: true,
      message: "Login successful",
      data: token
    })
  }

  catch (error: any) {
    res.status(500)
    return res.json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}

export async function profile(req: Request, res: Response) {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      return res.json({
        success: false,
        message: "User not found",
        error: "Not found"
      })
    }

    res.status(200);
    return res.json({
      success: true,
      message: "User profile",
      data: user
    })
  }

  catch (error: any) {
    res.status(500)
    return res.json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('token');
  res.json({
    message: 'Logged out successfully',
    data: 'none',
  });
}


export async function adminSignup(req: Request, res: Response) {
  try {
    const { error } = validators.adminSignup.validate(req.body, validators.options);

    if (error) {
      res.status(400);
      return res.json({
        success: false,
        message: error.message,
        error: 'Bad request'
      });
    }

    const { first, last, email, phone, password, adminKey } = req.body;

    // check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      res.status(409);
      return res.json({
        success: false,
        message: 'User already exists',
        error: 'Conflict'
      });
    }

    // check if admin key is valid
    if (adminKey !== process.env.ADMIN_KEY) {
      res.status(401);
      return res.json({
        success: false,
        message: 'Invalid admin key',
        error: 'Unauthorized'
      });
    }

    // create user
    user = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
      fullName: `${first} ${last}`,
      phone,
      acctNo: await generateAcctNo(),
      isAdmin: true
    })

    res.status(201);
    res.json({
      success: true,
      message: "User created successfully",
      data: user
    })
  }

  catch (error: any) {
    res.status(500)
    return res.json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}