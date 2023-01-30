const ShortVideo = require("../../models/ShortVideo")
const Adminauth = require("../../models/Adminauth");
const User = require("../../models/User");
const Like = require("../../models/Like")
const Comment = require("../../models/Comment")
const Views = require("../../models/Views")



class ShortVideoController {
    static list = async (req, res) => {
        try {
            const admin = await Adminauth.find({});
            const shortvideo = await ShortVideo.find().populate("user_id")
            const user = await User.find()
            return res.render("admin/shortVideo", {
                shortvideo,
                admin,
                user
            })
        } catch (error) {
            console.log(error)
        }
    }
    static shortVideoView = async (req, res) => {
        try {
            let id = req.params.id;
            const like = await Like.find({
                short_id: id
            }).populate("user_id short_id")

            const comment = await Comment.find({
                short_id: id
            }).populate("user_id short_id")
            const admin = await Adminauth.find();
            const shortVideo = await ShortVideo.find({
                _id: id

            }).populate("user_id")
            const views = await Views.find({
                shortVideo_id: id
            }).populate("user_id short_id")
            // const user = await User.find({
            //     _id: sortVideo[0].user_id
            // })

            return res.render("admin/shortVideoview", {
                admin,
                like,
                comment,
                shortVideo,
                views
            })
        } catch (error) {
            console.log(error)
        }
    }

    static edit = async (req, res) => {
        try {
            const data = req.body;

            await ShortVideo.findByIdAndUpdate(data.id, {
                approved: data.approved,
            });
            ({
                type: "form_status",
                data: {
                    id: ShortVideo.id,
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
module.exports = ShortVideoController;