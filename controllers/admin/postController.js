const Post = require("../../models/Post");
const Adminauth = require("../../models/Adminauth");
const User = require("../../models/User");
const Comment = require("../../models/Comment");
const Like = require("../../models/Like");

class PostController {
    static list = async (req, res) => {
        try {
            const admin = await Adminauth.find({});
            const post = await Post.find({}).populate("user_id")
            const user = await User.find()
            return res.render("admin/post", {
                post,
                admin,
                user
            })
        } catch (error) {
            console.log(error)
        }
    }
    static postView = async (req, res) => {
        try {
            let id = req.query.id;
            // console.log(id)
            const like = await Like.find({
                post_id: id
            }).populate("user_id post_id")

            const comment = await Comment.find({
                post_id: id
            }).populate("user_id post_id")
            const post = await Post.find({
                _id: req.query.id
            }).populate("user_id")
            // console.log(post)
            const admin = await Adminauth.find();
            return res.render("admin/postView", {
                admin,
                like,
                comment,
                post,
            })
        } catch (error) {
            console.log(error)
        }
    }

    static edit = async (req, res) => {
        try {
            const data = req.body;

            await Post.findByIdAndUpdate(data.id, {
                approved: data.approved,
            });
            ({
                type: "form_status",
                data: {
                    id: Post.id,
                    status: data.approved ? "approved" : "disapproved",
                    time: Date.now(),
                },
            });
            return res.send("success");
        } catch (error) {
            console.log(error);
        }
    }



}
module.exports = PostController;