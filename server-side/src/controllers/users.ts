import { Request, Response } from "express";
import User from "../models/users";
import * as validators from "../utils/validators";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function signup(req: Request, res: Response) {
  try {
    const { error } = validators.signup.validate(req.body, validators.options);

    if (error) {
      res.status(400);
      return res.json({
        message: 'Bad request',
        error: error.message
      });
    }

    const { first, last, email, phone, password } = req.body;

    // check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      res.status(409);
      return res.json({
        success: false,
        message: 'Conflict',
        error: 'User already exists'
      });
    }

    // create user
    user = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
      fullName: `${first} ${last}`,
      phone
    })

    res.status(201);
    res.json({
      success: true,
      message: "User created",
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
        message: 'Bad request',
        error: error.message
      });
    }

    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      return res.json({
        success: false,
        message: "Unauthorized",
        error: "Invalid credentials"
      });
    }

    // check if password matches
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401);
      return res.json({
        success: false,
        message: "Unauthorized",
        error: "Invalid credentials"
      })
    }

    // grant user a token
    const secretKey = process.env.JWT_SECRET as string;
    const expiresIn = Number(process.env.JWT_EXPIRES_IN);
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: expiresIn * 3600 });

    // attach the token to the headers; save in cookies
    res.setHeader('Authorization', `Bearer ${token}`);
    res.cookie('token', token, { maxAge: expiresIn * 3600 * 1000, httpOnly: true });

    res.status(200);
    return res.json({
      success: true,
      message: "User logged in",
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
        message: "Not found",
        error: "User not found"
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