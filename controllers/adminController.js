const Post = require('../models/postModel');
const Category = require('../models/categoryModel');
const Comment = require('../models/commentModel');
const {isEmpty} = require('../config/customFunctions');

module.exports = {
    index: (req, res) => {
        res.render('admin/index');
    },

    getPost: (req, res) => {
        Post.find().lean()
            .populate('category')
            .then(result=> {
                res.render('admin/posts/index', {posts: result});
            })
            .catch(err=> {
                console.log(err);
            })
    },
    submitPost: (req, res) => {
        const commentsAllowed = req.body.allowComments ? true: false;

        let filename = '';
        console.log(req.files);
        if (!isEmpty(req.files)) {
            let file = req.files.uploadFile;
            filename = file.name;
            let uploadDir = './public/uploads/';
            file.mv(uploadDir+filename,err=> {
                if (err) {
                    console.log(err);
                }
            });
        }
        const newPost = new Post({
                title: req.body.title,
                description: req.body.description,
                allowComments: commentsAllowed,
                category:req.body.category,
                file: `/uploads/${filename}`,
            }
        );
        newPost.save()
            .then(result => {
                console.log(result);
                req.flash('success-message', 'Create a new Post Successfully!');
                res.redirect('/admin/posts');
            })
            .catch(err=> {
                console.log(err);
            })
    },

    createPost: (req, res) => {
        // add lean() to display MongoDB
        Category.find().lean()
            .then(result => {
                res.render('admin/posts/create', {categories: result});
            })
    },

    editPost: (req, res) => {
        const id = req.params.id;
        Post.findById(id).lean()
            .then(result => {
                Category.find().lean()
                    .then(category => {
                        res.render('admin/posts/edit', {post: result, categories: category});
                    })
            })
            .catch(err=> {
                console.log(err);
            })
    },


    editPostSubmit: (req, res) => {
        const commentsAllowed = req.body.allowComments ? true: false;
        const id = req.params.id;
        // no need for lean() since you're sending the document back to MongoDB instead of displaying MongoDB
        Post.findById(id)
            .then(result => {
                result.title = req.body.title;
                result.allowComments = commentsAllowed;
                result.description = req.body.description;
                result.category = req.body.category;

                result.save()
                    .then(result=> {
                        console.log(result);
                        req.flash('success-message', `Updated the ${result.title} Post Successfully!`);
                        res.redirect('/admin/posts');
                    })
            })
            .catch(err=> {
                console.log(err);
            })

    },

    deletePost: (req, res) => {
        const id = req.params.id;
        Post.findByIdAndDelete(id)
            .then(result => {
                req.flash('success-message',`Delete the ${result.title} Post Successfully!`);
                res.redirect('/admin/posts');
            })
    },

    logout: (req, res) => {
        req.logout();
        req.flash('success-message', 'Logout was successful');
        res.redirect('/');
    },

    // category methods

    getCategories: (req, res) => {
        Category.find().lean()
            .then(result => {
                res.render('admin/category/index', {categories: result});
            })
            .catch(err=> {
                console.log(err);
            })
    },

    createCategories: (req, res) => {
        let categoryName = req.body.name;
        if(categoryName) {
            const newCategory = new Category({
                title: categoryName,
            });
            newCategory.save()
                .then(result=> {
                    res.status(200).json(result);
                })
        }
    },

    deleteCategories: (req, res) => {
        const id = req.params.id;
        Category.findByIdAndDelete(id)
            .then(result => {
                res.redirect('/admin/category');
            })
    },

    editCategories: async (req, res) => {
        const catId = req.params.id;
        const cats = await Category.find().lean();
        Category.findById(catId).lean()
            .then(result => {
                res.render('admin/category/edit', {category: result, categories: cats});
            })
    },

    editCategoriesPost: (req, res) => {
        const carId = req.params.id;
        const newTitle = req.body.name;
        if(newTitle) {
            Category.findById(carId)
                .then(result => {
                    result.title = newTitle;
                    result.save()
                        .then(updated=> {
                            res.status(200).json({url: '/admin/category'});
                        })
                })
        };
    },

    // comment method
    getComments: (req, res) => {
        Comment.find().lean()
            .populate('user')
            .then(result => {
            res.render('admin/comments/index', {comments: result});
        })
    },


}