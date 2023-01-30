const Post = require("../../models/Post");
const multer = require("multer");
const root = process.cwd();
const path = require("path");
const fs = require("fs");
const imageFilter = require("../../config/imageFilter");
const UserWallet = require("../../models/UserWallet")
const User = require("../../models/User")
const jwt = require("jsonwebtoken")
const Following = require("../../models/Following")
const Currency = require("../../models/Currency")
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
    destination: path.join(root, "/public/uploads/Posts"),
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});
// Init Upload
const upload = multer({
    storage: storage,
}).fields([{
        name: "image",
        maxCount: 1,
    },
    {
        name: "video",
        maxCount: 1,
        // video 40mb
        // fileSize: 40000000
        limit: {
            fileSize: 40000000
        }
    },
    {
        name: "gif",
        maxCount: 1,
        limit: {
            fileSize: 2000
        }

    },
]);
class PostController {
    static list = async (req, res) => {
        try {
            const posts = await Post.find()
            res.status(200).send(posts);
        } catch (err) {
            res.status(500).send(err);
        }
    }

    // following Users posts list


    static add = async (req, res) => {
        try {
            upload(req, res, async (err) => {
                let token = req.body.token
                const payload = jwt.decode(token, process.env.TOKEN_SECRET);
                const user = await User.findById(payload._id);
                if (!user) return res.status(401).send("user not found")
                const post = Post({
                    text: req.body.text,
                    image: req.files.image ? req.files.image[0].filename : "null",
                    description: req.body.description,
                    video: req.files.video ? req.files.video[0].filename : "null",
                    gif: req.files.gif ? req.files.gif[0].filename : "null",
                    category: req.body.category,
                    user_id: user._id,
                })
                const data = await post.save();
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
                    post_id: data.id,
                    currency: currencyS.currency,
                    amount: currencyS.currency,
                    transaction_type: 'credit',
                    transaction_Id: transaction_id,
                })
                await userVolite.save()
                return res.send("Post Successfull")

            });
        } catch (error) {
            console.log(error);
        }
    }


}

module.exports = PostController;