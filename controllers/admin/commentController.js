const Comment = require("../../models/Comment")
const Adminauth = require("../../models/Adminauth")



class CategoryController {
    static list = async (req, res) => {
        try {
            const admin = await Adminauth.find({});
            const comment = await Comment.find().populate("user_id post_id")
            return res.render("admin/comment", {
                admin,
                comment,
            })
        } catch (error) {
            console.log(error)
        }
    }

    static edit = async (req, res) => {
        try {
            const data = req.body;

            await Comment.findByIdAndUpdate(data.id, {
                approved: data.approved,
            });
            ({
                type: "form_status",
                data: {
                    id: Comment.id,
                    status: data.approved ? "approved" : "disapproved",
                    time: Date.now(),
                },
            });
            return res.send("success");
        } catch (error) {
            console.log(error);
        }
    }

    static delete = async (req, res) => {
        try {
            const comment = await Comment.findOne({
                _id: req.body.id,
            });
            await Comment.deleteOne({
                _id: comment.id,
            });
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = CategoryController;