import Post from "../models/Post.js";
import User from "../models/User.js"

// CREATE
export const createPost = async (req, res) => {
    try{

        const {userId, description, picturePath, title }  = req.body;
        const user = await User.findById(userId)
        const newPost = new Post ({
            userId,
            title: title,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        console.log(newPost)
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);
    } catch (error){
        res.status(401).json({ message: error.message })
    }
}

// READ 
export const getFeedPosts = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const user = await User.findById(id);
        const friendsId = user.friends;
        const post = await Post.find({ userId: { $in: friendsId } });
        res.status(200).json(post);
        } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// READ 
export const getPost = async (req, res) => {
  try {
      const { postId } = req.params;
      const post = await Post.findById(postId);
      console.log(post)
      res.status(200).json(post);
      } catch (err) {
      res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
try{
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
} catch (error) {
    res.status(404).json({ message: error.message })
}
}

// UPDATE 
export const likePost = async (req, res) => {
    try{
        const { id } = req.params;
        const { userId } = req.body; 
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if(isLiked){
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id, 
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// commentaires 

export const createComment = async (req, res) => {
    const { userId, firstName, lastName, content, postId, picturePath
    } = req.body;
    console.log(req)
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const newComment = {
        userId,
        firstName,
        lastName,
        content,
        picturePath
      };
      post.comments.push(newComment);
      
      const updatedPost = await post.save();
      
      res.status(201).json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error });
    }
  };


export const updateComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const comment = post.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      comment.content = content;
      const updatedPost = await post.save();
      
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error });
    }
  };
  
  export const deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;
    
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const comment = post.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      comment.remove();
      const updatedPost = await post.save();
      
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error });
    }
  };

export const getPostComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    console.log(post);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// Contrôleur pour ajouter une notation à un article
export const createRating = async (req, res) => {
  const { id } = req.params; // L'identifiant de l'article à noter
  const { userId, rating } = req.body; // L'identifiant de l'utilisateur et la notation depuis le corps de la requête

  try {
    // Vérifier si l'article existe
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Vérifier si l'utilisateur a déjà noté cet article
    const existingRating = post.ratings.find((r) => r.userId === userId);
    if (existingRating) {
      return res.status(400).json({ message: "User has already rated this article" });
    }

    // Ajouter la nouvelle notation à l'article
    post.ratings.push({ userId, rating });

    // Calculer la nouvelle moyenne des notations pour l'article
    const totalRatings = post.ratings.length;
    const totalRatingSum = post.ratings.reduce((acc, r) => acc + r.rating, 0);
    post.avgRating = totalRatingSum / totalRatings;

    // Sauvegarder l'article mis à jour avec la nouvelle notation
    await post.save();

    res.status(201).json({ message: "Rating added successfully", rating: post.ratings[post.ratings.length - 1] });
  } catch (error) {
    res.status(500).json({ message: "Error adding rating", error: error.message });
  }
};

