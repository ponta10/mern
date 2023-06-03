const router = require('express').Router();
const { PromiseProvider } = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');

//CRUD処理
//投稿作成
router.post("/", async (req,res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    } catch {
        return res.status(500).json(err);
    }
});

//投稿編集
router.put("/:id", async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({
                $set : req.body,
            });
            return res.status(200).json("投稿編集に成功しました");
        }else {
            return res.status(403).json("あなたは他の人の投稿を編集できません。");
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

//投稿削除
router.delete("/:id", async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne();
            return res.status(200).json("投稿削除に成功しました");
        }else {
            return res.status(403).json("あなたは他の人の投稿を削除できません。");
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

//投稿取得
router.get("/:id", async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//いいね
router.put("/:id/like", async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({
                $push: {
                    likes: req.body.userId,
                }
            })
            return res.status(200).json("いいねに成功しました");
        }else{
            await post.updateOne({
                $pull: {
                    likes: req.body.userId,
                }
            })
            return res.status(403).json("いいねを外しました");
        }
    }catch(err){
        return res.status(500).json("失敗しました");
    }
})

//タイムラインの投稿を取得
router.get("/timeline/:userId", async(req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        //フォローしている人の投稿内容
        //await promise.allは非同期処理の値を取得しているので待つ必要があるから記述。ないと空配列が返却される。
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        return res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err){
        return res.status(500).json("失敗しました");
    }
})

//api/usersをデフォルトとして
// router.get("/",(req,res) => {
//     res.send('hello post');
// })

module.exports = router;