const Category = require('../Models/Products/category');


// Add a new category
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let category = await Category.findOne({ name: name.trim() });
    if (category) {
      return res.status(400).send("Category already exists");
    }
    category = new Category({ name: name.trim() });
    await category.save();
    res.status(200).send({ message: "Category added successfully", category });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(id, { name: name.trim() }, { new: true });
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.status(200).send({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.status(200).send({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { addCategory, getCategories, updateCategory, deleteCategory };
