const Post = require('../models/Post');
const cloudinary = require('../ config/cloudinary');
const fs = require('fs');

exports.createPost = async (req, res) => {
  const { title, location, description } = req.body;

  try {
    const images = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        images.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    const newPost = new Post({ title, location, description, images });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
};

exports.updatePost = async (req, res) => {
  const { title, location, description } = req.body;

  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const images = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        images.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    post.title = title;
    post.location = location;
    post.description = description;
    post.images = images;

    post = await Post.findByIdAndUpdate(req.params.id, post, { new: true });
    res.json(post);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    await Post.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
};
