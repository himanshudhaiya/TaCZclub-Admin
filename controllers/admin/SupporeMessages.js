const Support_messages = require("../../models/Support_messages")
const Adminauth = require("../../models/Adminauth")

class SupportMessagesController {
    static list = async (req, res) => {
        try {
            const admin = await Adminauth.find({});
            const support_messages = await Support_messages.find().populate("user_id");
            return res.render("admin/supportMessages", {
                admin,
                support_messages
            });
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = SupportMessagesController