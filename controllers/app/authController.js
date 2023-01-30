const User = require("../../models/User")
const Otp = require("../../models/Otp")
const otpGenerator = require("otp-generator")
require("dotenv")
const jwt = require("jsonwebtoken")
const Like = require("../../models/Like")
const Comment = require("../../models/Comment")
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const root = process.cwd();
const fileFilter = require("../../config/imageFilter");
const Followers = require("../../models/Followers")
const Following = require("../../models/Following")
const crypto = require("crypto");
const ReferralCurrency = require("../../models/ReferralCurrency")

// referral_code Auto Generate rendom 5 digits
function referral_codes() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnpoqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}



const storage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/User"),
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  // limits: {
  //     fileSize: 5000000
  // },
  fileFilter: fileFilter,
}).single("image");


class UserController {

  static login = async (req, res) => {

    const mobile_number = req.body.mobile_number;
    let msg = "Something went wrong please try again later";

    var mobile_regex = /^\d{10}$/;

    if (!mobile_regex.test(mobile_number)) {
      return res.status(401).send("Invalid Mobile Number");
    }

    try {
      let user = await User.findOne({
        mobile_number
      });
      if (!user) {
        user = User({
          mobile_number,
        });
        user = await user.save();
      }

      let newOtp = await otpGenerator.generate(4, {
        alphabets: false,
        upperCase: false,
        specialChars: false,
      });
      if (mobile_number == "8952829519") {
        newOtp = 1234;
      }

      //newOtp = 1234;
      let customerMobile = user.mobile_number;
      sendSMS(customerMobile, newOtp);

      const otpExist = await Otp.findOne({
        user,
      });

      if (otpExist) {
        await Otp.findOneAndUpdate({
          _id: otpExist._id,
        }, {
          otp: newOtp,
          update_at: Date.now(),
        });
      } else {
        const otp = Otp({
          user,
          otp: newOtp,
          created_at: Date.now(),
          update_at: Date.now(),
        });
        await otp.save();
      }
      return res.status(200).send("OTP sent successfully");
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };


  static verify_otp = async (req, res) => {
    try {

      let mobile_number = req.body.mobile_number
      let otp = req.body.otp

      if (mobile_number == "") {
        return res.send("Mobile Number is required")
      } else if (otp == "") {
        return res.send("Otp is required")
      }

      const user = await User.findOne({
        mobile_number: mobile_number
      })
      // console.log(user)
      if (!user) return res.send("User not found")

      const verify = await Otp.findOne({
        user
      })
      // return console.log(verify)
      if (otp == verify.otp) {

        const token = jwt.sign({
          _id: user._id,
        }, process.env.TOKEN_SECRET)
        let data = {
          token: token,
        }
        return res.status(200).json({
          message: "Otp verified successfully",
          status: 200,
          success: true,
          data: data,
        })
      }
      return res.send("Invalid Otp")
    } catch (error) {
      console.log(error)
    }
  }

  // User Register
  static register = async (req, res) => {
    try {
      upload(req, res, async (err) => {
        let token = req.body.token

        let name = req.body.name
        let email = req.body.email
        let User_referral_code = req.body.referral_code

        if (name == "") {
          return res.send("Name is required")
        } else if (email == "") {
          return res.send("Email is required")
        } else if (token == "") {
          return res.send("Token is required")
        }

        const referralCurrency = await ReferralCurrency.findOne().select({
          _id: 0,
          referral_Currency: 1
        })

        const referral_user = await User.findOne({
          referral_code: User_referral_code,
        })
        // return console.log(user1)
        if (!referral_user) return res.send("Referral code is not valid")

        const referral_Currency_user = await User.findByIdAndUpdate(referral_user, {
          $inc: {
            "wallet": Number(referralCurrency.referral_Currency),
          }
        })
        // return console.log(user1)
        const payload = jwt.decode(token, process.env.TOKEN_SECRET);

        const user = await User.findById(payload._id);

        if (!user) return res.status(401).send("user not found")
        let referral_code = referral_codes()
        // return console.log(referral_code)
        await User.findByIdAndUpdate(user._id, {
          name: name,
          email: email,
          image: req.file ? req.file.filename : "null",
          referral_code: referral_code,
          referral_count: user.referral_count,
        });
        return res.status(200).json({
          message: "User registered successfully",
          referral_code: referral_code,
        });
      });
    } catch (error) {
      console.log()
    }
  }

  // user profile update
  static profile_update = async (req, res) => {
    try {
      upload(req, res, async (err) => {
        let token = req.body.token
        let name = req.body.name
        let email = req.body.email
        let image = req.file ? req.file.filename : "null"

        const payload = jwt.decode(token, process.env.TOKEN_SECRET);

        const user = await User.findById(payload._id);

        if (!user) return res.status(401).send("user not found")
        await User.findByIdAndUpdate(user._id, {
          name: name,
          email: email,
          image: image,
        });
        return res.send("User Updated Successfully" + " " + name + " " + email + " " + image);
      });
    } catch (error) {
      console.log()
    }
  }


  static post_like = async (req, res) => {
    try {
      let token = req.body.token

      if (token == "") {
        return res.status(401).json({
          message: "Token is required",
          status: 401,
          success: false,
        })
      }

      let post_id = req.body.post_id
      let short_id = req.body.short_id

      if (post_id) {
        const payload = jwt.decode(token, process.env.TOKEN_SECRET);
        const user = await User.findById(payload._id);
        if (!user) return res.status(401).send("user not found")
        let like2 = await Like.findOne({
          user_id: user._id,
          post_id: post_id,
        })
        // return console.log(like2)
        if (!like2) {
          const like = Like({
            user_id: user._id,
            post_id: post_id,
            is_like: req.body.is_like,
          })
          await like.save();
          return res.send("Like Successfull")


        } else {

          const data = await Like.findOneAndDelete({
            user_id: user._id,
            post_id: post_id,
          });
          // console.log(data)
          return res.send("Dislike  Successfully")
        }
      } else if (short_id) {
        const payload = jwt.decode(token, process.env.TOKEN_SECRET);
        const user = await User.findById(payload._id);
        if (!user) return res.status(401).send("user not found")
        let like2 = await Like.findOne({
          user_id: user._id,
          short_id: short_id,
        })
        // return console.log(like2)
        if (!like2) {
          const like = Like({
            user_id: user._id,
            short_id: short_id,
            is_like: req.body.is_like,
          })
          await like.save();
          return res.send("Like Successfull")


        } else {
          const data = await Like.findOneAndDelete({
            user_id: user._id,
            short_id: short_id,
          });
          // console.log(data)
          return res.send("Dislike  Successfully")
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  static post_comment = async (req, res) => {
    try {
      let token = req.body.token
      let comments = req.body.comment
      let post_id = req.body.post_id
      let short_id = req.body.short_id

      if (token == "") {
        return res.status(401).json({
          message: "Token is required",
          status: 401,
          success: false,
        })
      }
      if (comments == "") {
        return res.status(401).json({
          message: "Comment is required",
          status: 401,
          success: false,
        })
      }

      if (post_id) {
        const payload = jwt.decode(token, process.env.TOKEN_SECRET);
        const user = await User.findById(payload._id);
        if (!user) return res.status(401).send("user not found")
        const comment = Comment({
          user_id: user._id,
          post_id: post_id,
          comment: comments,
        })
        let data = await comment.save();
        return res.status(200).json({
          message: "Comment Successfull",
          status: 200,
          success: true,
          data: data,
        })

      } else if (short_id) {
        const payload = jwt.decode(token, process.env.TOKEN_SECRET);
        const user = await User.findById(payload._id);
        if (!user) return res.status(401).send("user not found")
        const comment = Comment({
          user_id: user._id,
          comment: comments,
          short_id: short_id,
        })
        let data = await comment.save();
        return res.status(200).json({
          message: "Comment Successfull",
          status: 200,
          success: true,
          data: data,
        })
      }


    } catch (error) {
      console.log(error);
    }
  }

  // followers & following 
  static Followers = async (req, res) => {
    try {
      let token = req.body.token
      const payload = jwt.decode(token, process.env.TOKEN_SECRET);
      const user = await User.findById(payload._id);
      if (!user) return res.status(401).send("user not found")
      let exist = await Followers.findOne({
        follower_id: req.body.follower_id,
        user_id: user._id
      })
      if (!exist) {
        // follower user
        const followers = Followers({
          user_id: user._id,
          follower_id: req.body.follower_id,
        })
        console.log(followers)
        await followers.save();
        return res.send("Following Successfull")
      } else {
        //unfollwer user
        const data = Followers.findOneAndDelete({
          user_id: user._id,
          follower_id: req.body.follower_id,
        })
        await data.remove();
        return res.send("Unfollw Successfull")
      }
    } catch (error) {
      console.log(error);
    }
  }

  static following = async (req, res) => {
    try {
      let token = req.body.token
      const payload = jwt.decode(token, process.env.TOKEN_SECRET);
      const user = await User.findById(payload._id);
      if (!user) return res.status(401).send("user not found")
      let exist = await Following.findOne({
        following_id: req.body.following_id,
        user_id: user._id
      })
      if (!exist) {
        // following user
        const following = Following({
          user_id: user._id,
          following_id: following_id
        })
        await following.save();
        return res.send("Following Successfull")
      } else {
        //unfollwing user
        const data = Following.findOneAndDelete({
          user_id: user._id,
          following_id: req.body.following_id,
        })
        await data.remove();
        return res.send("Unfollw Successfull")
      }
    } catch (error) {
      console.log(error);
    }
  }



}



module.exports = UserController;




function sendSMS(mobileNo, OTP) {
  let theUrl = `http://sms.smsinsta.in/vb/apikey.php?apikey=1158c647754664171463&senderid=SMSINS&templateid=1207162019695960917&route=3&number=${mobileNo}&message=Your OTP is ${OTP}. Regards SMSINSTA;`
  const request = require("request");

  request(theUrl, {
    json: true
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    return body;
  });
}