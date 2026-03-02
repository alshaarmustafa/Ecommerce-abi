const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Category = require('../../models/categoryModel');
const SubCategory = require('../../models/subCategoryModel');
const Product = require('../../models/productModel');

exports.createProductValidator = [
  check('title')
    .notEmpty().withMessage('Product title is required')
    .isLength({ min: 2 }).withMessage('must be at least 2 chars')
    .isLength({ max: 200 }).withMessage('Too long product title')
    .custom((val, { req }) => {
      // generate slug from title
      req.body.slug = slugify(val);
      return true;
    }),
  check('description')
    .notEmpty().withMessage('Product description is required')
    .isLength({ min: 20 }).withMessage('Too short description')
    .isLength({ max: 2000 }).withMessage('Too long description'),

  check('quantity')
    .notEmpty().withMessage('Product quantity is required')
    .isInt({ min: 0 }).withMessage('Product quantity must be a positive number')
    .toInt(),

  check('sold')
    .optional()
    .isInt({ min: 0 }).withMessage('Sold must be a positive number')
    .toInt(),
  check('price')
    .notEmpty().withMessage('Product price is required')
    .isFloat({ min: 0 }).withMessage('Product price must be a positive number')
    .toFloat(),

  check('priceAfterDiscount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Product priceAfterDiscount must be a positive number')
    .toFloat()
    .custom((value, { req }) => {
      // ensure discount price is lower than original price
      const price = parseFloat(req.body.price);
      if (value >= price) {
        throw new Error('priceAfterDiscount must be lower than price');
      }
      return true;
    }),

  check('colors')
    .optional()
    .isArray().withMessage('availableColors should be array of string'),

  check('imageCover')
    .notEmpty().withMessage('Product imageCover is required'),

  check('images')
    .optional()
    .isArray().withMessage('images should be array of string'),

  check('category')
    .notEmpty().withMessage('Product must be belong to a category')
    .isMongoId().withMessage('Invalid ID formate')
    .custom((categoryId) => (
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    )),

  check('subcategories')
    .optional()
    .isArray().withMessage('subcategories must be an array'),

  check('subcategories.*')
    .optional()
    .isMongoId().withMessage('Invalid subcategory ID format'),
  check('subcategories')
    .optional()
    //انو subcategoriesIds هنن نفسن يلي بقاعدة البيانات يعني مبعوت تلاتة لاوم يكونو الاتلاتة موجودين بقاعدة البيانات 
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (result) => {
          if (result.length !== subcategoriesIds.length) {
            return Promise.reject(new Error(`Invalid subcategories Ids`));
          }
        }
      )
    )
    //بدي اتاكد انو الاصناف الفرعية المبعوتين كلن هني تابعين ل الصنف الرئيسي نفسو
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category })
        //return all subcategories that belong to category in db 
        .then(
          (subcategories) => {
            //push all subcategories ids in db in array to compare it with subcategories ids in req.body
            const subCategoriesIdsInDB = [];
            subcategories.forEach((subCategory) => {
              subCategoriesIdsInDB.push(subCategory._id.toString());
            });
            // check if subcategories ids in db include subcategories in req.body (true)
            //target is array of subcategories ids in req.body on val and arr is array of subcategories ids in db on subCategoriesIdsInDB
            //checker return true if all subcategories ids in req.body exist in db and return false if not
            const checker = (target, arr) => target.every((v) => arr.includes(v));
            if (!checker(val, subCategoriesIdsInDB)) {
              return Promise.reject(
                new Error(`subcategories not belong to category`)
              );
            }
          }
        )
    ),



  check('brand').optional().isMongoId().withMessage('Invalid ID formate'),

  check('ratingsAverage')
    .optional()
    .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1.0 and 5.0')
    .toFloat(),

  check('ratingsQuantity')
    .optional()
    .isInt({ min: 0 }).withMessage('ratingsQuantity must be a positive number')
    .toInt(),

  validatorMiddleware,
];

exports.getProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),

  body('title')
    .optional()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ min: 2 }).withMessage('must be at least 2 chars')
    .isLength({ max: 200 }).withMessage('Too long product title')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('description')
    .optional()
    .notEmpty().withMessage('Description cannot be empty')
    .isLength({ min: 20 }).withMessage('Too short description')
    .isLength({ max: 2000 }).withMessage('Too long description'),

  check('quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Product quantity must be positive')
    .toInt(),

  check('sold')
    .optional()
    .isInt({ min: 0 }).withMessage('Sold must be positive')
    .toInt(),

  check('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Product price must be positive')
    .toFloat(),

  check('priceAfterDiscount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Product priceAfterDiscount must be positive')
    .toFloat()
    .custom(async (value, { req }) => {
      let price = req.body.price;
      if (!price) {
        const product = await Product.findById(req.params.id);
        if (!product) {
          throw new Error('Product not found');
        }
        price = product.price;
      }
      if (value >= price) {
        throw new Error('priceAfterDiscount must be lower than price');
      }
      return true;
    }),

  check('colors')
    .optional()
    .isArray().withMessage('availableColors should be array of string'),

  check('imageCover')
    .optional(),

  check('images')
    .optional()
    .isArray().withMessage('images should be array of string'),

  check('category')
    .optional()
    .isMongoId().withMessage('Invalid ID formate')
    .custom((categoryId) => (
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    )),

  check('subcategories')
    .optional()
    .isArray().withMessage('subcategories must be an array'),

  check('subcategories.*')
    .optional()
    .isMongoId().withMessage('Invalid subcategory ID format'),

  check('subcategories')
    .optional()
    // انو subcategoriesIds هنن نفسن يلي بقاعدة البيانات
    // لازم كلن يكونو موجودين
    .custom(async (val, { req }) => {

      let category = req.body.category;

      // اذا الكاتيجوري ما انبعت منجيبها من المنتج الحالي
      if (!category) {
        const product = await Product.findById(req.params.id);
        if (!product) {
          throw new Error('Product not found');
        }
        category = product.category;
      }

      const subcategories = await SubCategory.find({ category });

      // push all subcategories ids in db in array to compare
      const subCategoriesIdsInDB = subcategories.map((subCategory) =>
        subCategory._id.toString()
      );

      const checker = (target, arr) =>
        target.every((v) => arr.includes(v));

      if (!checker(val, subCategoriesIdsInDB)) {
        throw new Error(`subcategories not belong to category`);
      }

      return true;
    }),

  check('brand')
    .optional()
    .isMongoId().withMessage('Invalid ID formate'),

  check('ratingsAverage')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1.0 and 5.0')
    .toFloat(),

  check('ratingsQuantity')
    .optional()
    .isInt({ min: 0 }).withMessage('ratingsQuantity must be a positive number')
    .withMessage('ratingsQuantity must be a number')
    .toInt(),

  // لازم المستخدم يبعت على الاقل حقل واحد للتعديل
  check().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0) {
      throw new Error('You must send at least one field to update');
    }
    return true;
  }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];