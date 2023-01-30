const PrivacyPolicy = require("../../models/PrivacyPolicy");
const Adminauth = require("../../models/Adminauth");

class PrivacyPolicyController {
  static privacypolicyGET = async (req, res) => {
    try {
      const data = await PrivacyPolicy.findOne({});
      const admin = await Adminauth.find({});
      return res.render("admin/privacypolicy", {
        content: data ? data.content : "",
        admin,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static privacypolicyPOST = async (req, res) => {
    try {
      let data = req.body;
      var exist = await PrivacyPolicy.findOne();
      if (exist) {
        data.updated_at = Date.now();
        await PrivacyPolicy.updateOne({}, data);
      } else {
        const data = req.body;
        // console.log(data);
        const privacypolicy = await PrivacyPolicy({
          content: data.content.trim(),
        });

        await privacypolicy.save();
      }
      return res.send("Privacy Policy updated successfully");
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
}

module.exports = PrivacyPolicyController;
