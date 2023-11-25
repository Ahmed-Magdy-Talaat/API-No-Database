import express from "express";
const app = express();
app.use(express.json());

let countUser = 1,
  countPost = 1;

let users = [
  {
    name: "Ahmed",
    email: "ahmed@gmail.com",
    id: countUser++,
  },
];

let posts = [
  {
    descrip: "hello everyone",
    id: countPost++,
  },
  {
    descrip: "World",
    id: countPost++,
  },
];

const getAllUsers = (req, res) => {
  res.status(200).send({ status: "succeed", users: users });
};

const getALLSorted = (req, res) => {
  res.status(200).json({
    status: "succeed",
    users: [...users].sort((a, b) => a.name.localeCompare(b.name)),
  });
};

const AddUser = (req, res) => {
  const { name, email } = req.body;
  if (email) {
    const isDuplicated = users.find((user) => user.email === email);

    if (isDuplicated) {
      res
        .status(400)
        .json({ status: "failed", message: "This Email is Duplicated" });
    }
    //
    else {
      const newUser = {
        name: name,
        email: email,
        id: countUser++,
      };
      users.push(newUser);
      res.status(201).json({
        message: "Succeed",
        users: users,
      });
    }
  } else {
    res.json({ status: "failed", message: "No data is added" });
  }
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  if (!isNaN(id)) {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex != -1) {
      res
        .status(201)
        .json({ status: "succeed", users: users.splice(userIndex, 1) });
    }
    //
    else {
      res.status(404).json({ status: "failed", message: "not found" });
    }
  }
  //
  else {
    res.status(400).json({
      status: "failed",
      message: "Not valid id",
    });
  }
};

const updateUser = (req, res) => {
  //
  const id = parseInt(req.params.id);
  const { email, name } = req.body;

  if (!isNaN(id)) {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex != -1) {
      //
      if (email) {
        const isDuplicated = users.find(
          (user) => user.email === email && user !== users[userIndex]
        );

        if (isDuplicated) {
          res
            .json({
              status: "failed",
              message: "user Email is duplicated",
            })
            .status(405);
        } else {
          const newUser = { name: name, email: email };
          newUser.id = users[userIndex].id;
          users[userIndex] = newUser;
          res.json({
            status: "succeed",
            user: newUser,
          });
        }
      } else {
        res.json({ status: "failed", message: "No data is modified" });
      }
    }
    //
    else {
      res.status(404).json({ status: "succeed", message: "not found" });
    }
  }
  //
  else {
    res.status(400).json({
      status: "failed",
      message: "Not valid id",
    });
  }
};

const searchUser = (req, res) => {
  const id = parseInt(req.params.id);

  if (!isNaN(id)) {
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex != -1) {
      res.json({ message: "Succeed", user: users[userIndex] }).status(200);
    }
    //
    else {
      res.json({ status: "succeed", message: "User is not found" }).status(404);
    }
  }
  //
  //
  else {
    res.json({ status: "failed", message: "Not valid Id" }).status(400);
  }
};

//
//
//implementing posts controllers
//
//

const getAllPosts = (req, res) => {
  res.json({ status: "Succeed", posts: posts });
};

const addPost = (req, res) => {
  const { descrip } = req.body;
  if (descrip) {
    const newPost = {
      descrip: descrip,
      id: countPost++,
    };
    posts.push(newPost);
    res.json({ status: "succeed", post: newPost }).status(200);
  } else {
    res.json({ status: "failed", message: "No Post is added" }).status(405);
  }
};

//
const getReversed = (req, res) => {
  res.json({ status: "succeed", posts: [...posts].reverse() }).status(200);
};

const searchPost = (req, res) => {
  const id = parseInt(req.params.id);
  if (!isNaN(id)) {
    const postIdx = posts.findIndex((post) => post.id === id);

    if (postIdx != -1) {
      res.statusCode = 200;
      res.json({ status: "succeed", post: posts[postIdx] }).status(200);
    }

    //
    else {
      res.json({ status: "failed", message: "post is not found" }).status(404);
    }
  }

  //
  else res.json({ status: "failed", message: "id is not valid" }).status(400);
};

const updatePost = (req, res) => {
  const id = parseInt(req.params.id);

  if (!isNaN(id)) {
    const postIdx = posts.findIndex((post) => post.id === id);
    const { descrip } = req.body;
    if (postIdx != -1) {
      if (descrip) {
        const newPost = { descrip: descrip };
        newPost.id = posts[postIdx].id;
        posts[postIdx] = newPost;
        res.json({ status: "succeed", post: posts[postIdx] }).status(200);
      }
      //
      else
        res
          .json({
            status: "failed",
            message: "No data is modified",
          })
          .status(405);
    }
    //
    else {
      res.json({ status: "failed", message: "post is not found" }).status(404);
    }
  }

  //
  else {
    res
      .json({
        status: "failed",
        message: "post id is not valid",
      })
      .status(400);
  }
};

const deletePost = (req, res) => {
  const id = parseInt(req.params.id);
  if (!isNaN(id)) {
    const postIdx = posts.findIndex((post) => post.id === id);
    if (postIdx != -1) {
      res
        .status(200)
        .json({ status: "succeed", posts: posts.splice(postIdx, 1) });
    } else {
      res.status(404).json({ status: "failed", message: "post is not found" });
    }
  } else {
    res.json({ status: "failed", message: "post id is not valid" }).status(400);
  }
};

//
//implementing users end points
//

app.route("/users").get(getAllUsers).post(AddUser);
app.route("/users/getSorted").get(getALLSorted);
app.route("/users/:id").delete(deleteUser).put(updateUser).post(searchUser);

//
//implementing posts end points
//

app.route("/posts").get(getAllPosts).post(addPost);
app.route("/posts/getReversed").get(getReversed);
app.route("/posts/:id").delete(deletePost).put(updatePost).post(searchPost);
app.listen(4000, () => console.log("listening on port 4000"));
