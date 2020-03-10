const express = require('express');
const checkAuth = require('../../ultils/checkAuth')
const router = express.Router();


const Post = require('../../models/Post');

//Create comment post
router.post('/', async (req, res) => {
    try {
        let context = req.headers.authorization;
        let { body, postId } = req.body;
        const { username } = checkAuth(context);
        if (body.trim() === '') {
            return res.status(400).json({ errors: 'Comment body is not empty' });
        }
        const post = await Post.findById(postId);
        if (post) {
            post.comments.unshift({
                body,
                username,
                createdAt: new Date().toISOString()
            });
            await post.save();
            return res.json(post);
        } else return res.json('Post not found');
    } catch (err) {
        throw new Error(err)
    }
})

//Adjust comment post
router.put('/:commentId', async (req, res) => {
    try {
        let commentId = req.params.commentId;
        let { body } = req.body.body;
        let context = req.headers.authorization;
        let postId = req.body.postId;
        if (body.trim() === '') {
            return res.status(400).json({ errors: 'Comment body is not empty' });
        }
        const { username } = checkAuth(context);
        const post = await Post.findById(postId);
        if (post) {
            const commentIndex = post.comments.findIndex(c => String(c._id) === commentId)
            if (post.comments[commentIndex].username === username) {
                post.comments[commentIndex].body = body
                await post.save();
                res.json(post);
            } else {
                throw new Error('Action not allowed');
            }
        } else {
            throw new Error('Post not found');
        }
    } catch (err) {
        throw new Error(err)
    }
})

//Delete comment post
router.post('/:commentId', async (req, res) => {
    try {
        let commentId = req.params.commentId;
        let context = req.headers.authorization;
        let postId = req.body.postId;

        const { username } = checkAuth(context);

        const post = await Post.findById(postId);
        if (post) {
            const commentIndex = post.comments.findIndex(c => String(c._id) === commentId)
            if (post.comments[commentIndex].username === username) {
                post.comments.splice(commentIndex, 1)
                await post.save();
                res.json(post);
            } else {
                throw new Error('Action not allowed');
            }
        } else {
            throw new Error('Post not found');
        }
    } catch (err) {
        throw new Error(err)
    }
})

module.exports = router;