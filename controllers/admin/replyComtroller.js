const Reply = require('../../models/Reply');
const Adminauth = require("../../models/Adminauth")

class ReplyController {
    static list = async (req, res) => {
        try {
            let id = req.params.id;
            // console.log(id)
            const admin = await Adminauth.find()
            const reply = await Reply.find().populate("support_messages_id")
            return res.render("admin/reply", {
                admin,
                reply,
                id,
            })
        } catch (error) {
            console.log(error);
        }
    }
    static add = async (req, res) => {
        try {
            // console.log(req.body.id)
            const reply = Reply({
                text: req.body.text,
                support_message_id: req.body.id
            })
            await reply.save()
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = ReplyController;