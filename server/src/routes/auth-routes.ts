import { Router, Request, Response } from "express";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const singleUser = await User.findOne({
    where: {
      username: username,
    },
  });
  
  console.log(singleUser)

  if (!singleUser) {
    res.sendStatus(400);
    return;
  }
  const isValidPassword = await bcrypt.compare(password, singleUser.password);

  if (!isValidPassword) {
    res.sendStatus(400);
    return;
  }
const secretKey = process.env.JWT_SECRET_KEY || '';
const token = jwt.sign({username, id:singleUser.id}, secretKey,{
  expiresIn:"2h"
});
console.log({token:token})
return res.json({token:token});
};

const router = Router();

// POST /login - Login a user
router.post("/login", login);

export default router;
