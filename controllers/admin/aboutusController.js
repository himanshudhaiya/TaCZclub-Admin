const About = require("../../models/About");
const Adminauth = require("../../models/Adminauth");

class AboutusController {
  static aboutusGET = async (req, res) => {
    try {
      const data = await About.findOne({});
      const admin = await Adminauth.find({});
      return res.render("admin/aboutus", {
        content: data ? data.content : "",
        admin,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static aboutusPOST = async (req, res) => {
    try {
      let data = req.body;
      var exist = await About.findOne();
      if (exist) {
        const data = req.body;
        await About.findOneAndUpdate(
          {},
          {
            content: data.content.trim(),
            updated_at: Date.now(),
          }
        );
      } else {
        const data = req.body;
        const aboutus = await About({
          content: data.content.trim(),
        });

        await aboutus.save();
      }
      return res.send("About us updated successfully");
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
}

module.exports = AboutusController;
