const CommentReply = require('../../models/CommentReply');
// const Comment = require('../../models/Comment');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

class CommentReplyController {
    // commentReply add & list
    static C_reply = async (req, res) => {
        try {
            let token = req.body.token
            let comment_id = req.body.comment_id
            let message = req.body.message

            if (token == null) {
                return res.json({
                    message: 'Token is required',
                    status: 400,
                    success: false
                })
            } else if (comment_id == null) {
                return res.json({
                    message: 'Comment id is required',
                    status: 400,
                    success: false
                })
            } else if (message == null) {
                return res.json({
                    message: 'Message is required',
                    status: 400,
                    success: false
                })
            }


            const payload = jwt.decode(token, process.env.TOKEN_SECRET)
            const user = await User.findById(payload._id);
            if (!user) {
                return res.status(400).json({
                    message: 'User not found'
                })
            }
            const comment_reply = CommentReply({
                comment_id: comment_id,
                user_id: user._id,
                message: message
            })
            await comment_reply.save()
            return res.status(201).json({
                message: 'Comment reply added successfully',
                status: 201,
                data: comment_reply
            })

        } catch (error) {
            return res.status(400).json({
                message: error.message,
                status: 400
            })
        }
    }
}
module.exports = CommentReplyController