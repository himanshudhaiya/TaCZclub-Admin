const PostSave = require("../../models/Postsave");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

class PostsaveController {
    static add = async (req, res) => {
        try {
            let token = req.body.token
            let post_id = req.body.post_id
            let shortVideo_id = req.body.shortVideo_id

            if (token == "") {
                return res.status(404).json({
                    message: 'Token is required',
                    status: 404,
                    success: false
                })
            }

            if (post_id) {
                const payload = jwt.decode((token), process.env.TOKEN_SECRET);
                const user = await User.findById(payload._id);
                if (!user) return res.status(401).send("user not found")
                const postsave = PostSave({
                    post_id: post_id,
                    user_id: user._id,
                });
                const data = await postsave.save();
                return res.status(200).json({
                    message: "Post Saved Successfully",
                    status: 200,
                    success: true,
                    data: data
                });

            } else if (shortVideo_id) {
                const payload = jwt.decode((token), process.env.TOKEN_SECRET);
                const user = await User.findById(payload._id);
                if (!user) return res.status(401).send("user not found")
                const postsave = PostSave({
                    shortVideo_id: shortVideo_id,
                    user_id: user._id,
                });
                const data = await postsave.save();
                return res.status(200).json({
                    message: "Post Saved Successfully",
                    status: 200,
                    success: true,
                    data: data
                });

            }


        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .send("Something went wrong please try again later");
        }
    }

}
module.exports = PostsaveController;