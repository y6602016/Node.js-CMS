const Post = require('../models/postModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const bcrypt = require('bcrypt');


module.exports = {
    index: async (req, res)=> {
        const posts = await Post.find().lean();
        const categories = await Category.find().lean();
        res.render('default/index',{posts:posts, categories:categories});
    },

    loginGet: (req, res)=> {
        res.render('default/login');
    },

    loginPost: (req, res)=> {

    },

    registerGet: (req, res)=> {
        res.render('default/register');
    },

    registerPost: (req, res)=> {
        let errors = [];

        if (!req.body.firstName) {
            errors.push({message: 'First name is required'});
        }
        if (!req.body.lastName) {
            errors.push({message: 'Last name is required'});
        }
        if (!req.body.email) {
            errors.push({message: 'Email name is required'});
        }
        if (req.body.password != req.body.passwordConfirm) {
            errors.push({message: 'Password does not match'});
        }
        // if there is an error, notice the user
        if (errors.length > 0) {
            res.render('default/register', {
                errors: errors,
                firstName: req.body.firstName,
                lastname: req.body.lastName,
                email: req.body.email,
            });
        }
        // if there is no error, check whether the email has been used or not
        else {
            User.findOne({email:req.body.email})
                .then(result => {
                    if (result) {
                        req.flash('error-message', 'Email already exists. Please log in.');
                        res.redirect('/login');
                    }
                    // use bcrypt library to hash the password
                    else {
                        const newUser = new User(req.body);

                        bcrypt.genSalt(10,(err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash)=> {
                                newUser.password = hash;
                                newUser.save()
                                    .then(result=> {
                                        req.flash('success-message', 'Welcome! Register Successfully!');
                                        res.redirect('/login');
                                    });
                            });
                        });
                    }
                });
        }

    },

    getSinglePost: (req, res) => {
      const id = req.params.id;
      Post.findById(id).lean()
          .populate({path: 'comments', populate: {path: 'user', model: 'user'}})
          .then(result => {
              if(!result) {
                  res.status(404).json({message: 'No Post Found'});
              }
              else {
                  res.render('default/singlePost', {post: result, comments: result.comments});
              }
          })
    },

    submitComment: (req, res) => {
        if (req.user) {
            Post.findById(req.body.id)
                .then(result=> {
                    const newComment = new Comment({
                        user: req.user.id,
                        body: req.body.comment_body,
                    });

                    result.comments.push(newComment);
                    result.save()
                        .then(savedPost => {
                            newComment.save()
                                .then(savedComment => {
                                    res.redirect(`/post/${result._id}`);
                                });
                        });
                });
        }
        else {
            req.flash('error-message', 'Please Login to Comment');
            res.redirect('/login');
        }
    },

    logout: (req, res)=> {
        req.logOut();
        req.flash('success-message', 'Logout was successful');
        res.redirect('/');
    },
}