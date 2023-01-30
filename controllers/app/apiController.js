const Banner = require("../../models/Banner");
const About = require("../../models/About");
const Contact = require("../../models/Contact");
const Faq = require("../../models/Faq");
const PrivacyPolicy = require("../../models/PrivacyPolicy");
const Slider = require("../../models/Slider");
const TermsCondition = require("../../models/TermsCondition");
const Post = require("../../models/Post");
const User = require("../../models/User");
const ShortVideo = require("../../models/ShortVideo");
const Like = require("../../models/Like");
const Comment = require("../../models/Comment");
const UserWallet = require("../../models/UserWallet");
const Following = require("../../models/Following");
const Followers = require("../../models/Followers");
const PostSave = require("../../models/Postsave");
const Reply = require("../../models/Reply");
const SupportMessage = require("../../models/Support_messages");
const Category = require("../../models/Category");
const Blog = require("../../models/Blog");
const GoogleAds = require("../../models/GoogleAds");
const Views = require("../../models/Views")
const CommentReply = require("../../models/CommentReply");
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Notification = require("../../models/Notification");


function getTransactionID() {
  const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
  }
  const transaction_id = crypto.randomBytes(16).toString("hex");
  const date = new Date();
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('') + '-' + transaction_id;
}

class ApiController {
  static banner = async (req, res) => {
    try {
      const banner = await Banner.find();
      // sending notification start
      const notification = Notification({
        type: "Banner-Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Banner-Add");

      // sending notification end
      return res.status(200).json({
        message: "Banners fetched successfully",
        success: true,
        status: 200,
        data: banner,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static about = async (req, res) => {
    try {
      const data = await About.find({});
      // sending notification start
      const notification = Notification({
        type: "About-Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("About-Add");
      return res.status(200).json({
        message: "About fetched successfully",
        success: true,
        status: 200,
        data: data
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static contact = async (req, res) => {
    try {
      const data = await Contact.find({});
      // sending notification start
      const notification = Notification({
        type: "Contact-Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Contact-Add");
      return res.status(200).json({
        message: "Contact fetched successfully",
        success: true,
        status: 200,
        data: data
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static faq = async (req, res) => {
    try {
      const data = await Faq.find();
      // sending notification start
      const notification = Notification({
        type: "Faq-Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Faq-Add");
      return res.status(200).json({
        message: "Faq fetched successfully",
        success: true,
        status: 200,
        data: data
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static privacypolicy = async (req, res) => {
    try {
      const data = await PrivacyPolicy.find({});
      // sending notification start
      const notification = Notification({
        type: "Privacy Policy - Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Privacy Policy - Add");
      return res.status(200).json({
        message: "PrivacyPolicy fetched successfully",
        success: true,
        status: 200,
        data: data
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static slider = async (req, res) => {
    try {
      const sliders = await Slider.find();
      // sending notification start
      const notification = Notification({
        type: "Slider - Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Slider - Add");
      return res.status(200).json({
        message: "Sliders fetched successfully",
        success: true,
        status: 200,
        Data: sliders
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static termscondition = async (req, res) => {
    try {
      const data = await TermsCondition.find({});
      // sending notification start
      const notification = Notification({
        type: "Termscondition - Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Termscondition - Add");
      return res.status(200).json({
        message: "TermsCondition fetched successfully",
        success: true,
        status: 200,
        data: data
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static blog = async (req, res) => {
    try {
      const data = await Blog.find({});
      // sending notification start
      const notification = Notification({
        type: "Blog - Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Blog - Add");
      return res.status(200).json({
        message: "Blog fetched successfully",
        success: true,
        status: 200,
        data: data
      });

    } catch (error) {
      console.log(error);
      return res

        .status(500)
        .send("Something went wrong please try again later");
    }
  }

  // user login ke post & shot video
  static post = async (req, res) => {
    try {
      const user1 = await User.find({
        _id: req.login_user
      });
      const post = await Post.find({
        user_id: req.login_user
      }).populate("user_id");
      const sortvideo = await ShortVideo.find({
        user_id: req.login_user
      }).populate("user_id")

      return res.status(200).json({
        message: "Post fetched successfully",
        success: true,
        status: 200,
        data: {
          post: post,
          sortvideo: sortvideo,
          user: user1
        }
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  // user login ke post show
  static post = async (req, res) => {
    try {
      const post = await Post.find()
      // sending notification start
      const notification = Notification({
        type: "Post - Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Post - Add");
      return res.status(200).json({
        message: "Post fetched successfully",
        success: true,
        status: 200,
        post: post
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  }

  // user login ke post pr like 
  static post_likes = async (req, res) => {
    try {
      var post_id = req.body.post_id
      const like = await Like.find({
        post_id: post_id
      }).populate("post_id user_id")
      // sending notification start
      const notification = Notification({
        type: "Like - Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Like - Add");
      return res.status(200).json({
        message: "Post likes fetched successfully",
        success: true,
        status: 200,
        like: like.length
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  }

  // user login ke post pr comment
  static post_comment = async (req, res) => {
    try {
      var post_id = req.body.post_id
      const comment = await Comment.find({
        post_id: post_id
      }).populate("post_id user_id")
      // sending notification start
      const notification = Notification({
        type: "Comment - Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Comment - Add");
      return res.status(200).json({
        message: "Post comment fetched successfully",
        success: true,
        status: 200,
        comment: comment
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  }

  // user login ke ShortVideo 
  static shortVideo = async (req, res) => {
    try {
      const shortVideo = await ShortVideo.find()
      // sending notification start
      const notification = Notification({
        type: "Video - Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Video - Add");
      return res.status(200).json({
        message: "ShortVideo fetched successfully",
        success: true,
        status: 200,
        shortVideo: shortVideo
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  }

  // user login ke ShortVideo pr like
  static shortVideo_likes = async (req, res) => {
    try {
      var shortVideo_id = req.body.shortVideo_id
      const like = await Like.find({
        shortVideo_id: shortVideo_id
      }).populate("shortVideo_id user_id")
      // sending notification start
      const notification = Notification({
        type: "Likes - Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Likes - Add");
      return res.status(200).json({
        message: "ShortVideo likes fetched successfully",
        success: true,
        status: 200,
        like: like.length
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");

    }
  }

  // user login ke ShortVideo pr comment
  static shortVideo_comment = async (req, res) => {
    try {
      var shortVideo_id = req.body.shortVideo_id
      const comment = await Comment.find({
        short_id: shortVideo_id
      }).populate("shortVideo_id user_id")
      // sending notification start
      const notification = Notification({
        type: "Comment - Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Comment - Add");
      return res.status(200).json({
        message: "ShortVideo comment fetched successfully",
        success: true,
        status: 200,
        Data: comment
      });
    } catch (error) {
      console.log(error);
      return res

        .status(500)
        .send("Something went wrong please try again later");
    }
  }

  // user login ke ShortVideo - ViewS
  static shortVideo_views = async (req, res) => {
    try {
      var shortVideo_id = req.body.shortVideo_id
      const view = await Views.find({
        shortVideo_id: shortVideo_id
      }).populate("shortVideo_id user_id")
      return res.status(200).json({
        message: "ShortVideo views fetched successfully",
        success: true,
        status: 200,
        Data: view.length
      });

    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  }

  static followingPostlist = async (req, res) => {
    try {
      const following = await Following.find().populate("user_id");
      const post = await Post.find({
        user_id: following.map(item => item.user_id._id)
      }).populate("user_id");
      const sortvideo = await ShortVideo.find({
        user_id: following.map(item => item.user_id._id)
      }).populate("user_id")

      return res.status(200).json({
        message: "Following Post fetched successfully",
        success: true,
        status: 200,
        data: {
          post: post,
          shortVideo: sortvideo
        }
      });

    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  }

  // User ko following list
  static following = async (req, res) => {
    try {
      const following = await Following.find().populate("user_id");
      // sending notification start
      const notification = Notification({
        type: "Following",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Following -Add");
      return res.status(200).json({
        message: "Following fetched successfully",
        success: true,
        following: following
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  }
  // User ko follower list
  static followers = async (req, res) => {
    try {
      const followers = await Followers.find().populate("user_id");
      // sending notification start
      const notification = Notification({
        type: "Followers - Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Followers - Add");
      return res.status(200).json({
        message: "Followers fetched successfully",
        success: true,
        followers: followers
      });
    } catch (error) {
      console.log(error);
      return res

        .status(500)
        .send("Something went wrong please try again later");
    }
  }
  // login user ko save post & shot video
  static postSave = async (req, res) => {
    try {
      const data = await PostSave.find({});
      // sending notification start
      const notification = Notification({
        type: "Save - Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Save - Add");
      return res.status(200).json({
        message: "Post Save fetched successfully",
        success: true,
        data: data
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  }
  // login user ko admin reply list 
  static reply = async (req, res) => {
    try {
      const reply = await Reply.find({}).populate("Support_message");
      const supportMessage = await SupportMessage.find({}).populate("user_id");
      // sending notification start
      const notification = Notification({
        type: "Reply - Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Reply - Add");
      return res.status(200).json({
        message: "Reply fetched successfully",
        success: true,
        status: 200,
        reply: reply,
        data: supportMessage
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  }

  static category = async (req, res) => {
    try {
      const category = await Category.find({});
      // sending notification start
      const notification = Notification({
        type: "Category - Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Category - Add");
      return res.status(200).json({
        message: "Category fetched successfully",
        success: true,
        status: 200,
        category: category
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  }

  // login user ko show GoogleAds list
  static googleAds = async (req, res) => {
    try {
      const googleAds = await GoogleAds.find({});
      // sending notification start
      const notification = Notification({
        type: "Google Ads - Add",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Google Ads - Add");
      return res.status(200).json({
        message: "GoogleAds fetched successfully",
        success: true,
        status: 200,
        googleAds: googleAds
      });
    } catch (error) {
      return res
        .status(500)
        .send("Something went wrong please try again later" + error);
    }
  }

  // login user ke post list  shortVideo list
  static user_post = async (req, res) => {
    try {
      const login_user = req.login_user;
      const post = await Post.find({
        user_id: login_user._id
      }).populate("user_id");
      const sortvideo = await ShortVideo.find({
        user_id: login_user._id
      }).populate("user_id")
      return res.status(200).send({
        message: "success",
        success: true,
        status: 200,
        post,
        sortvideo
      })

    } catch (error) {
      console.log(error);
      return res.status(200).send({
        message: "fail".error,
        success: false
      })
    }
  }



  // login user debat amount  ===========>  Post
  static debit_money_from_wallet = async (req, res) => {
    try {
      const data = req.body;
      const login_user = req.login_user;
      if (!data.amount)
        return res.status(200).send({
          status: false,
          message: "Please send amount"
        });

      let userDetailsWallet = await User.findOne({
        _id: login_user._id
      }).select('wallet');
      let currentWalletBalance = userDetailsWallet.wallet;
      // minem amount 100
      if (data.amount > currentWalletBalance || data.amount < 100)
        return res.status(200).send({
          status: false,
          message: "Amount should be greater than 100 and less than wallet balance"
        });

      await instance.User.findByIdAndUpdate(login_user._id, {
        $inc: {
          "wallet": -Number(data.amount),
          currency: "INR",
        }
      });

      const transaction_id = getTransactionID()
      console.log(transaction_id)
      let transactionSave = {
        user_id: login_user._id,
        amount: Number(data.amount),
        transaction_type: 'debit',
        transaction_Id: transaction_id,
        source: 'purchase',
      }
      await UserWallet.create(transactionSave);


      let userDetails = await User.findOne({
        _id: login_user._id
      }).select('wallet');
      let transactions = await UserWallet.find({
        user_id: login_user._id
      }).sort({
        created_at: -1
      });
      const returnData = {
        wallet_balance: userDetails ? userDetails.wallet : 0,
        transactions: transactions
      }


      return res.send({
        message: 'Amount debited successfully',
        success: true,
        status: 200,
        data: returnData,
      });

    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  // comment Reply ke list
  static commentReply = async (req, res) => {
    try {
      let login_user = req.login_user;
      const commentReply = await CommentReply.find({
        comment_id: req.body.comment_id,
        user_id: login_user._id
      }).populate("user_id comment_id");
      // return console.log(commentReply)
      return res.status(200).send({
        message: "success",
        success: true,
        status: 200,
        data: commentReply
      })

    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }

  }
}

var instance = new Razorpay({
  key_id: "rzp_test_rFXwtHIILu1CTU",
  key_secret: "OagCUpxf4bDzhU7igpiUOxK2",
});

module.exports = ApiController;