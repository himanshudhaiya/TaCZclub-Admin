const Like = require("../../models/Like")
const Adminauth = require("../../models/Adminauth")


class LikeController {
    static list = async (req, res) => {
        try {
            const admin = await Adminauth.find({});
            const like = await Like.find().populate("post_id user_id")
            return res.render("admin/like", {
                admin,
                like,
            })
        } catch (error) {
            console.log(error)
        }
    }

    static delete = async (req, res) => {
        try {
            const like = await Like.findOne({
                _id: req.body.id,
            });
            await Like.deleteOne({
                _id: like.id,
            });
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = LikeController;