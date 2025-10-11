import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {User} from '../models/user.model.js'
import colors from '../../ansiColoring.js'

dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET;

// signup thing
export const signup=async(req, res)=>{
    try{
        const {name, mailId, password}=req.body;

        const existingUser=await User.findOne({mailId});
        if(existingUser){
            return res.status(401).json({message: "User already exists"});
        }

        const hashedPassword=await bcrypt.hash(password, 12);

        // save a user
        const newUser=new User({
            name,
            mailId,
            password: hashedPassword,
        });
        await newUser.save();
        req.status(201).json({message: "User created successfully"});
    }
    catch(err){
        console.error(colors.red(err));
        res.status(500).json({message: "Something went wrong"});
    }
}


// signin thing
export const signin=async(req, res)=>{
    try{
        const {mailId, password}=req.body;
        // check user exists
        const user = await User.findOne({ mailId });
        if (!user) return res.status(400).json({ message: "User not found" });

        // check password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: "Invalid password" });

        // create JWT
        const token = jwt.sign({ id: user._id, mailId: user.mailId }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "Login successful", token });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
