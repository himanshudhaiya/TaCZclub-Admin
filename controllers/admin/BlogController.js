const Blog = require("../../models/Blog");
const Adminauth = require("../../models/Adminauth");
const multer = require("multer");
const path = require("path");
const imageFilter = require("../../config/imageFilter");
const fs = require("fs");
const root = process.cwd();
const moment = require("moment");

class BlogController {
  static blogList = async (req, res) => {
    try {
      const blog = await Blog.find();
      const admin = await Adminauth.find({});
      return res.render("admin/blog-list", {
        blog,
        admin
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static blogPost = async (req, res) => {
    try {
      upload(req, res, async function (err) {
        if (req.fileValidationError) {
          return res.send(req.fileValidationError);
        } else if (!req.file) {
          return res.send("Please upload an icon");
        } else if (err instanceof multer.MulterError) {
          console.log(err);
          return res.send(err);
        } else if (err) {
          console.log(err);
          return res.send(err);
        }

        var datetime = new Date();
        var date =
          datetime.getDate() +
          "-" +
          (datetime.getMonth() + 1) +
          "-" +
          datetime.getFullYear() +
          " " +
          datetime.getHours() +
          ":" +
          datetime.getMinutes() +
          ":" +
          datetime.getSeconds();
        const blog = Blog({
          heading: req.body.heading,
          image: req.file.filename,
          description: req.body.description,
          date_time: date,
        });
        await blog.save();
        return res.send("Blogs added successfully");
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Somthing went wrong please try again later");
    }
  };

  static delete = async (req, res) => {
    try {
      const blog = await Blog.findOne({
        _id: req.body.id,
      });
      //  return console.log(blog)
      await Blog.deleteOne({
        _id: blog.id,
      });
      fs.unlink(
        path.join(root, "../../public/uploads/blog", blog.image),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      return res.send("blog Deleted successfully");
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
}
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../public/uploads/blog"),
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  // limits: {
  //     fileSize: 1000000
  // },
  fileFilter: imageFilter,
}).single("image");

module.exports = BlogController;