const Subcategory = require("../../models/Subcategory");
const Adminauth = require("../../models/Adminauth");
const moment = require("moment");
const multer = require("multer");
const path = require("path");
const root = process.cwd();
const imageFilter = require("../../config/imageFilter");
const fs = require("fs");
require("dotenv");

class SubcategoryController {
  static list = async (req, res) => {
    try {
      let subcategories = await Subcategory.find({
        category: req.query.id,
      })
        .populate("category")
        .sort({
          created_at: -1,
        });
        const admin = await Adminauth.find({});
      return res.render("admin/subcategories", {
        subcategories,
        admin,
      });
    } catch (error) {
      return res.send("Something went wrong please try again later");
    }
  };

  static addPOST = async (req, res) => {
    try {
      upload(req, res, async function (err) {
        if (req.fileValidationError) {
          return res.send(req.fileValidationError);
        } else if (!req.file) {
          return res.send("Please upload an image");
        } else if (err instanceof multer.MulterError) {
          console.log(err);
          return res.send(err);
        } else if (err) {
          console.log(err);
          return res.send(err);
        }
        const subcategory = Subcategory({
          icon: req.file.filename,
          category: req.body.category,
          name: req.body.name,
        });

        await subcategory.save();
        return res.send("success");
      });
    } catch (error) {
      console.log(error);
      return res.send("Somthing went wrong please try again later");
    }
  };

  static edit = async (req, res) => {
    try {
      await Subcategory.findOneAndUpdate(
        {
          _id: req.body.id,
        },
        {
          name: req.body.name,
          last_update_time: Date.now(),
        }
      );
      return res.send("success");
    } catch (error) {
      return res.send("Somthing went wrong please try again later");
    }
  };

  static delete = async (req, res) => {
    try {
      await Subcategory.findOneAndDelete({
        _id: req.body.id,
      });
      return res.send("success");
    } catch (error) {
      return res.send("Somthing went wrong please try again later");
    }
  };
}
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/subcategory"),
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  // limits: {
  //     fileSize: 5000000
  // },
  fileFilter: imageFilter,
}).single("icon");

module.exports = SubcategoryController;
