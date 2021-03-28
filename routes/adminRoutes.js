const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {isUserAuthenticated} = require('../config/customFunctions');

// for all routes, apply the admin layout
// if the user is authenticated, access the admin platform
router.all('/*', isUserAuthenticated,(req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

// admin routes
router.route('/')
    .get(adminController.index);

router.route('/posts')
    .get(adminController.getPost)


router.route('/posts/create')
    .get(adminController.createPost)
    .post(adminController.submitPost);

router.route('/posts/edit/:id')
    .get(adminController.editPost)
    .put(adminController.editPostSubmit);


router.route('/posts/delete/:id')
    .delete(adminController.deletePost);

//admin category routes

router.route('/category')
    .get(adminController.getCategories)
    .post(adminController.createCategories)

router.route('/category/:id')
    .delete(adminController.deleteCategories);

router.route('/category/edit/:id')
    .get(adminController.editCategories)
    .post(adminController.editCategoriesPost);

router.route('/logout')
    .get(adminController.logout)

// admin comment routes
router.route('/comment')
    .get(adminController.getComments)


module.exports = router;