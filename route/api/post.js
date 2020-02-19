const express = require('express');
const checkAuth = require('../../ultils/checkAuth')
const router = express.Router();

const Post = require('../../models/Post');

router.get('/', (req,res) => {
    let filter = {};
    Post.find(filter)
    .sort()
    .then( posts => {
        res.json(posts)
    })
    .catch(err => console.log(err));
});

//Create post
router.post('/', (req,res) => {
    let context = req.headers.authorization
    const user = checkAuth(context);
    let { body } = req.body
    if (body.trim() === '') {
        throw new Error('Post body must no be empty');
    }

    const newPost = new Post({
        body,
        user: user.indexOf,
        username: user.username,
        createdAt: new Date().toISOString()
    })

    newPost.save().then(
        post => res.json(post)
    );

})

//Get post detail
router.get('/:postId', (req,res) => {
    let postId = req.params.postId
    try {
        Post.findById(postId).then(post => res.json(post))
    } catch (err) {
        throw new Error(err);
    }

})

//Delete post 
router.delete('/:postId', (req,res) => {
    let postId = req.params.postId
    let context = req.headers.authorization
    const user = checkAuth(context);

    try {
        Post.findById(postId).then(post => {
            console.log(user.username, post)
            if (user.username === post.username) {
                post.delete();
                res.json('Post deleted sucessfully');
            } else {
                throw new Error('Action not allowed');
            }
        }
        )
    } catch (err) {
        throw new Error(err);
    }

})

//Like post
router.post('/:postId', async (req, res) => {
    try{
    let postId = req.params.postId
    let context = req.headers.authorization
    const { username } = checkAuth(context);

    const post = await Post.findById(postId);
    if (post) {
        if (post.likes.find(like => like.username === username)) {
            // Post already likes, inlike it
            post.likes = post.likes.filter(like => like.username !== username)
        } else {
            // Not like, like post
            post.likes.push({
                username,
                createdAt: new Date().toISOString()
            })
        }
        await post.save();
        return res.json(post);
    } else {
        return res.json('Post not found');
    }
    } catch(err){
        throw new Error(err)
    }
}
)

module.exports = router;