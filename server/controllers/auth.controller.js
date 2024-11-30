import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';



//Sign Up Control Starts

export const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        //Email and Username Validation
        const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email Format" })
        }

        const existingEmail = await User.findOne({ email: email }) // or check with UserName Also
        if (existingEmail) {
            return res.status(400).json({ error: "Already Exisiting user or Email" })
        }

        if (password.length < 8) {
            return res.status(400).json({ error: "Password must have atleast 8 characters length" });
        }

        //hashing the password
        //123456=cncsbbdhjdjhj

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();
            res.status(200).json({ message: "Signup sucessfully" });
        } else {
            res.status(400).json({ error: "Invalid User Data" })
        }

    } catch (error) {
        console.log(`Error in SignUp ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

//Sign Up Control Ends



//Login Control Starts

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid Username or Password" })
        }

        generateToken(user._id, res);
        res.status(200).json({message:"Login successfully"})
    } catch (error) {
        console.log(`Error in login Controller : ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

//Login Control Ends

//Logout Control Starts

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logout SuccessFully" })
    } catch (error) {
        console.log(`Error in logout Controller : ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

//Logout Control Ends

//Get me

export const getMe = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id }).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log(`Error in getMe Controller : ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}