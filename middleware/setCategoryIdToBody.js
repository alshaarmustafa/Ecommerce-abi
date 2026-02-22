setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryID;
    next();
};
module.exports = setCategoryIdToBody;