const ProductsModel = require("../models/products");

exports.getAllProducts = async (req, res, next) => {
  try {
    let products = await ProductsModel.find({});

    return res.status(200).json({
      message: "Products fetched successfully.",
      data: products,
    });
  } catch (error) {
    return next(error);
  }
};

exports.toggleProductVisibility = async (req, res, next) => {
  try {
    let productId = req.params["id"];
    if (!productId) {
      return res.status(400).send("Invalid params.");
    }

    let product = await ProductsModel.findOne({ _id: productId });

    if (!product) {
      return res.status(404).send("Invalid product id.");
    }

    await ProductsModel.updateOne(
      { _id: productId },
      { $set: { isEnable: !product.isEnable } }
    );

    product = await ProductsModel.findOne({ _id: productId });
    return res.status(200).json({
      message: "Product enabled/disabled successfully.",
      data: product,
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    let productId = req.params["id"];
    if (!productId) {
      return res.status(400).send("Invalid params.");
    }

    let product = await ProductsModel.findOne({ _id: productId });

    if (!product) {
      return res.status(404).send("Invalid product id.");
    }

    await ProductsModel.deleteOne({ _id: productId });

    return res.status(200).json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    let productId = req.params["id"];
    if (!productId) {
      return res.status(400).send("Invalid params.");
    }

    let product = await ProductsModel.findOne({ _id: productId });

    if (!product) {
      return res.status(404).send("Invalid product id.");
    }

    await ProductsModel.updateOne(
      { _id: productId },
      {
        $set: {
          name: req.body.name,
          price: req.body.price,
          isEnable: req.body.isEnable,
        },
      }
    );

    product = await ProductsModel.findOne({ _id: productId });
    return res.status(200).json({
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    return next(error);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    if (!req.body.name) {
      return res.status(400).send("Please provide product name.");
    }

    if (req.body.price == undefined) {
      return res.status(400).send("Please provide product price.");
    }

    if (req.body.price === 0) {
      return res.status(400).send("Product price should be greater than 0.");
    }

    const newProduct = new ProductsModel({
      name: req.body.name,
      price: req.body.price,
    });

    await newProduct.save();

    return res.status(200).json({
      message: "Product created successfully.",
      data: newProduct,
    });
  } catch (error) {
    return next(error);
  }
};
