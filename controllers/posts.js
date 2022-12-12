import mongoose, { Mongoose } from "mongoose";
import postMessage from "../models/postMessage.js";

/**Function for get all posts in the data base */
export const getAllPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await postMessage.countDocuments({});
    const post = await postMessage
      .find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      posts: post,
      currentPage: Number(page),
      totalPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**Function for get all posts in the data base */
export const getOnePosts = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ message: "Id is incorret" });

    const post = await postMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**Search any Post by tags or title*/
export const getBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  const title = new RegExp(searchQuery, "i");

  try {
    const data = await postMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });
    res.json({ data });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

/**Function for createNewPost */
export const createPost = async (req, res) => {
  const post = req.body;

  if (!req.userId) return res.status(404).json({ message: "Unauthenticated" });

  const newPost = postMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**Function for update post */
export const updatePost = async (req, res) => {
  let body = req.body;
  const { id: _id } = req.params;

  /**Validate that the id is true */
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  const update = await postMessage.findByIdAndUpdate(
    _id,
    { ...body, _id },
    { new: true }
  );

  res.status(200).json(update);
};

/**Function for delete post in the dataBase */
export const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("Incorret Id");

  await postMessage.findByIdAndRemove(_id);

  res.json({ message: "Deleted" });
};

/**Function for like to post*/
export const likeToPost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.status(404).json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "the id, is incorret" });

  /**Get post by id */
  let post = await postMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index !== -1) {
    post.likes = post.likes.filter((id) => id !== req.userId);
  } else {
    post.likes.push(req.userId);
  }

  /**Update post in the property likecount + 1 */
  let likedPost = await postMessage.findByIdAndUpdate(id, post, { new: true });

  res.json(likedPost);
};

export const commentToPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  try {
    let post = await postMessage.findById(id);
    post.comments.push(value);

    const updatePost = await postMessage.findByIdAndUpdate(id, post, {
      new: true,
    });

    res.json(post);
  } catch (error) {
    console.log(error);
  }
};
