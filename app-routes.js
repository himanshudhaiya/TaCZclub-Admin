const home = require("./routes/app/home");
const user = require("./routes/app/user");
const apiRoutes = require("./routes/app/apiRoutes");
const post = require("./routes/app/post");
const support_message = require("./routes/app/supportMessages");
const shortVideo = require("./routes/app/shortvideo");
const postsave = require("./routes/app/postSave")
const report = require("./routes/app/report");
const views = require("./routes/app/views");
const trending = require("./routes/app/trending");
const commentReply = require("./routes/app/commantReply");
const notification = require("./routes/app/notification");

const AppRoutes = (app) => {
  app.use("/app", home);
  app.use("/app/user", user)
  app.use("/app", apiRoutes);
  app.use("/app/post", post);
  app.use("/app/support_message", support_message);
  app.use("/app/shortVideo", shortVideo);
  app.use("/app/postSave", postsave);
  app.use("/app/report", report);
  app.use("/app/view", views);
  app.use("/app/trending", trending);
  app.use("/app/commentReply", commentReply);
  app.use("/app/notification", notification);
};

module.exports = AppRoutes;