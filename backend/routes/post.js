const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createPost, getPosts, getPost, updatePost, deletePost } = require('../controllers/postController');
const auth = require('../ middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/', auth, upload.array('images'), createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.put('/:id', auth, upload.array('images'), updatePost);
router.delete('/:id', auth, deletePost);

module.exports = router;
