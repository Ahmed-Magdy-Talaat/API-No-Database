import http from "http";
let count = 1,
  countPost = 1;
let users = [
  {
    name: "Ahmed",
    email: "ahmed@gmail.com",
    id: count++,
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

http
  .createServer((req, res) => {
    const { url, method } = req;
    if (url === "/users/getAll" && method === "GET") {
      res.statusCode = 200;
      res.write(JSON.stringify({ status: "succeed", users: users }));
      res.end();
    }

    //Add user
    else if (url === "/users" && method === "POST") {
      res.statusCode = 200;
      let data = "";

      req.on("data", (chunk) => {
        data += chunk;
      });

      req.on("end", () => {
        if (data) {
          data = JSON.parse(data);

          const boolDuplicate = users.find((user) => {
            return user.email === data.email;
          });

          if (boolDuplicate) {
            res.write(
              JSON.stringify({
                status: "failed",
                message: "The Email is Duplicated",
              })
            );
            res.statusCode = 400;
          } else {
            data.id = count++;
            users.push(data);
            res.write(JSON.stringify({ status: "succeed", users: users }));
            res.statusCode = 201;
          }

          res.end();
        }
        //
        else {
          res.end(
            JSON.stringify({ status: "failed", message: "No data is added" })
          );
        }
      });
    }

    //Get All users sorted alphabaticaly
    //
    else if (url === "/users/getALLSorted" && method === "GET") {
      res.write(
        JSON.stringify({
          status: "succeed",
          users: [...users].sort((a, b) => a.name.localeCompare(b.name)),
        })
      );
      res.statusCode = 200;
      res.end();
    }

    // Delete User
    else if (url.startsWith("/users/") && method === "DELETE") {
      const id = parseInt(url.split("/")[2]);

      if (!isNaN(id)) {
        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex !== -1) {
          users.splice(userIndex, 1);
          res.write(JSON.stringify({ status: "succeed", users: users }));
        } else {
          res.write(
            JSON.stringify({ status: "failed", message: "User is not found" })
          );
        }
      } else {
        res.write(
          JSON.stringify({ status: "failed", message: "Not a Valid id" })
        );
      }
      res.statusCode = 200;
      res.end();
    }

    //update User
    //
    //
    else if (url.startsWith("/users/") && method === "PUT") {
      const id = parseInt(url.split("/")[2]);

      if (!isNaN(id)) {
        const index = users.findIndex((user) => user.id === id);

        if (index !== -1) {
          let data = "";

          req.on("data", (chunk) => {
            data += chunk;
          });

          //
          req.on("end", () => {
            if (data) {
              data = JSON.parse(data);
              const isDuplicated = users.find(
                (user) => user.email === data.email && user != users[index]
              );

              if (isDuplicated) {
                res.write(
                  JSON.stringify({
                    status: "failed",
                    message: "User email is Duplicated ",
                  })
                );
              } else {
                data.id = users[index].id;
                users[index] = data;
                res.statusCode = 202;
                res.write(JSON.stringify({ status: "Succeed", user: data }));
              }
              res.end();
            }
            //
            else {
              res.end(
                JSON.stringify({
                  status: "failed",
                  message: "No data is modified",
                })
              );
            }
          });
        }
        //
        else {
          res.statusCode = 404;
          res.write(
            JSON.stringify({ status: "failed", message: "User is not found " })
          );
          res.end();
        }
      }

      //
      else {
        res.statusCode = 400;
        res.write(JSON.stringify({ status: "failed", message: "Invalid id" }));
        res.end();
      }
    }

    //
    //
    //search for the user
    else if (url.startsWith("/users/search/") && method === "POST") {
      const id = parseInt(url.split("/")[3]);

      if (!isNaN(id)) {
        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex != -1) {
          res.statusCode = 202;

          res.write(
            JSON.stringify({ status: "succeed", user: users[userIndex] })
          );
        }
        //
        else {
          res.statusCode = 404;

          res.write(
            JSON.stringify({ status: "succeed", message: "User is not found" })
          );
        }
      }
      //
      //
      else {
        res.statusCode = 400;
        res.write(
          JSON.stringify({ status: "failed", message: "Not valid Id" })
        );
      }
      res.end();
    }
  })
  .listen(3000, () => console.log("listening on port 3000"));

//
//
//
//
//Handling post end points on other server to allow isolation and to make the code more
//managable

http
  .createServer((req, res) => {
    const { url, method } = req;

    if (url === "/posts" && method === "POST") {
      let data = "";

      req.on("data", (chunk) => {
        data += chunk;
      });

      //
      req.on("end", () => {
        //
        if (data !== "") {
          data = JSON.parse(data);
          data.id = countPost++;
          posts.push(data);
          res.statusCode = 200;
          res.write(JSON.stringify({ status: "succeed", posts: posts }));
          res.end();
        }
        //
        else {
          res.end(
            JSON.stringify({ status: "failed", message: "No data is added" })
          );
        }
      });
    }

    //
    else if (url === "/posts/getAll" && method === "GET") {
      res.statusCode = 200;
      res.end(JSON.stringify({ status: "succeed", posts: posts }));
    }

    //
    else if (url === "/posts/getReversed" && method === "GET") {
      res.statusCode = 200;
      res.end(
        JSON.stringify({ status: "succeed", posts: [...posts].reverse() })
      );
    }

    //
    //
    else if (url.startsWith("/posts/")) {
      //
      if (method === "DELETE") {
        const id = parseInt(url.split("/")[2]);

        if (!isNaN(id)) {
          const exist = posts.findIndex((post) => post.id === id);

          if (exist != -1) {
            posts.splice(exist, 1);
            res.statusCode = 200;
            res.write(JSON.stringify({ status: "succeed", posts: posts }));
          }
          //
          else {
            res.statusCode = 404;
            res.write(
              JSON.stringify({ status: "failed", message: "page is not found" })
            );
          }
        }
        //
        else {
          res.write({ status: "failed", message: "id is not valid" });
        }
        res.end();
      }

      //
      //
      else if (method === "PUT") {
        const id = parseInt(url.split("/")[2]);

        if (!isNaN(id)) {
          const postIdx = posts.findIndex((post) => post.id === id);

          if (postIdx != -1) {
            let data = "";
            req.on("data", (chunk) => {
              data += chunk;
            });

            req.on("end", () => {
              if (data) {
                data = JSON.parse(data);
                data.id = posts[postIdx].id;
                posts[postIdx] = data;

                res.statusCode = 200;
                res.write(
                  JSON.stringify({ status: "succeed", post: posts[postIdx] })
                );
                res.end();
              }
              //
              else
                res.end(
                  JSON.stringify({
                    status: "failed",
                    message: "No data is modified",
                  })
                );
            });
          }
          //
          else {
            res.statusCode = 404;
            res.write(
              JSON.stringify({ status: "failed", message: "page is not found" })
            );
            res.end();
          }
        }

        //
        else {
          res.statusCode = 400;
          res.write(
            JSON.stringify({
              status: "failed",
              message: "post id is not valid",
            })
          );
          res.end();
        }
      }

      //
      //
      else if (url.startsWith("/posts/search/") && method === "POST") {
        const id = parseInt(url.split("/")[3]);

        if (!isNaN(id)) {
          const postIdx = posts.findIndex((post) => post.id === id);

          if (postIdx != -1) {
            res.statusCode = 200;

            res.write(
              JSON.stringify({ status: "succeed", post: posts[postIdx] })
            );
            res.end();
          }

          //
          else {
            res.statusCode = 404;

            res.write(
              JSON.stringify({ status: "failed", message: "page is not found" })
            );
            res.end();
          }
        }

        //
        else {
          res.statusCode = 400;
          res.write(
            JSON.stringify({ status: "failed", message: "id is not valid" })
          );
          res.end();
        }
      }
    }
  })
  .listen(5000, () => console.log("listening on port 5000"));
