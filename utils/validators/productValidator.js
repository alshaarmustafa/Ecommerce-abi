const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");
const Brand = require("../../models/brandModel");
const Product = require("../../models/productModel");
const mongoose = require("mongoose");
exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 2 })
    .withMessage("must be at least 2 chars")
    .isLength({ max: 200 })
    .withMessage("Too long product title")
    .custom((val, { req }) => {
      // generate slug from title
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20 })
    .withMessage("Too short description")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isInt({ min: 0 })
    .withMessage("Product quantity must be a positive number")
    .toInt(),

  check("sold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sold must be a positive number")
    .toInt(),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0 })
    .withMessage("Product price must be a positive number")
    .toFloat(),

  check("priceAfterDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Product priceAfterDiscount must be a positive number")
    .toFloat()
    .custom((value, { req }) => {
      // ensure discount price is lower than original price
      const price = parseFloat(req.body.price);
      if (value >= price) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),

  check("imageCover").notEmpty().withMessage("Product imageCover is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),

  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`No category for this id: ${categoryId}`);
      }
      return true;
    }),

  check("subcategories")
    .optional()
    .isArray()
    .withMessage("subcategories must be an array")
    // 1. Validate that every ID in the array is a technically valid MongoId
    .custom((ids) => {
      const allValid = ids.every((id) => mongoose.Types.ObjectId.isValid(id));
      if (!allValid) {
        throw new Error("Invalid subcategory ID format");
      }
      return true;
    })
    // 2. Validate existence in DB and relationship with the main category
    .custom(async (subcategoriesIds, { req }) => {
      // Fetch only the subcategories provided in the request from DB
      const subCategoriesFromDB = await SubCategory.find({
        _id: { $in: subcategoriesIds },
      });

      // A- Check if all provided IDs actually exist (Compare input length vs DB results length)
      if (subCategoriesFromDB.length !== subcategoriesIds.length) {
        throw new Error("One or more subcategory IDs do not exist in database");
      }

      // B- Ensure each retrieved subcategory belongs to the main category provided in the request
      const allBelong = subCategoriesFromDB.every(
        (sub) => sub.category.toString() === req.body.category,
      );

      if (!allBelong) {
        throw new Error(
          "Selected subcategories do not belong to the main category",
        );
      }

      return true;
    }),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom(async (value) => {
      const brand = await Brand.findById(value);
      if (!brand) {
        throw new Error("Brand not found");
      }
      return true;
    }),

  check("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1.0 and 5.0")
    .toFloat(),

  check("ratingsQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("ratingsQuantity must be a positive number")
    .toInt(),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),

  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 2 })
    .withMessage("must be at least 2 chars")
    .isLength({ max: 200 })
    .withMessage("Too long product title")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ min: 20 })
    .withMessage("Too short description")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),

  check("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Product quantity must be positive")
    .toInt(),

  check("sold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sold must be positive")
    .toInt(),

  check("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Product price must be positive")
    .toFloat(),

  check("priceAfterDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Product priceAfterDiscount must be positive")
    .toFloat()
    .custom(async (value, { req }) => {
      let price = req.body.price;
      if (!price) {
        const product = await Product.findById(req.params.id);
        if (!product) {
          throw new Error("Product not found");
        }
        price = product.price;
      }
      if (value >= price) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),

  check("imageCover").optional(),

  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),

  check("category")
    .optional()
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`No category for this id: ${categoryId}`);
      }
      return true;
    }),

  check("subcategories")
    .optional()
    .isArray()
    .withMessage("subcategories must be an array")
    // 1. Validate that every ID in the array is a technically valid MongoId
    .custom((ids) => {
      const allValid = ids.every((id) => mongoose.Types.ObjectId.isValid(id));
      if (!allValid) {
        throw new Error("Invalid subcategory ID format");
      }
      return true;
    })
    // 2. Validate existence in DB and relationship with the main category
    .custom(async (subcategoriesIds, { req }) => {
      // Fetch only the subcategories provided in the request from DB
      const subCategoriesFromDB = await SubCategory.find({
        _id: { $in: subcategoriesIds },
      });

      // A- Check if all provided IDs actually exist (Compare input length vs DB results length)
      if (subCategoriesFromDB.length !== subcategoriesIds.length) {
        throw new Error("One or more subcategory IDs do not exist in database");
      }

      let categoryId = req.body.category;
      if (!categoryId) {
        const product = await Product.findById(req.params.id);
        if (!product) {
          throw new Error("Product not found");
        }
        categoryId = product.category;
      }
      // B- Ensure each retrieved subcategory belongs to the main category provided in the request
      const allBelong = subCategoriesFromDB.every(
        (sub) => sub.category.toString() === categoryId.toString(),
      );

      if (!allBelong) {
        throw new Error(
          "Selected subcategories do not belong to the main category",
        );
      }

      return true;
    }),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom(async (value) => {
      const brand = await Brand.findById(value);
      if (!brand) {
        throw new Error("Brand not found");
      }
      return true;
    }),

  check("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1.0 and 5.0")
    .toFloat(),

  check("ratingsQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("ratingsQuantity must be a positive number")
    .toInt(),

  // لازم المستخدم يبعت على الاقل حقل واحد للتعديل
  check().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0) {
      throw new Error("You must send at least one field to update");
    }
    return true;
  }),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];
