const User = require("../../models/User");
const datatablesQuery = require("datatables-query");
const Adminauth = require("../../models/Adminauth");
const UserWallet = require("../../models/UserWallet")
const Post = require("../../models/Post")
const Like = require("../../models/Like")
const Comment = require("../../models/Comment")
const ShortVideo = require("../../models/ShortVideo")

class UserController {
  // datatable data control
  static datatableData = async (req, res) => {
    try {
      const params = req.body;
      const query = datatablesQuery(User);
      const raw = await query.run(params);

      return res.send(raw);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  // list control
  static list = async (req, res) => {
    const users = await User.find();
    const admin = await Adminauth.find({});
    return res.render("admin/user-list", {
      users,
      admin
    });
  };

  // update control
  static update = async (req, res) => {
    try {
      const data = req.body;
      // console.log(data);

      await User.findByIdAndUpdate(data.id, {
        approved: data.approved,
      });

      ({
        type: "form_status",
        data: {
          id: User.id,
          status: data.approved ? "approved" : "disapproved",
          time: Date.now(),
        },
      });

      return res.send("User updated successfully");
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };


  // List App User       
  static appuser = async (req, res) => {
    try {
      // console.log(userWallet)
      const admin = await Adminauth.find({});
      const user = await User.find().populate("userWallet");
      const userWallet = await UserWallet.find({}).populate("post_id")
      return res.render("admin/appUser", {
        user,
        admin,
        userWallet,
      })

    } catch (error) {
      console.log(error)
    }
  }

  static userWalletViews = async (req, res) => {
    try {
      let user1 = req.query.id;
      const admin = await Adminauth.find({});
      const user = await User.find({
        _id: user1
      })
      let userWallet = await UserWallet.find({
        user_id: user1
      }).select({
        'currency': 1,
        'amount': 1,
      })
      // amount slice array last element
      // let amount = userWallet.map(item => item.amount).slice(-1)

      // console.log(userWallet)
      const post = await Post.find({
        user_id: user1
      }).populate("user_id")
      const sortvideo = await ShortVideo.find({
        user_id: user1
      }).populate("user_id")

      return res.render("admin/userWalletViews", {
        user,
        admin,
        userWallet,
        post,
        sortvideo,
      })
    } catch (error) {
      console.log(error)
    }
  }

  static userpostView = async (req, res) => {
    try {
      let id = req.query.id;
      // console.log(id)
      const like = await Like.find({
        post_id: id
      }).populate("user_id post_id")

      const comment = await Comment.find({
        post_id: id
      }).populate("user_id post_id")
      const post = await Post.find({
        _id: req.query.id
      })

      // console.log(post)
      const admin = await Adminauth.find();
      return res.render("admin/userPostview", {
        comment,
        like,
        admin,
        post
      })
    } catch (error) {
      console.log(error)
    }
  }

  static userWallet_ShortVideo_Views = async (req, res) => {
    try {
      let id = req.query.id;
      // console.log(id)
      const like = await Like.find({
        short_id: id
      }).populate("user_id short_id")

      const comment = await Comment.find({
        short_id: id
      }).populate("user_id short_id")

      const sortVideo = await ShortVideo.find({
        _id: req.query.id
      })
      // console.log(post)
      const admin = await Adminauth.find();
      return res.render("admin/userShortvideoView", {
        comment,
        like,
        admin,
        sortVideo
      })
    } catch (error) {
      console.log(error)
    }
  }

}
module.exports = UserController;