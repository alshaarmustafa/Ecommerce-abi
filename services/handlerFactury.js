const asyncHandler = require('express-async-handler');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/AppError');

// @desc    Delete document by id
// @route   DELETE /api/:model/:id
// @access  Private/Admin
exports.deleteOne = (Model) => asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
        res.status(404).json({ message: `No document for this id ${id}` });
    }
    res.status(204).json({ data: null });
});

exports.updateOne = (Model) => asyncHandler(async (req, res) => {

    const document = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!document) {
        res.status(404).json({ message: `No document for this id ${id}` });
    }

    res.status(200).json({ data: document });
});

exports.createOne = (Model) => asyncHandler(async (req, res) => {
    const newDocument = await Model.create(req.body);
    res.status(201).json({ data: newDocument });
});

exports.getOne = (Model) => asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
        res.status(404).json({ message: `No document for this id ${id}` });
    }
    res.status(200).json({ data: document });
});

exports.getAll = (Model,modelName = '') => asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
        filter = req.filterObj;
    }
    const countDocuments = await Model.countDocuments();
    //build query
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query).search(modelName).filter()
        .sort().limitFields().paginate(countDocuments)


    //execute quer
    const { mongooseQuery, paginationResult } = apiFeatures;
    const document = await mongooseQuery;

    res.status(200).json({ results: document.length, paginationResult, data: document });
});