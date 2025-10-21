const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function registerController(req, res) {
    const { email, fullname: { firstname, lastname }, password } = req.body;

    const isUserExists = await UserModel.findOne({
        email
    })

    if (isUserExists) {
        return res.status(401).json({
            message: "User Already Exits"
        })
    }

    const user = await UserModel.create({
        email,
        fullname: {
            firstname,
            lastname
        },
        password: await bcrypt.hash(password, 10)
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie('token', token,{
        httpOnly: true,
    })

    res.status(201).json({
        message: "User registered Succesfully",
        user: {
            email: user.email,
            fullname: user.fullname,
            password: user.password
        }
    })
}

async function loginController(req, res) {
    const { email, password } = req.body;

    const user = await UserModel.findOne({
        email
    })

    if (!user) {
        return res.status(401).json({
            message: "User Does Not Exits"
        })
    }

    // fix: await bcrypt.compare
    const checkpass = await bcrypt.compare(password, user.password);

    if (!checkpass) {
        return res.status(401).json({
            message: "Please enter the Correct Password and try again"
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie('token', token,{
        httpOnly: true,
    })

    res.status(201).json({
        message: "User LoggedIn succesfully",
        user: {
            email: user.email,
            fullname: user.fullname,
            password: user.password
        }
    })
}

// new: meController to check current session
async function meController(req, res) {
    // expects your auth middleware to populate req.user
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { _id, email, fullname } = req.user;
    return res.json({ user: { id: _id, email, fullname } });
}

module.exports = {
    registerController,
    loginController,
    meController
}