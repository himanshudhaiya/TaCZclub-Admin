const Banner = require("../../models/Banner");
const Adminauth = require("../../models/Adminauth");
const multer = require("multer");
const path = require("path");
const root = process.cwd();
const imageFilter = require("../../config/imageFilter");
const fs = require("fs");
const moment = require("moment");

class BannerController {
  static list = async (req, res) => {
    try {
      let banners = await Banner.find().sort({
        created_at: -1,
      });
      banners = await formatData(banners);
      const admin = await Adminauth.find({});
      return res.render("admin/banners", {
        banners,
        admin
      });
    } catch (error) {
      return res.send("Something went wrong please try again later");
    }
  };

  static add = async (req, res) => {
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
        const banner = Banner({
          basename: req.file.filename,
        });
        await banner.save();
        return res.send("success");
      });
    } catch (error) {
      console.log(error);
      return res.send("Somthing went wrong please try again later");
    }
  };

  static delete = async (req, res) => {
    try {
      const banner = await Banner.findOne({
        _id: req.body.id,
      });
      fs.unlinkSync(root + "/public/uploads/banners/" + banner.basename);
      await Banner.deleteOne({
        _id: banner.id,
      });
      return res.send("success");
    } catch (error) {
      return res.send("Something went wrong please try again later");
    }
  };
}
const formatData = (data) => {
  return new Promise(async (resolve, reject) => {
    for (var i in data) {
      data[i].created_at = moment(parseInt(data[i].created_at)).format(
        "DD MMM YYYY, HH:MM"
      );
      data[i].last_update_time = moment(
        parseInt(data[i].last_update_time)
      ).format("DD MMM YYYY, HH:MM");
    }
    resolve(data);
  });
};
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/banners"),
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
}).single("image");

module.exports = BannerController;
