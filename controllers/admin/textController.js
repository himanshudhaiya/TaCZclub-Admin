const Text = require('../../models/Text');
const Category = require('../../models/Category');
const Adminauth = require("../../models/Adminauth");

class TextController {
    static list = async (req, res) => {
        try {
            const text = await Text.find().populate("category_Id");
            const category = await Category.find();
            const admin = await Adminauth.find({});
            return res.render("admin/text", {
                text,
                category,
                admin,
            });
        } catch (error) {
            console.log(error);
        }
    }

    static add = async (req, res) => {
        try {
            const text = new Text({
                text: req.body.text,
                category_Id: req.body.category_Id,
                status: req.body.status,
            });
            await text.save();
            res.status(201).send("Text added successfully");
        } catch (error) {
            console.log(error);
        }
    }

    static edit = async (req, res) => {
        try {
            const data = req.body;
            await Text.findByIdAndUpdate(data.id, {
                approved: data.approved,
            });
            ({
                type: "form_status",
                data: {
                    id: Text.id,
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
module.exports = TextController;

// static Aboutedit = async (req, res) => {
//     try {
//         // console.log(req.body.editid);
//         const about = await About.findOne({
//             _id: req.body.editid,
//         });
//         // console.log(about);
//         await About.findOneAndUpdate({
//             _id: req.body.editid
//         }, {
//             name: req.body.editname,
//         });
//         return res.send(" About updated successfully");
//     } catch (err) {
//         console.log(err);
//     }
// }