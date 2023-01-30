const main = require("./routes/admin/main");
const auth = require("./routes/admin/auth");
const dashboard = require("./routes/admin/dashboard");
const aboutus = require("./routes/admin/aboutus");
const faq = require("./routes/admin/faq");
const privacypolicy = require("./routes/admin/privacypolicy");
const termscondition = require("./routes/admin/termscondition");
const contact = require("./routes/admin/contact");
const sliderRoute = require("./routes/admin/sliderRoute");
const banner = require("./routes/admin/banner");
const blog = require("./routes/admin/blog");
const category = require("./routes/admin/category")
const subcategory = require("./routes/admin/subcategory")
const text = require("./routes/admin/text");
const post = require("./routes/admin/post");
const like = require("./routes/admin/like");
const comment = require("./routes/admin/comment");
const support_messages = require("./routes/admin/supportMessages")
const reply = require("./routes/admin/reply")
const shortVideo = require("./routes/admin/shortVideo")
const user = require("./routes/admin/user")
const report = require("./routes/admin/report")
const currency = require("./routes/admin/currency");
const GoogleAds = require("./routes/admin/googleAds");
const trending = require("./routes/admin/trendingcount")
const referralCurrency = require("./routes/admin/referralCurrency");

const AdminRoutes = (app) => {
  app.use("/", main);
  app.use("/admin", auth);
  app.use("/admin", dashboard);
  app.use("/admin", aboutus);
  app.use("/admin", faq);
  app.use("/admin", privacypolicy);
  app.use("/admin", termscondition);
  app.use("/admin/contact", contact);
  app.use("/admin/sliders", sliderRoute);
  app.use("/admin/banners", banner);
  app.use("/admin/blog", blog);
  app.use("/admin/category", category);
  app.use("/admin/subcategories", subcategory);
  app.use("/admin/text", text);
  app.use("/admin/post", post);
  app.use("/admin/like", like);
  app.use("/admin/comment", comment);
  app.use("/admin/support", support_messages);
  app.use("/admin/reply", reply);
  app.use("/admin/shortvideo", shortVideo)
  app.use("/admin/app/user", user)
  app.use("/admin/report", report)
  app.use("/admin/currency", currency)
  app.use("/admin/googleAds", GoogleAds)
  app.use("/admin/trending", trending)
  app.use("/admin/referralCurrency", referralCurrency)
};

module.exports = AdminRoutes;