const Report = require("../../models/Report");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Adminauth = require("../../models/Adminauth");

class ReportController {
    static list = async (req, res) => {
        try {
            // let id = req.query.id;
            const admin = await Adminauth.find({});
            const report = await Report.find({}).populate("user_id post_id report_id");
            return res.render("admin/report", {
                report,
                admin,
            });
        } catch (error) {
            return console.log(error);
        }
    }
    // static delete = async (req, res) => {
    //     try {
    //         const report = await Report.findOne({
    //             _id: req.body.id,
    //         });
    //         await report.deleteOne({
    //             _id: report.id,
    //         });
    //         return res.send("Deleted successfully");
    //     } catch (error) {
    //         return console.log(error);
    //     }
    // }
    static delete = async (req, res) => {
        try {
            // let id = req.query.id;
            const report = await Report.findOne({
                _id: req.body.id,
            });
            await report.deleteOne({
                _id: report.id,
            });

        } catch (error) {
            return console.log(error);
        }
    }

    static edit = async (req, res) => {
        try {
            const data = req.body;
            // return console.log(data);
            await Report.findByIdAndUpdate(data.id, {
                approved: data.approved,
            });
            ({
                type: "form_status",
                data: {
                    id: Report.id,
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
module.exports = ReportController;