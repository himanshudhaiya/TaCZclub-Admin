const Contact = require("../../models/Contact");
const Adminauth = require("../../models/Adminauth");

class ContactController {
  static list = async (req, res) => {
    try {
      let record = await Contact.find().sort({
        created_at: -1,
      });
      const admin = await Adminauth.find({});
      return res.render("admin/contact", {
        record,
        admin,
      });
    } catch (error) {
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static add = async (req, res) => {
    try {
      //Create data
      let data = req.body;
      data.name = data.name;
      data.email = data.email;
      data.phone = data.phone;
      data.message = data.message;

      const contact = Contact(data);

      //save data
      await contact.save();
      return res.send({
        message: "Contact added successfully",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  // delete control
  static delete = async (req, res) => {
    try {
      const contact = await Contact.findOne({
        _id: req.body.id,
      });

      await Contact.deleteOne({
        _id: contact.id,
      });

      return res.status(200).send("Contact deleted successfully");
    } catch (error) {
      console.log(error);
      return res.status(500).send("Something went wrong please try again");
    }
  };
}

module.exports = ContactController;
