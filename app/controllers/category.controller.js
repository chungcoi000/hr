const db = require("../models");
const Category = db.category;


exports.getCategory = async (req, res) => {
    try {
        const category = await Category.find({}).lean();
        res.render("staff/categoryList", {category: category});
    } catch (err) {
        res.send({message : "Error"});
    }
};

exports.addCategory = async (req, res) => {
    try {
        const category = new Category({
            name : req.body.name,
            description : req.body.description
        });

        const name = await Category.findOne({name : req.body.name});
        if (name) {
            return res.send({ message : "Course is existed in category"});
        }
        await category.save();
        return res.send({message : "Category add successfully"});
    } catch (err) {
        return res.send({message: "Error"});
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await Category.deleteOne({_id: req.body.id});
        res.send({ message : "Delete category successfully"});
    } catch (err) {
        return res.send({message: "Error"});
    }
};

exports.updateCategory = async  (req, res) => {
    try {
        const name = req.body.name;
        const description = req.body.description;
        await Category.updateOne(
            {_id: req.body.id},
            {name : name, description : description}
        );
        return res.send({message : "Update successfully"});
    } catch (err) {
        return res.send({message: "Error"});
    }
};


