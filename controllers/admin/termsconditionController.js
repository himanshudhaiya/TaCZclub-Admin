const TermsCondition = require("../../models/TermsCondition");
const Adminauth = require("../../models/Adminauth");

class TermsConditionController {
  static termsconditionGET = async (req, res) => {
    try {
      const data = await TermsCondition.findOne({});
      const admin = await Adminauth.find({});
      return res.render("admin/termscondition", {
        content: data ? data.content : "",
        admin,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static termsconditionPOST = async (req, res) => {
    try {
      let data = req.body;
      var exist = await TermsCondition.findOne();
      if (exist) {
        data.updated_at = Date.now();
        await TermsCondition.updateOne({}, data);
      } else {
        const data = req.body;
        // console.log(data);
        const termscondition = await TermsCondition({
          content: data.content.trim(),
        });

        await termscondition.save();
      }

      return res.send("Terms Condition updated successfully");
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
}

module.exports = TermsConditionController;
