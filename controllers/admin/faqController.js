const Faq = require("../../models/Faq");
const Adminauth = require("../../models/Adminauth");

class FaqController {
  static faqGET = async (req, res) => {
    try {
      const faq = await Faq.find();
      const admin = await Adminauth.find({});
      return res.render("admin/faq", { faq, admin });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static faqPOST = async (req, res) => {
    try {
      //Create data
      let data = req.body;
      data.title = data.title;
      data.description = data.description;

      // console.log(data);
      const faq = Faq(data);

      //save data
      await faq.save();
      return res.send({
        error: false,
        message: "Faq added successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static delete = async (req, res) => {
    try {
      const faq = await Faq.findOne({
        _id: req.body.id,
      });
      await Faq.deleteOne({
        _id: faq.id,
      });

      return res.send("Faq deleted successfully");
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
}

module.exports = FaqController;
