const express = require("express");
const controller = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");
const integrityMiddleware = require("../middlewares/integrityMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const { createPostValidator } = require("../validators/postValidators");

const router = express.Router();

router.use(authMiddleware);
router.post("/create", validateRequest(createPostValidator), controller.createPost);
router.get("/list", integrityMiddleware, controller.listPosts);
router.get("/drafts/list", controller.listDrafts);
router.get("/:id", integrityMiddleware, controller.getPost);
router.put("/:id", validateRequest(createPostValidator), controller.updatePost);
router.delete("/:id", controller.deletePost);
router.patch("/:id/archive", controller.archivePost);

module.exports = router;

