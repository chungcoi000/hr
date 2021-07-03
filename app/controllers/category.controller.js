const db = require("../models");
const Category = db.category;


exports.getCategory = async (req, res) => {
    try {
        const category = await Category.find({}).lean();
        res.render("staff/categoryList", {category: category});
    } catch (err) {
        res.send({message: "Error"});
    }
};

exports.addCategory = async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name,
            description: req.body.description
        });

        const name = await Category.findOne({name: req.body.name});
        if (name) {
            return res.render("staff/addCategory", {
                error: true,
                message: "Course is existed in category"
            });
        }
        await category.save();
        return res.redirect("/staff/getCate");
    } catch (err) {
        return res.send({message: "Error"});
    }
};

exports.getAddCategory =  async (req, res) => {
    try{
        res.render("staff/addCategory");
    } catch (err) {
        res.send({message: err})
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const deleteId = req.body.delete_id;
        await Category.deleteOne({_id: deleteId});
        res.render("staff/categoryList");
    } catch (err) {
        return res.send({message: "Error"});
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const cate_id = req.body.cate_id;
        const name = req.body.name;
        const description = req.body.description;
        await Category.updateOne(
            {_id: cate_id},
            {name: name, description: description}
        );
        return res.redirect("/staff/getCate");
    } catch (err) {
        return res.send({message: "Error"});
    }
};

exports.getUpdateCategory = async (req, res) => {
    try {
        let id = req.query.cate_id;
        const category = await Category.findOne({_id: id}).lean();
        return res.render("staff/categoryUpdate", {
            category: category
        })
    } catch (err) {
        return res.send({message: "Error"})
    }
}

exports.searchCategory = async (req, res) => {
    try {
        let query = req.body.query;
        let filter = {
            $or: [
                {name: {$regex: query, $options: 'i'}},
                {description: {$regex: query, $options: 'i'}}
            ]
        }
        if (!query) {
            filter = {};
        }
        const category = await Category.find(filter).lean();

        if (category.length === 0) {
            return res.send({message: "Can't find anything"});
        }

        res.render("staff/categoryList", {category: category})

    } catch (err) {
        return res.send({message: "Error"})
    }
}


