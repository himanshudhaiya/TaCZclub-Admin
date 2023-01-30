const Report = require('../../models/Report');
const jwt = require("jsonwebtoken")
const User = require("../../models/User")

class ReportController {
    static add = async (req, res) => {
        try {
            let token = req.body.token;
            const payload = jwt.decode(token, process.env.TOKEN_SECRET);
            const user = await User.findById(payload._id);
            // return console.log(user)
            if (!user) {
                return res.status(401).send("Unauthorized");
            }
            const report = await Report({
                user_id: user.id,
                post_id: req.body.post_id,
                comment: req.body.comment,
                report_id: req.body.report_id,
            });
            let data = await report.save();
            return res.send(data);
        } catch (error) {
            return res.send("Something went wrong please try again later");
        }
    }
}

module.exports = ReportController;