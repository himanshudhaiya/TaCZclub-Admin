const ShortVideo = require("../../models/ShortVideo");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const root = process.cwd();
const path = require("path");
const fs = require("fs");
const imageFilter = require("../../config/imageFilter");
const UserWallet = require("../../models/UserWallet");
const Currency = require("../../models/Currency");
const crypto = require('crypto');

function getTransactionID() {
    const padTo2Digits = (num) => {
        return num.toString().padStart(2, '0');
    }
    const transaction_id = crypto.randomBytes(16).toString("hex");
    const date = new Date();
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('') + '-' + transaction_id;
}



const storage = multer.diskStorage({
    destination: path.join(root, "/public/uploads/ShortVideo"),
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage: storage,
    // limits: {
    //     fileSize: 2000000
    // },
    imageFilter: imageFilter,
}).single("video");

class ShortVideoController {
    static add = async (req, res) => {
        try {
            upload(req, res, async (err) => {
                let token = req.body.token;
                const payload = jwt.decode(token, process.env.TOKEN_SECRET);
                const user = await User.findById(payload._id);
                if (!user) {
                    return res.status(400).send("User not found");
                }
                const shortVideo = new ShortVideo({
                    user_id: user._id,
                    video: req.file ? req.file.filename : "null",
                    description: req.body.description,
                    created_at: Date.now(),
                    updated_at: Date.now()
                });
                const video = await shortVideo.save();

                let currencyS = await Currency.findOne().select({
                    'currency': 1,
                    _id: 0
                })

                let user1 = await User.findByIdAndUpdate(user._id, {
                    $inc: {
                        "wallet": Number(currencyS.currency)
                    }
                })
                const transaction_id = getTransactionID()
                const userVolite = UserWallet({
                    user_id: user._id,
                    shortVideo_id: video.id,
                    currency: currencyS.currency,
                    amount: currencyS.currency,
                    transaction_type: 'credit',
                    transaction_Id: transaction_id,
                })
                await userVolite.save()
                return res.send("Short Video Successfull")

            });
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = ShortVideoController;