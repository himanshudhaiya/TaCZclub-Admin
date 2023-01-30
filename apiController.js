const User = require("../../models/User");
const Category = require("../../models/Category");
const SubCategory = require("../../models/SubCategory");
const Master = require("../../models/Master");
const Product = require("../../models/Product");
const Slider = require("../../models/Slider");
const PrivacyPolicy = require("../../models/PrivacyPolicy");
const How = require("../../models/How");
const TermsCondition = require("../../models/TermsCondition");
const Blog = require("../../models/Blog");
const SiteSetting = require("../../models/SiteSetting");
const Message = require("../../models/Message");
const UserDocument = require("../../models/UserDocument");
const AcademicSession = require("../../models/AcademicSession");
const Class = require("../../models/Class");
const Section = require("../../models/Section");
const Quote = require("../../models/Quote");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const Like = require("../../models/Like");
const Share = require("../../models/Share");
const About = require("../../models/About");
const Faq = require("../../models/Faq");
const Gallery = require("../../models/Gallery");
const Support = require("../../models/Support");
const CustomTerm = require("../../models/CustomTerm");
const AssignedSections = require("../../models/AssignedSections");
const multer = require("multer");
const path = require("path");
const root = process.cwd();
const imageFilter = require("../../config/imageFilter");
const bcrypt = require("bcrypt");
const fs = require("fs");
var ObjectId = require("mongodb").ObjectID;
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const async = require("async");
const baseURL = process.env.URL;
const userProfileUrl = baseURL+'uploads/documents/';

const storage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/slider"),
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});
const storageBlog = multer.diskStorage({
  destination: path.join(root, "/public/uploads/blog"),
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});
const storageDocument = multer.diskStorage({
  destination: path.join(root, "/public/uploads/documents"),
  filename: function (req, file, cb) {
    //cb(null, `${Date.now()}.jpg`);
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
}).single("image");
const uploadBlog = multer({
  storage: storageBlog,
  fileFilter: imageFilter,
}).single("image");

const email_regex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

class apiController {
  static testApi = async (req, res) => {
    try {
      res.json({
        message: "Api request success",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static register = async (req, res) => {
    try {
      var name_regex = /^[a-zA-Z ]{2,30}$/;
      var mobile_regex = /^\d{10}$/;
      if (!req.body.email) {
        return res.json({
          message: "Please enter email",
          success: true,
        });
      } else if (!req.body.user_name) {
        return res.json({
          message: "Please enter full name",
          success: true,
        });
      } else if (!req.body.mobile_number) {
        return res.json({
          message: "Please enter mobile_number",
          success: true,
        });
      } else if (!req.body.password) {
        return res.json({
          message: "Please enter password",
          success: true,
        });
      } else {
        if (!email_regex.test(req.body.email)) {
          return res.json({
            message: "Please enter valid email",
            success: true,
          });
        } else {
          let checkUserExist = await User.findOne({ email: req.body.email });
          if (checkUserExist) {
            return res.json({
              message: "You have already registered. Please login",
              success: true,
            });
          } else {
            const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            delete req.body.password;
            req.body.password = hashedPassword;
            req.body.role = ROLE_USER;
            const saveData = User(req.body);
            await saveData.save();
            saveData.password = null;
            return res.json({
              message: "You have successfully registered",
              success: true,
              data: saveData,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static login = async (req, res) => {
    const email = req.body.email;
    let msg = "Something went wrong please try again later";
    if (!req.body.email) {
      return res.json({
        message: "Please enter email",
        success: false,
      });
    } else if (!req.body.password) {
      return res.json({
        message: "Please enter password",
        success: false,
      });
    }
    if (email.split('').includes('@') && !email_regex.test(email)) {
      return res.json({
        message: "Please enter valid email",
        success: false,
      });
    }

    try {
      let user = await User.findOne({  $or : [{email: email },{mobile_number: email }]}).lean();
      if (!user) {
        return res.json({
          message: "User Not Found",
          success: false,
        });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.json({
          message: "Email or Password invalid",
          success: false,
        });
      }
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.TOKEN_SECRET
      );
      user.password = null;
      return res.json({
        message: "You have successfully logged-in",
        success: true,
        data: user,
        token: token,
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static getAllInstitutes = async (req, res) => {
    let sender = req.user;
    
    const body = req.body;
    let msg = "Something went wrong please try again later";
    let findCondition = {}

    if(sender.parentId == null){
      findCondition = {
        role: ROLE_CUSTOMER,
        user_type: { $in: ["single", "group"] },
        role_type: { $ne: null },
      }
    }else{
      if(sender.role == 'employee'){
        findCondition = {
          parentId: { $in: [sender._id, sender.parentId] },
          role: { $in: [ROLE_CUSTOMER, "employee_customer"] },
          user_type: { $in: ["single", "group"] },
          role_type: { $ne: null },
        }
      }else{
        if(sender.sub_role == 'employee'){
          findCondition = {
            _id: sender.parentId,
           // role: ROLE_CUSTOMER,
            // user_type: { $in: ["single", "group"] },
            // role_type: { $ne: null },
          }
        }else{
          findCondition = {
            parentId: sender.parentId,
            role: ROLE_CUSTOMER,
            user_type: { $in: ["single", "group"] },
            role_type: { $ne: null },
          }
        }
      }
    }
    console.log("findCondition",sender)
    
    if(req.body && req.body.searchText && req.body.searchText != ''){
      findCondition.user_name = { $regex: '.*' + req.body.searchText + '.*', $options: 'i' }
    }
    try {
      let data = await User.find(findCondition)
        .select(
          "parentId user_name mobile_number email address whatsapp_mobile_number pincode city state created_at photo"
        )
        .sort({ created_at: -1 });
          console.log(data)
      return res.json({
        message: "Success",
        success: true,
        data: data,
        mediaUrl:userProfileUrl
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static getInstitutesDetails = async (req, res) => {
    const body = req.body;
    let sender = req.user;
    let msg = "Something went wrong please try again later";
    if (!req.body.institute_id) {
      return res.json({
        message: "institute_id is required",
        success: false,
      });
    }
    let institute_id = req.body.institute_id;
    let match  = {
      instituteId: ObjectId(institute_id),
      //role: ROLE_CUSTOMER,
    }
    if(req.body && req.body.searchText && req.body.searchText != ''){
      //match.class_name = { $regex: '.*' + req.body.searchText + '.*', $options: 'i' }
    }

    if(sender.sub_role == 'employee' && sender.role == 'customer'){
      match.classTeacher = ObjectId(sender._id)
    }
    console.log(match)
    try {
      await AssignedSections.aggregate([
        {
          $lookup: {
            from: "classes",
            let: {
              class: "$class",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ["$_id", "$$class"] }] },
                },
              },
            ],
            as: "classDetails",
          },
        },
        { $unwind: "$classDetails" },
        {
          $lookup: {
            from: "users",
            let: {
              instituteId: "$instituteId",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ["$_id", "$$instituteId"] }] },
                },
              },
            ],
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },
        {
          $lookup: {
            from: "sections",
            let: {
              section: "$section",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ["$_id", "$$section"] }] },
                },
              },
            ],
            as: "sectionDetails",
          },
        },
        { $unwind: "$sectionDetails" },
        {
          $lookup: {
            from: "users",
            let: {
              class: "$class",
              secion: "$secion",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ["$class", "$$class"] },{ $eq: ["$secion", "$$secion"] }] },
                },
              },
            ],
            as: "classStrength",
          },
        },
        {
          $project: {
            "photo": {
              "$switch": {
                "branches": [
                  { "case": { "$ne": [ "$userDetails.photo", null ] }, "then": "$userDetails.photo" },
                ],
                "default": 'null'
              }
            },
            "instituteId": 1,
            //"userDetails": 1,
            //"classDetails": 1,
            //"sectionDetails": 1,
            "pending_count": {$size : '$classStrength'},
            "completed_count": {$size : '$classStrength'},
            parentId: "$userDetails._id",
            role: "$userDetails.role",
            user_name: "$userDetails.user_name",
            class: "$classDetails._id",
            section: "$sectionDetails._id",
            class_name: "$classDetails.class_name",
            section_name: "$sectionDetails.section_name",
            classTeacher: 1,
            created_at: 1,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        
        {
          $match: match,
        },
      ]).exec(function (err, data) {
        console.log(data)
        return res.json({
          message: "Success",
          success: true,
          data: data,
          mediaUrl:userProfileUrl
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static getInstitutesStudents = async (req, res) => {
    const body = req.body;
    let msg = "Something went wrong please try again later";
    if (!req.body.institute_id) {
      return res.json({
        message: "institute_id is required",
        success: false,
      });
    }
    if (!req.body.section_id) {
      return res.json({
        message: "section_id is required",
        success: false,
      });
    }
    if (!req.body.class_id) {
      return res.json({
        message: "class_id is required",
        success: false,
      });
    }
    let institute_id = req.body.institute_id;
    let section_id = req.body.section_id;
    let class_id = req.body.class_id;
    let match  = {
      parentId: ObjectId(institute_id),
      class: ObjectId(class_id),
      section: ObjectId(section_id),
      role: ROLE_CUSTOMER,
    }
    if(req.body && req.body.searchText && req.body.searchText != ''){
      match.user_name = { $regex: '.*' + req.body.searchText + '.*', $options: 'i' }
    }
    try {
      await User.aggregate([
        {
          $match: match,
        },
        {
          $project: {
            parentId              : 1,
            user_name             : 1,
            email                 : 1,
            mobile_number         : 1,
            whatsapp_mobile_number: 1,
            created_at            : 1,
            address               : 1,
            location              : 1,
            photo                 : 1,
            designation           : 1,
            address               : 1,
            role                  : 1,
            sub_role              : 1,
            user_type             : 1,
            role_type             : 1,
            firm_name             : 1,
            location              : 1,
            serial_number         : 1,
            registration_number   : 1,
            student_number        : 1,
            admission_number      : 1,
            roll_number           : 1,
            rfid_card_number      : 1,
            house                 : 1,
            caste                 : 1,
            religion              : 1,
            nationality           : 1,
            gender                : 1,
            dob                   : 1,
            age                   : 1,
            pincode               : 1,
            city                  : 1,
            state                 : 1,
            fee_category          : 1,
            aadhar_number         : 1,
            session               : 1,
            class                 : 1,
            section               : 1,
            stream                : 1,
            user_id               : 1,
            father_name           : 1,
            father_user_id        : 1,
            father_contact_number : 1,
            father_whatsapp_contact_number                 : 1,
            landline_number                 : 1,
            father_occupation                 : 1,
            father_income                 : 1,
            father_email                 : 1,
            mother_name                 : 1,
            mother_user_id                 : 1,
            mother_contact_number                 : 1,
            mother_whatsapp_contact_number                 : 1,
            mother_occupation                 : 1,
            mother_income                 : 1,
            mother_email                 : 1,
            guardian_name                 : 1,
            guardian_user_id                 : 1,
            guardian_contact_number                 : 1,
            guardian_whatsapp_contact_number                 : 1,
            guardian_occupation                 : 1,
            guardian_income                 : 1,
            guardian_email                 : 1,
            guardian_relationship                 : 1,
            emergency_number                 : 1,
            transport_facility                 : 1,
            centeen_facility                 : 1,
            library_facility                 : 1,
            hostel_facility                 : 1,
            "photo": { $ifNull: [ "$photo", null ] }
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
      ]).exec(function (err, data) {
        return res.json({
          message: "Success",
          success: true,
          data: data,
          mediaUrl:userProfileUrl
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static sendMessage = async (req, res) => {
    const body = req.body;
    let msg = "Something went wrong please try again later";
    if (!req.body.institute_id) {
      return res.json({
        message: "institute_id is required",
        success: false,
      });
    }

    if (!req.body.message) {
      return res.json({
        message: "message is required",
        success: false,
      });
    }
    let receiver = req.body.institute_id;
    let sender = req.user._id;
    let message = req.body.message;
    try {
      let dataSave = {
        sender: sender,
        receiver: receiver,
        message: message,
      };
      const saveData = Message(dataSave);
      let saved = await saveData.save();
      return res.json({
        message: "Message sent successfully",
        success: true,
        data: saved,
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_messages = async (req, res) => {
    const body = req.body;
    let msg = "Something went wrong please try again later";
    if (!req.body.institute_id) {
      return res.json({
        message: "institute_id is required",
        success: false,
      });
    }
    let receiver = req.body.institute_id;
    let sender = req.user._id;
    try {
      await Message.aggregate([
        {
          $match: {
            sender: ObjectId(sender),
            receiver: ObjectId(receiver),
          },
        },
        {
          $project: {
            sender: 1,
            receiver: 1,
            message: 1,
            created_at: 1,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
      ]).exec(function (err, data) {
        return res.json({
          message: "Success",
          success: true,
          data: data,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_product_quotes_requiredments = async (req, res) => {
    const body = req.body;
    let msg = "Something went wrong please try again later";

    try {
      async.parallel(
        {
          products: async (callback) => {
            await Product.aggregate([
              {
                $match: {
                  status: PRODUCT_STATUS_ACTIVE,
                },
              },
              {
                $project: {
                  title: 1,
                  status: 1,
                  created_at: 1,
                },
              },
              {
                $sort: {
                  created_at: -1,
                },
              },
            ]).exec(function (err, data) {
              callback(null, data);
            });
          },
          product_type: async (callback) => {
            callback(null, PRODUCT_OPTION_ATTRIBUTE_TYPE);
          },
          surface_finish: async (callback) => {
            callback(null, PRODUCT_OPTION_SURFACES);
          },
          printing_types: async (callback) => {
            callback(null, PRODUCT_OPTION_PRINTING);
          },
          holder_types: async (callback) => {
            callback(null, PRODUCT_OPTION_HOLDER_TYPES);
          },
          others: async (callback) => {
            callback(null, PRODUCT_OPTION_OTHERS);
          },
        },
        function (err, results) {
          // results now equals to: results.one: 'abc\n', results.two: 'xyz\n'
          return res.json({
            message: "Success",
            success: true,
            products: results.products,
            product_type: results.product_type,
            surface_finish: results.surface_finish,
            printing_types: results.printing_types,
            holder_types: results.holder_types,
            others: results.others,
          });
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static create_quote = async (req, res) => {
    const body = req.body;
    let msg = "Something went wrong please try again later";
    if (!req.body.institute_id) {
      return res.json({
        message: "institute_id is required",
        success: false,
      });
    }

    if (!req.body.product_id) {
      return res.json({
        message: "product_id is required",
        success: false,
      });
    }
    if (!req.body.product_type) {
      return res.json({
        message: "product_type is required",
        success: false,
      });
    }
    if (!req.body.quantity) {
      return res.json({
        message: "quantity is required",
        success: false,
      });
    } else if (isNaN(req.body.quantity)) {
      return res.json({
        message: "invalid quantity, only numbers are allowed",
        success: false,
      });
    }
    if (!req.body.price) {
      return res.json({
        message: "price is required",
        success: false,
      });
    } else if (isNaN(req.body.price)) {
      return res.json({
        message: "invalid price, only numbers are allowed",
        success: false,
      });
    }
    let institute_id = req.body.institute_id;
    let instituteDetails = await User.findOne({ _id: institute_id }).lean();
    if (!instituteDetails) {
      return res.json({
        message: "Institute not found by given details",
        success: false,
        data: instituteDetails,
      });
    }
    let product_id = req.body.product_id;
    let quantity = req.body.quantity;
    let price = req.body.price;
    let product_type = req.body.product_type ? req.body.product_type : null;
    let surface_finish = req.body.surface_finish
      ? req.body.surface_finish
      : null;
    let printing_types = req.body.printing_types
      ? req.body.printing_types
      : null;
    let other = req.body.other ? req.body.other : null;
    let holder_types = req.body.holder_types ? req.body.holder_types : null;
    try {
      let dataSave = {
        institute_id: institute_id,
        user_id: req.user._id,
        product_id: product_id,
        quantity: quantity,
        price: price,
        product_type: product_type,
        surface_finish: surface_finish,
        printing_types: printing_types,
        other: other,
        holder_types: holder_types,
      };
      const saveData = Quote(dataSave);
      let saved = await saveData.save();
      return res.json({
        message: "Quote sent successfully",
        success: true,
        data: saved,
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_submitted_quotes = async (req, res) => {
    const body = req.body;
    let msg = "Something went wrong please try again later";
    if (!req.body.institute_id) {
      return res.json({
        message: "institute_id is required",
        success: false,
      });
    }
    let institute_id = req.body.institute_id;
    let user_id = req.user._id;
    let instituteDetails = await User.findOne({ _id: institute_id }).lean();
    if (!instituteDetails) {
      return res.json({
        message: "Institute not found by given details",
        success: false,
        data: instituteDetails,
      });
    }
    try {
      await Quote.aggregate([
        {
          $match: {
            institute_id: ObjectId(institute_id),
            user_id: ObjectId(user_id),
          },
        },
        {
          $lookup: {
            from: "products",
            let: {
              product_id: "$product_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ["$_id", "$$product_id"] }] },
                },
              },
              {
                $project: {
                  title: 1,
                  description: 1,
                  regular_price: 1,
                  sale_price: 1,
                },
              },
            ],
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            institute_id: 1,
            user_id: 1,
            product_id: 1,
            quantity: 1,
            price: 1,
            product_type: 1,
            surface_finish: 1,
            printing_types: 1,
            other: 1,
            holder_types: 1,
            status: 1,
            created_at: 1,
            productDetails: 1,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
      ]).exec(function (err, data) {
        return res.json({
          message: "Success",
          success: true,
          data: data,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_quote_details = async (req, res) => {
    const body = req.body;
    let msg = "Something went wrong please try again later";
    if (!req.body.institute_id) {
      return res.json({
        message: "institute_id is required",
        success: false,
      });
    }
    if (!req.body.quote_id) {
      return res.json({
        message: "quote_id is required",
        success: false,
      });
    }
    let institute_id = req.body.institute_id;
    let quote_id = req.body.quote_id;
    let user_id = req.user._id;
    let instituteDetails = await User.findOne({ _id: institute_id }).lean();
    if (!instituteDetails) {
      return res.json({
        message: "Institute not found by given details",
        success: false,
        data: instituteDetails,
      });
    }
    try {
      await Quote.aggregate([
        {
          $match: {
            _id: ObjectId(quote_id),
          },
        },
        {
          $lookup: {
            from: "products",
            let: {
              product_id: "$product_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ["$_id", "$$product_id"] }] },
                },
              },
              {
                $project: {
                  title: 1,
                  description: 1,
                  regular_price: 1,
                  sale_price: 1,
                },
              },
            ],
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            institute_id: 1,
            user_id: 1,
            product_id: 1,
            quantity: 1,
            price: 1,
            product_type: 1,
            surface_finish: 1,
            printing_types: 1,
            other: 1,
            holder_types: 1,
            status: 1,
            created_at: 1,
            productDetails: 1,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
      ]).exec(function (err, data) {
        let returnData = data.length ? data[0] : null;
        return res.json({
          message: "Success",
          success: true,
          data: returnData,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static add_institute_student = async (req, res) => {
    try {
      let user = req.user;
      let data = req.body;
      console.log("req.body",req.body)
      if (!req.body.institute_id) {
        return res.json({
          message: "Please enter institute_id",
          success: false,
        });
      } 
      if (!req.body.section_id) {
        return res.json({
          message: "Please enter section_id",
          success: false,
        });
      } 
      if (!req.body.class_id) {
        return res.json({
          message: "Please enter class_id",
          success: false,
        });
      } 
      if (!req.body.email) {
        return res.json({
          message: "Please enter email",
          success: false,
        });
      } 
      else if (!req.body.user_name) {
        return res.json({
          message: "Please enter full name",
          success: false,
        });
      }
      else if (!req.body.password) {
        return res.json({
          message: "Please enter password",
          success: false,
        });
      }
      else if (!req.body.mobile_number) {
        return res.json({
          message: "Please enter mobile_number",
          success: false,
        });
      }
      else if (!req.body.whatsapp_mobile_number) {
        return res.json({
          message: "Please enter whatsapp_mobile_number",
          success: false,
        });
      }
      else if (!req.body.location) {
        return res.json({
          message: "Please enter location",
          success: false,
        });
      }
      else if (!req.body.address) {
        return res.json({
          message: "Please enter address",
          success: false,
        });
      }
      
      let checkexist = await User.findOne({  $or : [{email: data.email },{mobile_number: data.mobile_number }]}).lean();
      if (checkexist) {
        if(data.email.toLowerCase() == checkexist.email.toLowerCase())
          return res.json({
            message:
              "This email is associated with another account. Please try with different email",
            success: false,
          });
        else
          return res.json({
            message:
              "This mobile no is associated with another account. Please try with different mobile no.",
            success: false,
          });
      }
      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
      const hashedPassword = await bcrypt.hash(data.password, salt);
      delete data.password;
      data.section = data.section_id;
      data.class = data.class_id;
      delete data.section_id;
      delete data.class_id;
      data.password = hashedPassword;
      data.role = ROLE_CUSTOMER;
      data.sub_role = ROLE_CUSTOMER_SUBROLE_STUDENT;
      data.parentId = data.institute_id;
      const saveData = User(data);
      await saveData.save();
      return res.json({ message: "Student added successfully", success: true, mediaUrl:userProfileUrl });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json("Something went wrong please try again later");
    }
  };
  static edit_institute_student = async (req, res) => {
    try {
      let user = req.user;
      let data = req.body;
      if (!req.body.student_id) {
        return res.json({
          message: "Please enter student_id",
          success: false,
        });
      } 
      if (!req.body.institute_id) {
        return res.json({
          message: "Please enter institute_id",
          success: false,
        });
      } 
      if (!req.body.section_id) {
        return res.json({
          message: "Please enter section_id",
          success: false,
        });
      } 
      if (!req.body.class_id) {
        return res.json({
          message: "Please enter class_id",
          success: false,
        });
      } 
      if (!req.body.user_name) {
        return res.json({
          message: "Please enter full name",
          success: false,
        });
      }
      else if (!req.body.mobile_number) {
        return res.json({
          message: "Please enter mobile_number",
          success: false,
        });
      }
      else if (!req.body.whatsapp_mobile_number) {
        return res.json({
          message: "Please enter whatsapp_mobile_number",
          success: false,
        });
      }
      else if (!req.body.location) {
        return res.json({
          message: "Please enter location",
          success: false,
        });
      }
      else if (!req.body.address) {
        return res.json({
          message: "Please enter address",
          success: false,
        });
      }
      
      let checkexist = await User.findOne({ _id: data.student_id });
      if (!checkexist) {
        return res.json({
          message:
            "Student details not found with given details.",
          success: false,
        });
      }
      data.section = data.section_id;
      data.class = data.class_id;
      delete data.section_id;
      delete data.class_id;
      delete data.email;
      data.role = ROLE_CUSTOMER;
      data.sub_role = ROLE_CUSTOMER_SUBROLE_STUDENT;
      data.parentId = data.institute_id;
      await User.findOneAndUpdate({_id:checkexist._id},{$set:data})

      let userUpdate = await User.findOne({_id:checkexist._id}).lean()
     
      return res.json({ message: "Student updated successfully", success: true,data: userUpdate, mediaUrl:userProfileUrl });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json("Something went wrong please try again later");
    }
  };
  static upload_student_photo = async (req, res) => {
    try {
      const storageDocument = multer.diskStorage({
        destination: path.join(root, "/public/uploads/documents"),
        filename: function (req, file, cb) {
          //cb(null, `${Date.now()}.jpg`);
          cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
          );
        },
      });
      const uploadDoc = multer({
        storage: storageDocument,
      }).single("photo");

      
      uploadDoc(req, res, async function (err) {
        
        if (req.fileValidationError) {
          return res.send({
            message: req.fileValidationError,
            success: true,
          });
        } else if (!req.file) {
          return res.send({
            message: "Please upload an image",
            success: true,
          });
        } else if (err instanceof multer.MulterError) {
          console.log(err);
          return res.send({ message: err, success: true });
        } else if (err) {
          console.log(err);
          return res.send({ message: err, success: true });
        }
        let user = req.user;
        let data = req.body;
        if (!req.body.student_id) {
          return res.json({
            message: "Please enter student_id",
            success: false,
          });
        } 
        if (!req.body.institute_id) {
          return res.json({
            message: "Please enter institute_id",
            success: false,
          });
        } 
        if (!req.body.section_id) {
          return res.json({
            message: "Please enter section_id",
            success: false,
          });
        } 
        if (!req.body.class_id) {
          return res.json({
            message: "Please enter class_id",
            success: false,
          });
        }         
        let checkexist = await User.findOne({ _id: data.student_id });
        if (!checkexist) {
          return res.json({
            message:
              "Student details not found with given details.",
            success: false,
          });
        }
       
        await User.findOneAndUpdate({_id:checkexist._id},{$set:{photo:req.file.filename}})

        const slider = UserDocument({
          parentId: data.student_id,
          document: req.file.filename,
          title: "Student Photo",
          type: "student_photo"
        });
        await slider.save();

        let userUpdate = await User.findOne({_id:checkexist._id}).lean()
      
        return res.json({ message: "Photo updated successfully", success: true,data: userUpdate, mediaUrl:userProfileUrl });
      })
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json("Something went wrong please try again later");
      }
      
  };
  static get_all_posts = async (req, res) => {
    const postUrl = baseURL+'uploads/posts/';
    const body = req.body;
    let msg = "Something went wrong please try again later";
    let findCondition = {
    }
    if(req.body && req.body.searchText && req.body.searchText != ''){
      findCondition.title = { $regex: '.*' + req.body.searchText + '.*', $options: 'i' }
    }
    try {

      await Post.aggregate([
        
        {
          $lookup: {
            from: "likes",
            let: {
              postId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ["$postId", "$$postId"] }] },
                },
              },
              { "$lookup": {
                "from": "users",
                "let": { "postId": "$postId","userId": "$userId" },
                "pipeline": [
                  { "$match": { "$expr": { "$eq": ["$_id", "$$userId"] }}},
                  { "$project": { "user_name": 1, "photo": 1, "_id": 1, "email": 1 }}
                ],
                "as": "userDetails"
              }},
             { "$unwind": "$userDetails" },
            ],
            as: "likes",
          },
        },
        {
          $lookup: {
            from: "likes",
            let: {
              postId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", ObjectId(req.user._id)] },
                  ] },
                },
              },
            ],
            as: "likes_by_user",
          },
        },
        {
          $lookup: {
            from: "comments",
            let: {
              postId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ["$postId", "$$postId"] }] },
                },
              },
              { "$lookup": {
                "from": "users",
                "let": { "postId": "$postId","userId": "$userId" },
                "pipeline": [
                  { "$match": { "$expr": { "$eq": ["$_id", "$$userId"] }}},
                  { "$project": { "user_name": 1, "photo": 1, "_id": 1, "email": 1 }}
                ],
                "as": "userDetails"
              }},
             { "$unwind": "$userDetails" },
            ],
            as: "comments",
          },
        },
        {
          $lookup: {
            from: "shares",
            let: {
              postId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ["$postId", "$$postId"] }] },
                },
              },
              { "$lookup": {
                "from": "users",
                "let": { "postId": "$postId","userId": "$userId" },
                "pipeline": [
                  { "$match": { "$expr": { "$eq": ["$_id", "$$userId"] }}},
                  { "$project": { "user_name": 1, "photo": 1, "_id": 1, "email": 1 }}
                ],
                "as": "userDetails"
              }},
             { "$unwind": "$userDetails" },
            ],
            as: "shares",
          },
        },
        {
          $project: {
            "liked_by_me": {
              "$switch": {
                "branches": [
                  { "case": { "$gt": [ "$likes_by_user", [] ] }, "then": 1 },
                ],
                "default": 0
              }
            },
            title: 1,
            description: 1,
            image: 1,
            created_at: 1,
            likes: 1,
            comments: 1,
            shares: 1,
            total_likes: { $size: '$likes' },
            total_comments: { $size: '$comments' },
            total_shares: { $size: '$shares' },
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $match: findCondition,
        },
      ]).exec(function (err, data) {
        return res.json({
          message: "Success",
          success: true,
          data: data,
          mediaUrl:postUrl,
          userImageUrl:userProfileUrl
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_post_comments = async (req, res) => {
    const postUrl = baseURL+'uploads/posts/';
    const body = req.body;
    let msg = "Something went wrong please try again later";
    let findCondition = {
      
    }

    if (!req.body.post_id) {
      return res.json({
        message: "Please enter post_id",
        success: false,
      });
    } 
    findCondition.postId = req.body.post_id;
    if(req.body && req.body.searchText && req.body.searchText != ''){
      findCondition.title = { $regex: '.*' + req.body.searchText + '.*', $options: 'i' }
    }
    try {
      let data = await Comment.find(findCondition).sort({ created_at: -1 });

      return res.json({
        message: "Success",
        success: true,
        data: data,
        mediaUrl:postUrl
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static add_post_comment = async (req, res) => {
    const postUrl = baseURL+'uploads/posts/';
    const body = req.body;
    let msg = "Something went wrong please try again later";
    let findCondition = {
      
    }
    if (!req.body.post_id) {
      return res.json({
        message: "Please enter post_id",
        success: false,
      });
    } 
    if (!req.body.title) {
      return res.json({
        message: "Please enter title",
        success: false,
      });
    } 
    findCondition.postId = req.body.post_id;
    if(req.body && req.body.searchText && req.body.searchText != ''){
      findCondition.title = { $regex: '.*' + req.body.searchText + '.*', $options: 'i' }
    }
    try {
      const slider = Comment({
        postId: req.body.post_id,
        userId: req.user._id,
        title: req.body.title,
      });
      let saveData = await slider.save();

      return res.json({
        message: "Comment added successfully",
        success: true,
        data: saveData,
        mediaUrl:postUrl
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static like_unlike_post = async (req, res) => {
    const postUrl = baseURL+'uploads/posts/';
    const body = req.body;
    
    let msg = "Something went wrong please try again later";
    let findCondition = {
      
    }
    if (!req.body.post_id) {
      return res.json({
        message: "Please enter post_id",
        success: false,
      });
    } 
    let user_id = req.user._id;
    let checkexist = await Like.findOne({ userId: user_id,postId:req.body.post_id });
    if (!checkexist) {
      const slider = Like({
        postId: req.body.post_id,
        userId: req.user._id,
      });
      let saveData = await slider.save();

      return res.json({
        message: "Liked successfully",
        success: true,
        data: saveData,
        mediaUrl:postUrl
      });
    }else{
      let datas = await Like.findOneAndDelete({ userId: user_id,postId:req.body.post_id });
      return res.json({
        message: "Un-liked successfully",
        success: true,
        data: datas,
        mediaUrl:postUrl
      });
    }
  }
  static increase_share_counter = async (req, res) => {
    const postUrl = baseURL+'uploads/posts/';
    const body = req.body;
    let msg = "Something went wrong please try again later";
    let findCondition = {
      
    }
    if (!req.body.post_id) {
      return res.json({
        message: "Please enter post_id",
        success: false,
      });
    } 
    
    findCondition.postId = req.body.post_id;
    if(req.body && req.body.searchText && req.body.searchText != ''){
      findCondition.title = { $regex: '.*' + req.body.searchText + '.*', $options: 'i' }
    }
    try {
      const slider = Share({
        postId: req.body.post_id,
        userId: req.user._id,
      });
      let saveData = await slider.save();

      return res.json({
        message: "Shared successfully",
        success: true,
        data: saveData,
        mediaUrl:postUrl
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_about_us = async (req, res) => {
    const body = req.body;
    let msg = "Something went wrong please try again later";
    let findCondition = {
     
    }
    try {
      let data = await About.findOne(findCondition).select("description created_at")
        .sort({ created_at: -1 });

      return res.json({
        message: "Success",
        success: true,
        data: data,
        mediaUrl:userProfileUrl
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_privacy_policy = async (req, res) => {
    const body = req.body;
    let msg = "Something went wrong please try again later";
    let findCondition = {
     
    }
    try {
      let data = await PrivacyPolicy.findOne(findCondition).select("content created_at")
        .sort({ created_at: -1 });

      return res.json({
        message: "Success",
        success: true,
        data: data,
        mediaUrl:userProfileUrl
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_term_conditions = async (req, res) => {
    const body = req.body;
    let msg = "Something went wrong please try again later";
    let findCondition = {
     
    }
    try {
      let data = await TermsCondition.findOne(findCondition).select("content created_at")
        .sort({ created_at: -1 });

      return res.json({
        message: "Success",
        success: true,
        data: data,
        mediaUrl:userProfileUrl
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_how_it_works = async (req, res) => {
    const body = req.body;
    let msg = "Something went wrong please try again later";
    let findCondition = {
     
    }
    try {
      let data = await How.findOne(findCondition).select("content created_at")
        .sort({ created_at: -1 });

      return res.json({
        message: "Success",
        success: true,
        data: data,
        mediaUrl:userProfileUrl
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_gallery_categories = async (req, res) => {
    //const postUrl = baseURL+'uploads/posts/';
    const body = req.body;
    let msg = "Something went wrong please try again later";
    let findCondition = {
    }
    
    try {

      await Category.aggregate([
        
        {
          $project: {
           
            title: 1,
            name: 1,
            created_at: 1,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $match: findCondition,
        },
      ]).exec(function (err, data) {
        return res.json({
          message: "Success",
          success: true,
          data: data,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_gallery_categories_photos = async (req, res) => {
    const postUrl = baseURL+'uploads/gallery/';
    const body = req.body;
    let msg = "Something went wrong please try again later";
    let findCondition = {
    }
    if (!req.body.category_id) {
      return res.json({
        message: "Please enter category_id",
        success: false,
      });
    } 
    findCondition.categoryId = ObjectId(req.body.category_id);
    try {

      await Gallery.aggregate([
        
        {
          $project: {
           
            categoryId: 1,
            title: 1,
            image: 1,
            created_at: 1,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $match: findCondition,
        },
      ]).exec(function (err, data) {
        return res.json({
          message: "Success",
          success: true,
          data: data,
          imageUrl: postUrl,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static support_form = async (req, res) => {
    const body = req.body;
    let msg = "Something went wrong please try again later";
    let findCondition = {
      
    }
    if (!req.body.name) {
      return res.json({
        message: "Please enter name",
        success: false,
      });
    } 
    if (!req.body.email) {
      return res.json({
        message: "Please enter email",
        success: false,
      });
    } 
    if (!req.body.mobile_number) {
      return res.json({
        message: "Please enter mobile_number",
        success: false,
      });
    } 
    if (!req.body.text) {
      return res.json({
        message: "Please enter text",
        success: false,
      });
    } 
   
    try {
      const slider = Support({
        name: req.body.name,
        email: req.body.email,
        mobile_number: req.body.mobile_number,
        text: req.body.text,
      });
      let saveData = await slider.save();

      return res.json({
        message: "Enquiry added successfully",
        success: true,
        data: saveData,
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_site_settings = async (req, res) => {
    const body = req.body;
    let msg = "Something went wrong please try again later";
    let findCondition = {
      
    }
   
    try {
      let data = await SiteSetting.findOne(findCondition)
       
        .sort({ created_at: -1 });

      return res.json({
        message: "Success",
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_id_card_fields = async (req, res) => {
    const body = req.body;
    let msg = "Something went wrong please try again later";
    if (!req.body.institute_id) {
      return res.json({
        message: "institute_id is required",
        success: false,
      });
    }
    let institute_id = req.body.institute_id;
    let match  = {
      _id: ObjectId(institute_id),
    }
    let data = await User.findOne({_id:institute_id}).select('photo role user_name idCardsFields email mobile_number').lean();
    let checkVals = []
    if(data && data.idCardsFields && data.idCardsFields.length){
       if(!data.idCardsFields.includes('StudentEmail')){
        data.idCardsFields.push("StudentEmail");
       }
       if(!data.idCardsFields.includes('StudentPassword')){
        data.idCardsFields.push("StudentPassword");
       }
    }else{
      if(data){
        data.idCardsFields = []
        if(!data.idCardsFields.includes('StudentEmail')){
          data.idCardsFields.push("StudentEmail");
         }
         if(!data.idCardsFields.includes('StudentPassword')){
          data.idCardsFields.push("StudentPassword");
         }
      }
    }
    return res.json({
      message: "Success",
      success: true,
      selected_data_fields: data,
      allFields: ID_CARDS_ALL_FIELDS,
      mediaUrl:userProfileUrl
    });
  };
  static add_student = async (req, res) => {
    const uploadStudentPhotoAndPhotoNumber = multer({
      storage: storageDocument,
    }).fields(
      [
        { 
          name: 'StudentPhotoAndPhotoNumber', 
          maxCount: 1 
        }, 
        { 
          name: 'FatherPhotoAndPhotoNumber', 
          maxCount: 1 
        },
        { 
          name: 'GuardianPhotoAndPhotoNumber', 
          maxCount: 1 
        },
        { 
          name: 'MotherPhotoAndPhotoNumber', 
          maxCount: 1 
        }
      ]
    )

    uploadStudentPhotoAndPhotoNumber(req, res, async function (errStudent) {
      
      const body = req.body;
      let msg = "Something went wrong please try again later";
      if (!req.body.institute_id) {
        return res.json({
          message: "institute_id is required",
          success: false,
        });
      }
      if (!req.body.StudentPassword) {
        return res.json({
          message: "StudentPassword is required",
          success: false,
        });
      }
      if (!req.body.StudentEmail) {
        return res.json({
          message: "StudentEmail is required",
          success: false,
        });
      }
      if (!req.body.StudentName) {
        return res.json({
          message: "StudentName is required",
          success: false,
        });
      }
      let checkexist = await User.findOne({ email: body.StudentEmail });
      if (checkexist) {
        return res.send({
          message:
            "This email is associated with another account. Please try with different email.",
          success: false,
        });
      }
      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
      const hashedPassword = await bcrypt.hash(body.StudentPassword, salt);
      let userPhoto = "";
      let userFatherPhoto = "";
      let userGuardianPhoto = "";
      let userMotherPhoto = "";
      if(req.files && req.files.StudentPhotoAndPhotoNumber && req.files.StudentPhotoAndPhotoNumber[0] && req.files.StudentPhotoAndPhotoNumber[0].filename){
        //console.log(req.files.StudentPhotoAndPhotoNumber[0])
        await sharp(req.files.StudentPhotoAndPhotoNumber[0].path)
        .resize(200)
        .jpeg({ quality: 20 })
        .toFile(
            path.resolve(req.files.StudentPhotoAndPhotoNumber[0].destination,'resized',req.files.StudentPhotoAndPhotoNumber[0].filename)
        )
        fs.unlinkSync(req.files.StudentPhotoAndPhotoNumber[0].path)
        userPhoto = 'resized/'+req.files.StudentPhotoAndPhotoNumber[0].filename;
      }
      if(req.files && req.files.MotherPhotoAndPhotoNumber && req.files.MotherPhotoAndPhotoNumber[0] && req.files.MotherPhotoAndPhotoNumber[0].filename){
        await sharp(req.files.MotherPhotoAndPhotoNumber[0].path)
        .resize(200)
        .jpeg({ quality: 20 })
        .toFile(
            path.resolve(req.files.MotherPhotoAndPhotoNumber[0].destination,'resized',req.files.MotherPhotoAndPhotoNumber[0].filename)
        )
        fs.unlinkSync(req.files.MotherPhotoAndPhotoNumber[0].path)
        userMotherPhoto = 'resized/'+req.files.MotherPhotoAndPhotoNumber[0].filename;
      }
      if(req.files && req.files.FatherPhotoAndPhotoNumber && req.files.FatherPhotoAndPhotoNumber[0] && req.files.FatherPhotoAndPhotoNumber[0].filename){
        await sharp(req.files.FatherPhotoAndPhotoNumber[0].path)
        .resize(200)
        .jpeg({ quality: 20 })
        .toFile(
            path.resolve(req.files.FatherPhotoAndPhotoNumber[0].destination,'resized',req.files.FatherPhotoAndPhotoNumber[0].filename)
        )
        fs.unlinkSync(req.files.FatherPhotoAndPhotoNumber[0].path)
        userFatherPhoto = 'resized/'+req.files.FatherPhotoAndPhotoNumber[0].filename;
      }
      if(req.files && req.files.GuardianPhotoAndPhotoNumber && req.files.GuardianPhotoAndPhotoNumber[0] && req.files.GuardianPhotoAndPhotoNumber[0].filename){
        await sharp(req.files.FatherPhotoAndPhotoNumber[0].path)
        .resize(200)
        .jpeg({ quality: 20 })
        .toFile(
            path.resolve(req.files.GuardianPhotoAndPhotoNumber[0].destination,'resized',req.files.GuardianPhotoAndPhotoNumber[0].filename)
        )
        fs.unlinkSync(req.files.GuardianPhotoAndPhotoNumber[0].path)
        userGuardianPhoto = 'resized/'+req.files.GuardianPhotoAndPhotoNumber[0].filename;
      }
      let saveData = {
        password  : hashedPassword,
        role      : ROLE_CUSTOMER,
        sub_role  : ROLE_CUSTOMER_SUBROLE_STUDENT,
        parentId  : req.body.institute_id,
        email     : req.body.StudentEmail && req.body.StudentEmail != "" ? req.body.StudentEmail : '',
        serial_number     : req.body.SerialNumber && req.body.SerialNumber != "" ? req.body.SerialNumber : '',
        registration_number     : req.body.RegNumber && req.body.RegNumber != "" ? req.body.RegNumber : '',
        admission_number     : req.body.AdmissionNumber && req.body.AdmissionNumber != "" ? req.body.AdmissionNumber : '',
        roll_number     : req.body.RollNumber && req.body.RollNumber != "" ? req.body.RollNumber : '',
        rfid_card_number     : req.body.RFIDCardNumber && req.body.RFIDCardNumber != "" ? req.body.RFIDCardNumber : '',
        house     : req.body.House && req.body.House != "" ? req.body.House : null,
        user_name     : req.body.StudentName && req.body.StudentName != "" ? req.body.StudentName : '',
        dob     : req.body.DateofBirth && req.body.DateofBirth != "" ? req.body.DateofBirth : '',
        mobile_number     : req.body.StudentContactNumber && req.body.StudentContactNumber != "" ? req.body.StudentContactNumber : '',
        location     : req.body.StudentAddress && req.body.StudentAddress != "" ? req.body.StudentAddress : '',
        pincode     : req.body.PinCode && req.body.PinCode != "" ? req.body.PinCode : '',
        city     : req.body.City && req.body.City != "" ? req.body.City : '',
        state     : req.body.SelectState && req.body.SelectState != "" ? req.body.SelectState : '',
        class     : req.body.SelectClass && req.body.SelectClass != "" ? req.body.SelectClass : null,
        section     : req.body.SelectSection && req.body.SelectSection != "" ? req.body.SelectSection : null,
        session     : req.body.SelectSession && req.body.SelectSession != "" ? req.body.SelectSession : null,
        photo     : userPhoto,
        father_name     : req.body.FatherName && req.body.FatherName != "" ? req.body.FatherName : '',
        father_contact_number     : req.body.FatherContactNumber && req.body.FatherContactNumber != "" ? req.body.FatherContactNumber : '',
        father_whatsapp_contact_number     : req.body.FatherWhatsappContactNumber && req.body.FatherWhatsappContactNumber != "" ? req.body.FatherWhatsappContactNumber : '',
        mother_name     : req.body.MotherName && req.body.MotherName != "" ? req.body.MotherName : '',
        mother_contact_number     : req.body.MotherContactNumber && req.body.MotherContactNumber != "" ? req.body.MotherContactNumber : '',
        guardian_name     : req.body.GuardianName && req.body.GuardianName != "" ? req.body.GuardianName : '',
        guardian_contact_number     : req.body.GuardianContactNumber && req.body.GuardianContactNumber != "" ? req.body.GuardianContactNumber : '',
      }
      //console.log(saveData);return false;

      const savesData = User(saveData);
      let addedUser = await savesData.save();

      if(userPhoto != '' && addedUser){
        const userPhotoslider = UserDocument({
          parentId: addedUser._id,
          title: "Student Photo",
          document: userPhoto,
          type: "student_photo",
        });
        await userPhotoslider.save();
      }
      if(userFatherPhoto != '' && addedUser){
        const userFatherPhotoslider = UserDocument({
          parentId: addedUser._id,
          title: "Father Photo",
          document: userFatherPhoto,
          type: "father_photo",
        });
        await userFatherPhotoslider.save();
      }
      if(userMotherPhoto != '' && addedUser){
        const userMotherPhotoslider = UserDocument({
          parentId: addedUser._id,
          title: "Mother Photo",
          document: userMotherPhoto,
          type: "mother_photo",
        });
        await userMotherPhotoslider.save();
      }
      if(userGuardianPhoto != '' && addedUser){
        const userGuardianPhotoslider = UserDocument({
          parentId: addedUser._id,
          title: "Guardian Photo",
          document: userGuardianPhoto,
          type: "guardian_photo",
        });
        await userGuardianPhotoslider.save();
      }
      return res.json({
        message: "Student added successfully",
        success: true,
        mediaUrl:userProfileUrl
      });
    })
    
  };
  static edit_student = async (req, res) => {
    const uploadStudentPhotoAndPhotoNumber = multer({
      storage: storageDocument,
    }).fields(
      [
        { 
          name: 'StudentPhotoAndPhotoNumber', 
          maxCount: 1 
        }, 
        { 
          name: 'FatherPhotoAndPhotoNumber', 
          maxCount: 1 
        },
        { 
          name: 'GuardianPhotoAndPhotoNumber', 
          maxCount: 1 
        },
        { 
          name: 'MotherPhotoAndPhotoNumber', 
          maxCount: 1 
        }
      ]
    )

    uploadStudentPhotoAndPhotoNumber(req, res, async function (errStudent) {
      const body = req.body;
      
      let msg = "Something went wrong please try again later";
      if (!req.body.student_id) {
        return res.json({
          message: "student_id is required",
          success: false,
        });
      }
      if (!req.body.institute_id) {
        return res.json({
          message: "institute_id is required",
          success: false,
        });
      }
     
      if (!req.body.StudentName) {
        return res.json({
          message: "StudentName is required",
          success: false,
        });
      }
      let findUser = await User.findOne({ _id: body.student_id });
      if(!findUser){
        return res.send({
          message:
            "Student details not found with given details",
          success: false,
        });
      }
      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
      let hashedPassword = findUser.password;
      if(body.StudentPassword && body.StudentPassword != ''){
        hashedPassword = await bcrypt.hash(body.StudentPassword, salt);
      }
      
      let userPhoto = "";
      let userFatherPhoto = "";
      let userGuardianPhoto = "";
      let userMotherPhoto = "";
      if(req.files && req.files.StudentPhotoAndPhotoNumber && req.files.StudentPhotoAndPhotoNumber[0] && req.files.StudentPhotoAndPhotoNumber[0].filename){
        //console.log(req.files.StudentPhotoAndPhotoNumber[0])
        await sharp(req.files.StudentPhotoAndPhotoNumber[0].path)
        .resize(200)
        .jpeg({ quality: 20 })
        .toFile(
            path.resolve(req.files.StudentPhotoAndPhotoNumber[0].destination,'resized',req.files.StudentPhotoAndPhotoNumber[0].filename)
        )
        fs.unlinkSync(req.files.StudentPhotoAndPhotoNumber[0].path)
        userPhoto = 'resized/'+req.files.StudentPhotoAndPhotoNumber[0].filename;
      }
      if(req.files && req.files.MotherPhotoAndPhotoNumber && req.files.MotherPhotoAndPhotoNumber[0] && req.files.MotherPhotoAndPhotoNumber[0].filename){
        await sharp(req.files.MotherPhotoAndPhotoNumber[0].path)
        .resize(200)
        .jpeg({ quality: 20 })
        .toFile(
            path.resolve(req.files.MotherPhotoAndPhotoNumber[0].destination,'resized',req.files.MotherPhotoAndPhotoNumber[0].filename)
        )
        fs.unlinkSync(req.files.MotherPhotoAndPhotoNumber[0].path)
        userMotherPhoto = 'resized/'+req.files.MotherPhotoAndPhotoNumber[0].filename;
      }
      if(req.files && req.files.FatherPhotoAndPhotoNumber && req.files.FatherPhotoAndPhotoNumber[0] && req.files.FatherPhotoAndPhotoNumber[0].filename){
        await sharp(req.files.FatherPhotoAndPhotoNumber[0].path)
        .resize(200)
        .jpeg({ quality: 20 })
        .toFile(
            path.resolve(req.files.FatherPhotoAndPhotoNumber[0].destination,'resized',req.files.FatherPhotoAndPhotoNumber[0].filename)
        )
        fs.unlinkSync(req.files.FatherPhotoAndPhotoNumber[0].path)
        userFatherPhoto = 'resized/'+req.files.FatherPhotoAndPhotoNumber[0].filename;
      }
      if(req.files && req.files.GuardianPhotoAndPhotoNumber && req.files.GuardianPhotoAndPhotoNumber[0] && req.files.GuardianPhotoAndPhotoNumber[0].filename){
        await sharp(req.files.FatherPhotoAndPhotoNumber[0].path)
        .resize(200)
        .jpeg({ quality: 20 })
        .toFile(
            path.resolve(req.files.GuardianPhotoAndPhotoNumber[0].destination,'resized',req.files.GuardianPhotoAndPhotoNumber[0].filename)
        )
        fs.unlinkSync(req.files.GuardianPhotoAndPhotoNumber[0].path)
        userGuardianPhoto = 'resized/'+req.files.GuardianPhotoAndPhotoNumber[0].filename;
      }
      let saveData = {
        password  : hashedPassword,
        serial_number     : req.body.SerialNumber && req.body.SerialNumber != "" ? req.body.SerialNumber : findUser.serial_number,
        registration_number     : req.body.RegNumber && req.body.RegNumber != "" ? req.body.RegNumber : findUser.registration_number,
        admission_number     : req.body.AdmissionNumber && req.body.AdmissionNumber != "" ? req.body.AdmissionNumber : findUser.admission_number,
        roll_number     : req.body.RollNumber && req.body.RollNumber != "" ? req.body.RollNumber : findUser.roll_number,
        rfid_card_number     : req.body.RFIDCardNumber && req.body.RFIDCardNumber != "" ? req.body.RFIDCardNumber : findUser.rfid_card_number,
        house     : req.body.House && req.body.House != "" ? req.body.House : findUser.house,
        user_name     : req.body.StudentName && req.body.StudentName != "" ? req.body.StudentName : findUser.user_name,
        dob     : req.body.DateofBirth && req.body.DateofBirth != "" ? req.body.DateofBirth : findUser.dob,
        mobile_number     : req.body.StudentContactNumber && req.body.StudentContactNumber != "" ? req.body.StudentContactNumber : findUser.mobile_number,
        location     : req.body.StudentAddress && req.body.StudentAddress != "" ? req.body.StudentAddress : findUser.location,
        pincode     : req.body.PinCode && req.body.PinCode != "" ? req.body.PinCode : findUser.pincode,
        city     : req.body.City && req.body.City != "" ? req.body.City : findUser.city,
        state     : req.body.SelectState && req.body.SelectState != "" ? req.body.SelectState : findUser.state,
        class     : req.body.SelectClass && req.body.SelectClass != "" ? req.body.SelectClass : findUser.class,
        section     : req.body.SelectSection && req.body.SelectSection != "" ? req.body.SelectSection : findUser.section,
        photo     : userPhoto,
        father_name     : req.body.FatherName && req.body.FatherName != "" ? req.body.FatherName : findUser.father_name,
        father_contact_number     : req.body.FatherContactNumber && req.body.FatherContactNumber != "" ? req.body.FatherContactNumber : findUser.father_contact_number,
        father_whatsapp_contact_number     : req.body.FatherWhatsappContactNumber && req.body.FatherWhatsappContactNumber != "" ? req.body.FatherWhatsappContactNumber : findUser.father_whatsapp_contact_number,
        mother_name     : req.body.MotherName && req.body.MotherName != "" ? req.body.MotherName : findUser.mother_name,
        mother_contact_number     : req.body.MotherContactNumber && req.body.MotherContactNumber != "" ? req.body.MotherContactNumber : findUser.mother_contact_number,
        guardian_name     : req.body.GuardianName && req.body.GuardianName != "" ? req.body.GuardianName : findUser.guardian_name,
        guardian_contact_number     : req.body.GuardianContactNumber && req.body.GuardianContactNumber != "" ? req.body.GuardianContactNumber : findUser.guardian_contact_number,
      }

      let addedUser = await User.findOneAndUpdate({_id:findUser._id},{$set:saveData});
      let findUserUpdated = await User.findOne({ _id: body.student_id });

      if(userPhoto != '' && addedUser){
        const userPhotoslider = UserDocument({
          parentId: addedUser._id,
          title: "Student Photo",
          document: userPhoto,
          type: "student_photo",
        });
        await userPhotoslider.save();
      }
      if(userFatherPhoto != '' && addedUser){
        const userFatherPhotoslider = UserDocument({
          parentId: addedUser._id,
          title: "Father Photo",
          document: userFatherPhoto,
          type: "father_photo",
        });
        await userFatherPhotoslider.save();
      }
      if(userMotherPhoto != '' && addedUser){
        const userMotherPhotoslider = UserDocument({
          parentId: addedUser._id,
          title: "Mother Photo",
          document: userMotherPhoto,
          type: "mother_photo",
        });
        await userMotherPhotoslider.save();
      }
      if(userGuardianPhoto != '' && addedUser){
        const userGuardianPhotoslider = UserDocument({
          parentId: addedUser._id,
          title: "Guardian Photo",
          document: userGuardianPhoto,
          type: "guardian_photo",
        });
        await userGuardianPhotoslider.save();
      }
      return res.json({
        message: "Student updated successfully",
        success: true,
        data: findUserUpdated,
        mediaUrl:userProfileUrl
      });
    })
    
  };
  static get_all_categories = async (req, res) => {
    //const postUrl = baseURL+'uploads/posts/';
    const body = req.body;
    let msg = "Something went wrong please try again later";
    let findCondition = {
    }
    
    try {

      await Category.aggregate([
        
        {
          $project: {
           
            title: 1,
            name: 1,
            created_at: 1,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $match: findCondition,
        },
      ]).exec(function (err, data) {
        return res.json({
          message: "Success",
          success: true,
          data: data,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_all_products = async (req, res) => {
    //const postUrl = baseURL+'uploads/posts/';
    const body = req.body;
    if (!req.body.categoryId) {
      return res.json({
        message: "categoryId is required",
        success: false,
      });
    }
    let msg = "Something went wrong please try again later";
    let findCondition = {
      categoryId : ObjectId(req.body.categoryId)
    }
    
    try {

      await Product.aggregate([
        {
          $lookup: {
            from: "productimages",
            let: {
              prodId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ["$productId", "$$prodId"] }] },
                },
              },
            ],
            as: "productImages",
          },
        },
        {
          $project: {
           
            productImages: 1,
            categoryId: 1,
            title: 1,
            regular_price: 1,
            sale_price: 1,
            created_at: 1,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $match: findCondition,
        },
      ]).exec(function (err, data) {
        const mediaUrlData = baseURL+'uploads/product/';
        return res.json({
          message: "Success",
          success: true,
          data: data,
          product_image_url: mediaUrlData,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_all_terms = async (req, res) => {
    //const postUrl = baseURL+'uploads/posts/';
    const body = req.body;
    if (!req.body.institute_id) {
      return res.json({
        message: "institute_id is required",
        success: false,
      });
    }
    let msg = "Something went wrong please try again later";
    let findCondition = {
      user_id : ObjectId(req.body.institute_id)
    }
    
    try {

      await CustomTerm.aggregate([
        {
          $lookup: {
            from: "users",
            let: {
              user_id: "$user_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ["$_id", "$$user_id"] }] },
                },
              },
            ],
            as: "userData",
          },
        },
        {$unwind:"$userData"},
        {
          $project: {
           
            userData: 1,
            text: 1,
            user_id: 1,
            created_at: 1,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $match: findCondition,
        },
      ]).exec(function (err, rows) {
        return res.json({
          message: "Success",
          success: true,
          data: rows,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static create_new_quote_part_one = async (req, res) => {
    const body = req.body;
      
    let msg = "Something went wrong please try again later";
    
    // if (!req.body.categoryId) {
    //   return res.json({
    //     message: "categoryId is required",
    //     success: false,
    //   });
    // }
    if (!req.body.institute_id) {
      return res.json({
        message: "institute_id is required",
        success: false,
      });
    }
    if (!req.body.partnerId) {
      return res.json({
        message: "partnerId is required",
        success: false,
      });
    }
    
    if (!req.body.additional_information) {
      return res.json({
        message: "additional_information is required",
        success: false,
      });
    }
    if (!req.body.email) {
      return res.json({
        message: "email is required",
        success: false,
      });
    }
    if (!req.body.contact_person_name) {
      return res.json({
        message: "contact_person_name is required",
        success: false,
      });
    }
    if (!req.body.contact_number) {
      return res.json({
        message: "contact_number is required",
        success: false,
      });
    }
    // if (!req.body.gst_number) {
    //   return res.json({
    //     message: "gst_number is required",
    //     success: false,
    //   });
    // }
    if (!req.body.customer_address) {
      return res.json({
        message: "customer_address is required",
        success: false,
      });
    }
    let sender = req.user;
    let findUser = await User.findOne({ _id: sender._id });
    if(!findUser){
      return res.send({
        message:
          "User details not found with given details",
        success: false,
      });
    }
    
    let saveData = {
      user_id : req.user._id,
      institute_id : req.body.institute_id && req.body.institute_id != "" ? req.body.institute_id : '',
      partnerId : req.body.partnerId && req.body.partnerId != "" ? req.body.partnerId : null,
      additional_information : req.body.additional_information && req.body.additional_information != "" ? req.body.additional_information : '',
      email : req.body.email && req.body.email != "" ? req.body.email : '',
      contact_person_name : req.body.contact_person_name && req.body.contact_person_name != "" ? req.body.contact_person_name : '',
      contact_number : req.body.contact_number && req.body.contact_number != "" ? req.body.contact_number : '',
      gst_number : req.body.gst_number && req.body.gst_number != "" ? req.body.gst_number : '',
      customer_address : req.body.customer_address && req.body.customer_address != "" ? req.body.customer_address : '',
     
    }

    const userPhotoslider = new Quote(saveData);
    let saveDt = await userPhotoslider.save();

    return res.json({
      message: "Quote information saved successfully",
      success: true,
      data: saveDt,
    });
    
  };
  static create_new_quote_part_two = async (req, res) => {
    const body = req.body;
      
    let msg = "Something went wrong please try again later";
    
    if (!req.body.quoteId) {
      return res.json({
        message: "quoteId is required",
        success: false,
      });
    }
    if (!req.body.term_condition_accepted) {
      return res.json({
        message: "term_condition_accepted is required",
        success: false,
      });
    }
    
   
    let sender = req.user;
    let findUser = await User.findOne({ _id: sender._id });
    if(!findUser){
      return res.send({
        message:
          "User details not found with given details",
        success: false,
      });
    }
    let findQuote = await Quote.findOne({ _id: req.body.quoteId});
    if(!findQuote){
      return res.send({
        message:
          "Quote details not found with given details",
        success: false,
      });
    }
    
    let saveData = {
      term_condition_accepted : req.body.term_condition_accepted && req.body.term_condition_accepted != "" ? req.body.term_condition_accepted : [],
    }

    findQuote.term_condition_accepted = saveData.term_condition_accepted
    let saveDt = await findQuote.save();

    return res.json({
      message: "Quote information saved successfully",
      success: true,
      data: saveDt,
    });
    
  };
  static create_new_quote_part_three = async (req, res) => {
    const body = req.body;
      
    let msg = "Something went wrong please try again later";
    
    if (!req.body.quoteId) {
      return res.json({
        message: "quoteId is required",
        success: false,
      });
    }
    if (!req.body.products) {
      return res.json({
        message: "products is required",
        success: false,
      });
    }
    
   
    let sender = req.user;
    let findUser = await User.findOne({ _id: sender._id });
    if(!findUser){
      return res.send({
        message:
          "User details not found with given details",
        success: false,
      });
    }
    let findQuote = await Quote.findOne({ _id: req.body.quoteId});
    if(!findQuote){
      return res.send({
        message:
          "Quote details not found with given details",
        success: false,
      });
    }
    
    let products = req.body.products && req.body.products != "" ? JSON.parse(req.body.products) : '';
   //return false;
    
    try{
      //findQuote.products = products
      let saveDt = await findQuote.updateOne({_id:findQuote._id},{$set:{products:products}});
      let findQuoteS = await Quote.findOne({ _id: req.body.quoteId});
      return res.json({
        message: "Quote information saved successfully",
        success: true,
        data: findQuoteS,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Something went wrong please try again later");
    }

    
    
  };
  static create_new_quote_part_four = async (req, res) => {
    const body = req.body;
      
    let msg = "Something went wrong please try again later";
    
    if (!req.body.quoteId) {
      return res.json({
        message: "quoteId is required",
        success: false,
      });
    }
    if (!req.body.isFinalSubmit) {
      return res.json({
        message: "isFinalSubmit is required",
        success: false,
      });
    }
    
   
    let sender = req.user;
    let findUser = await User.findOne({ _id: sender._id });
    if(!findUser){
      return res.send({
        message:
          "User details not found with given details",
        success: false,
      });
    }
    let findQuote = await Quote.findOne({ _id: req.body.quoteId});
    console.log(findQuote.products)
    if(!findQuote){
      return res.send({
        message:
          "Quote details not found with given details",
        success: false,
      });
    }else if(findQuote.products && !findQuote.products.length){
      return res.send({
        message:
          "Please select atleast one product before submit",
        success: false,
      });
    }
    
    let saveData = {
      status : req.body.isFinalSubmit && req.body.isFinalSubmit != "" ? req.body.isFinalSubmit : 0,
     
    }

    findQuote.status = saveData.status
    let saveDt = await findQuote.save();
    findQuoteUpdated = await Quote.findOne({ _id: req.body.quoteId});
    return res.json({
      message: "Quote information submitted successfully",
      success: true,
      data: findQuoteUpdated,
    });
  };
  static create_new_quote_add_bank_details = async (req, res) => {
    const body = req.body;
      
    let msg = "Something went wrong please try again later";
    
    if (!req.body.quoteId) {
      return res.json({
        message: "quoteId is required",
        success: false,
      });
    }
    if (!req.body.bank_name) {
      return res.json({
        message: "bank_name is required",
        success: false,
      });
    }
    if (!req.body.bank_customer_name) {
      return res.json({
        message: "bank_customer_name is required",
        success: false,
      });
    }
    if (!req.body.bank_branch_name) {
      return res.json({
        message: "bank_branch_name is required",
        success: false,
      });
    }
    if (!req.body.bank_ifsc_code) {
      return res.json({
        message: "bank_ifsc_code is required",
        success: false,
      });
    }
    if (!req.body.bank_account_no) {
      return res.json({
        message: "bank_account_no is required",
        success: false,
      });
    }
    let saveDataBank = {
      bank_name : req.body && req.body.bank_name ? req.body.bank_name : null,
      bank_customer_name : req.body && req.body.bank_customer_name ? req.body.bank_customer_name : null,
      bank_branch_name : req.body && req.body.bank_branch_name ? req.body.bank_branch_name : null,
      bank_account_no : req.body && req.body.bank_account_no ? req.body.bank_account_no : null,
      bank_ifsc_code : req.body && req.body.bank_ifsc_code ? req.body.bank_ifsc_code : null,
    }
   
    let sender = req.user;
    let findUser = await User.findOne({ _id: sender._id });
    if(!findUser){
      return res.send({
        message:
          "User details not found with given details",
        success: false,
      });
    }
    let findQuote = await Quote.findOne({ _id: req.body.quoteId});
    console.log(findQuote.products)
    if(!findQuote){
      return res.send({
        message:
          "Quote details not found with given details",
        success: false,
      });
    }
   
    let saveDt = await Quote.updateOne({_id:ObjectId(req.body.quoteId)},{$set:saveDataBank});
    let findQuoteUpdated = await Quote.findOne({ _id: req.body.quoteId});
    return res.json({
      message: "Quote information submitted successfully",
      success: true,
      data: findQuoteUpdated,
    });
    
  };
  static get_all_quotes = async (req, res) => {
    const body = req.body;
      
    let msg = "Something went wrong please try again later";
    
    if (!req.body.institute_id) {
      return res.json({
        message: "institute_id is required",
        success: false,
      });
    }
    
   
    let sender = req.user;
    let findUser = await User.findOne({ _id: sender._id });
    if(!findUser){
      return res.send({
        message:
          "User details not found with given details",
        success: false,
      });
    }
    let findCondition = {
      institute_id : ObjectId(req.body.institute_id)
    }
    
    try {

      await Quote.aggregate([
        {
          $lookup: {
            from: "users",
            let: {
              partnerId: "$partnerId",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ["$_id", "$$partnerId"] }] },
                },
              },
            ],
            as: "partnerData",
          },
        },
        {$unwind:"$partnerData"},
        {
          $lookup: {
            from: "users",
            let: {
              institute_id: "$institute_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ["$_id", "$$institute_id"] }] },
                },
              },
            ],
            as: "instituteData",
          },
        },
        {$unwind:"$instituteData"},
        {
          $project: {
           
            partnerData: 1,
            instituteData: 1,
            institute_id: 1,
            categoryId: 1,
            additional_information: 1,
            email: 1,
            contact_person_name: 1,
            contact_number: 1,
            gst_number: 1,
            customer_address: 1,
            term_condition_accepted: 1,
            products: 1,
            bank_name: 1,
            bank_customer_name: 1,
            bank_branch_name: 1,
            bank_account_no: 1,
            bank_ifsc_code: 1,
            products: 1,
            created_at: 1,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $match: findCondition,
        },
      ]).exec(function (err, rows) {
        return res.send({
          message:"Success",
          success: true,
          data: rows,
        });
      });
    } catch (error) {
      console.log(error);
      return res.send({
        message:error,
        success: false,
        data: [],
      });
    }

    
    
  };
  static get_all_partners = async (req, res) => {
    const body = req.body;
      
    let msg = "Something went wrong please try again later";
    
    if (!req.body.institute_id) {
      return res.json({
        message: "institute_id is required",
        success: false,
      });
    }
    
   
    let sender = req.user;
    let findUser = await User.findOne({ _id: sender._id });
    if(!findUser){
      return res.send({
        message:
          "User details not found with given details",
        success: false,
      });
    }
    let findCondition = {
      institute_id : ObjectId(req.body.institute_id)
    }
    
    try {

      await User.aggregate([
        
        {
          $project: {
           
            user_name: 1,
            created_at: 1,
            role: 1,
            sub_role: 1,
            firm_name: 1,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $match: {
            $or : [
              {
                role : {$in:[ROLE_PARTNER,ROLE_SUB_PARTNER]},
              },
              {
                sub_role : ROLE_CUSTOMER_SUBROLE_EMPLOYEE,
              }
            ]
          },
        },
      ]).exec(function (err, rows) {
        return res.send({
          message:"Success",
          success: true,
          data: rows,
        });
      });
    } catch (error) {
      console.log(error);
      return res.send({
        message:error,
        success: false,
        data: [],
      });
    }

    
    
  };
  static add_institute = async (req, res) => {
    try {
      let data = req.body;
      let sender = req.user;
      if(!req.body.email){
        return res.json({
          message: "email is required field",
          success: false,
        });
      }
      if(!req.body.password){
        return res.json({
          message: "password is required field",
          success: false,
        });
      }
      if(!req.body.user_type){
        return res.json({
          message: "user_type is required field",
          success: false,
        });
      }
      if(!req.body.role_type){
        return res.json({
          message: "role_type is required field",
          success: false,
        });
      }
      if(!req.body.user_name){
        return res.json({
          message: "user_name is required field",
          success: false,
        });
      }
      if(!req.body.mobile_number){
        return res.json({
          message: "mobile_number is required field",
          success: false,
        });
      }
      if(!req.body.whatsapp_mobile_number){
        return res.json({
          message: "whatsapp_mobile_number is required field",
          success: false,
        });
      }
      if(!req.body.address){
        return res.json({
          message: "address is required field",
          success: false,
        });
      }
      let checkexist = await User.findOne({  $or : [{email: data.email },{mobile_number: data.mobile_number }]}).lean();
      if (checkexist) {
        if(data.email.toLowerCase() == checkexist.email.toLowerCase())
          return res.json({
            message:
              "This email is associated with another account. Please try with different email",
            success: false,
          });
        else
          return res.json({
            message:
              "This mobile no is associated with another account. Please try with different mobile no.",
            success: false,
          });
      }
      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
      const hashedPassword = await bcrypt.hash(data.password, salt);
      delete data.password;
      data.password = hashedPassword;
      data.role = ROLE_CUSTOMER;

      if(sender.parentId && sender.parentId != ""){
        data.parentId = ObjectId(sender.parentId)
      }
      if(data.user_type && data.user_type != ""){
        data.user_type = data.user_type.toLowerCase()
      }
      if(data.role_type && data.role_type != ""){
        data.role_type = data.role_type.toLowerCase()
      }
      console.log("dataaaa",data)
      const saveData = User(data);
      await saveData.save();
      return res.json({
        message: "Institute added successfully.",
        success: true,
      });
    } catch (error) {
      console.log(error);
        return res.json({
          message: "Something went wrong please try again later",
          success: false,
        });
    }
  };
  static get_class_session_sections = async (req, res) => {
    const body = req.body;
      
    let msg = "Something went wrong please try again later";
    
    if (!req.body.institute_id) {
      return res.json({
        message: "institute_id is required",
        success: false,
      });
    }
    
   
    let sender = req.user;
    let findUser = await User.findOne({ _id: sender._id });
    if(!findUser){
      return res.send({
        message:
          "User details not found with given details",
        success: false,
      });
    }
    let findCondition = {
      institute_id : ObjectId(req.body.institute_id)
    }
    
    try {
      let classes = await Class.find({ instituteId: req.body.institute_id }).sort({ priority: 1 });
      let sessions = await AcademicSession.find({ instituteId: req.body.institute_id });
      let sections = await Section.find({ instituteId: req.body.institute_id });
      return res.send({
        message:"Success",
        success: true,
        classes: classes,
        sessions: sessions,
        sections: sections,
      });
    } catch (error) {
      console.log(error);
      return res.send({
        message:error,
        success: false,
        data: [],
      });
    }

    
    
  };
}
function form2Json(str)
{
    "use strict";
    var obj,i,pt,keys,j,ev;
    if (typeof form2Json.br !== 'function')
    {
        form2Json.br = function(repl)
        {
            if (repl.indexOf(']') !== -1)
            {
                return repl.replace(/\](.+?)(,|$)/g,function($1,$2,$3)
                {
                    return form2Json.br($2+'}'+$3);
                });
            }
            return repl;
        };
    }
    str = '{"'+(str.indexOf('%') !== -1 ? decodeURI(str) : str)+'"}';
    obj = str.replace(/\=/g,'":"').replace(/&/g,'","').replace(/\[/g,'":{"');
    obj = JSON.parse(obj.replace(/\](.+?)(,|$)/g,function($1,$2,$3){ return form2Json.br($2+'}'+$3);}));
    pt = ('&'+str).replace(/(\[|\]|\=)/g,'"$1"').replace(/\]"+/g,']').replace(/&([^\[\=]+?)(\[|\=)/g,'"&["$1]$2');
    pt = (pt + '"').replace(/^"&/,'').split('&');
    for (i=0;i<pt.length;i++)
    {
        ev = obj;
        keys = pt[i].match(/(?!:(\["))([^"]+?)(?=("\]))/g);
        for (j=0;j<keys.length;j++)
        {
            if (!ev.hasOwnProperty(keys[j]))
            {
                if (keys.length > (j + 1))
                {
                    ev[keys[j]] = {};
                }
                else
                {
                    ev[keys[j]] = pt[i].split('=')[1].replace(/"/g,'');
                    break;
                }
            }
            ev = ev[keys[j]];
        }
    }
    return obj;
}
module.exports = apiController;
