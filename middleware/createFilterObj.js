//filtering by category id if exist in params (we will use this in get subCategories by category)
createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
module.exports = createFilterObj;