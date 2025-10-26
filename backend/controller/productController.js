import uploadOnCloudinary from "../config/cloudinary.js";
import Product from "../model/productModel.js";

export const addProduct = async (req, res) => {
  try {
    let { name, description, price, category, subCategory, sizes, bestseller } =
      req.body;

    if (
      !req.files ||
      !req.files.image1 ||
      !req.files.image2 ||
      !req.files.image3 ||
      !req.files.image4
    ) {
      return res.status(400).json({ message: "All four images are required." });
    }

    const uploadPromises = [
      uploadOnCloudinary(req.files.image1[0].buffer),
      uploadOnCloudinary(req.files.image2[0].buffer),
      uploadOnCloudinary(req.files.image3[0].buffer),
      uploadOnCloudinary(req.files.image4[0].buffer),
    ];

    const [image1, image2, image3, image4] = await Promise.all(uploadPromises);

    if (!image1 || !image2 || !image3 || !image4) {
      return res
        .status(500)
        .json({ message: "Error uploading images to Cloudinary" });
    }

    let productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true",
      date: Date.now(),
      image1,
      image2,
      image3,
      image4,
    };

    const product = await Product.create(productData);

    return res.status(201).json(product);
  } catch (error) {
    console.log(error);

    console.log("AddProduct error");

    return res.status(500).json({ message: `AddProduct error ${error}` });
  }
};

export const listProduct = async (req, res) => {
  try {
    const product = await Product.find({});
    return res.status(200).json(product);
  } catch (error) {
    console.log("ListProduct error");
    return res.status(500).json({ message: `ListProduct error ${error}` });
  }
};

export const removeProduct = async (req, res) => {
  try {
    let { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    return res.status(200).json(product);
  } catch (error) {
    console.log("RemoveProduct error");
    return res.status(500).json({ message: `RemoveProduct error ${error}` });
  }
};
