const productModel = require("../models/products");
const helpers = require("../helpers/helpers");
const fs = require("fs");
const path = require("path");
const createError = require("http-errors");
const dirPath = path.join(__dirname, "../../uploads");

const getAllProduct = (req, res, next) => {
  let numRows;
  const searchBy = req.query.searchBy || "products.name_product";
  const numPerPage = parseInt(req.query.npp) || 15;
  const page = parseInt(req.query.page) || 1;
  let numPages;
  const skip = (page - 1) * numPerPage;
  const field = req.query.field || "name_product";
  const sort = req.query.sort || "ASC";
  const paramSearch = req.query.search || "";
  
  // Here we compute the LIMIT parameter for MySQL query
  const limit = skip + "," + numPerPage;
  productModel
    .paginationProduct(numPerPage, page, paramSearch, searchBy)
    .then((result) => {
      numRows = result[0].numRows;
      numPages = Math.ceil(numRows / numPerPage);
      console.log("number per pages:", numPerPage);
      console.log("number of pages:", numPages);
      console.log("total pages:", numRows);
    });

  productModel
    .getAllProduct(field, sort, limit, paramSearch, searchBy)
    .then((result) => {
      const responsePayload = {
        result: result,
      };
      if (page <= numPages) {
        responsePayload.pagination = {
          totalData: numRows,
          current: page,
          totalPages: numPages,
          perPage: numPerPage,
          previous: page > 1 ? page - 1 : undefined,
          next: page < numPages ? page + 1 : undefined,
          sortBy: field,
          orderBy: sort,
          search: paramSearch,
        };
      } else {
        responsePayload.pagination = {
          err:
            "queried page " +
            page +
            " is >= to maximum page number " +
            numPages,
        };
      }

      helpers.response(res, "Success get data", responsePayload, 200);
    })
    .catch((error) => {
      console.log(error);
      helpers.response(res, "Not found product", null, 404);
    });
};

const getProduct = (req, res, next) => {
  const id = req.params.id;
  productModel
    .getProduct(id)
    .then((result) => {
      const products = result;
      helpers.response(res, "Success get data", products, 200);
    })
    .catch((error) => {
      console.log(error);
      const err = new createError.InternalServerError();
      next(err);
    });
};

const getProductByCategory = (req, res, next) => {
  const category_name = req.query.category || "Favorite & Promo";
 let numRows;
 const numPerPage = parseInt(req.query.npp) || 15;
 const page = parseInt(req.query.page) || 1;
 let numPages;
 const skip = (page - 1) * numPerPage;
 const field = req.query.field || "name_product";
 const sort = req.query.sort || "ASC";

 // Here we compute the LIMIT parameter for MySQL query
 const limit = skip + "," + numPerPage;
 productModel
   .paginationCategory(numPerPage, page, category_name)
   .then((result) => {
     numRows = result[0].numRows;
     numPages = Math.ceil(numRows / numPerPage);
     console.log("number per pages:", numPerPage);
     console.log("number of pages:", numPages);
     console.log("total pages:", numRows);
   });

 productModel
   .getProductByCategory(field, sort, limit, category_name)
   .then((result) => {
     const responsePayload = {
       result: result,
     };
     if (page <= numPages) {
       responsePayload.pagination = {
         totalData: numRows,
         current: page,
         totalPages: numPages,
         perPage: numPerPage,
         previous: page > 1 ? page - 1 : undefined,
         next: page < numPages ? page + 1 : undefined,
         sortBy: field,
         orderBy: sort,
         category: category_name,
       };
     } else {
       responsePayload.pagination = {
         err:
           "queried page " + page + " is >= to maximum page number " + numPages,
       };
     }

     helpers.response(res, "Success get data", responsePayload, 200);
   })
   .catch((error) => {
     console.log(error);
     helpers.response(res, "Not found product", null, 404);
   });
};

const insertProduct = (req, res, next) => {
  const fileName = req.file.filename;
  const urlFileName = `${process.env.BASE_URL}/files/${fileName}`;
  const { name_product, price, description,size,delivery,start_order,stop_order,stock, category_id, } = req.body;
  const data = {
    name_product: name_product,
    price: price,
    description: description,
    size: size,
    delivery: delivery,
    start_order: start_order,
    stop_order: stop_order,
    stock: stock,
    category_id: category_id,
    image_product: urlFileName,
    createdAt: new Date(),
  };
  productModel
    .insertProduct(data)
    .then(() => {
      helpers.response(res, "Success insert data", data, 200);
    })
    .catch((error) => {
      console.log(error);
      helpers.response(res, "Failed insert data", null, 404);
     fs.unlink(`${dirPath}/${fileName}`, (err) => {
       if (err) {
         console.log("Error unlink image product!" + err);
       }
     });
    });
};
const updateProduct = (req, res) => {
  const id = req.params.id;
 let image_product = "";
  let imageProductInput = "";

  if (!req.file) {
    imageProductInput = "";
  } else {
    imageProductInput = req.file.filename;
  }

 productModel.getProduct(id).then((result) => {
    const oldImageProduct = result[0].image_product;

    const newImageProduct = `${process.env.BASE_URL}/files/${imageUserInput}`;
    if (imageProductInput == "") {
      image_product = oldImageProduct;
    } else {
      image_product = newImageProduct;
    }
       const {
         name_product,
         price,
         description,
         size,
         delivery,
         start_order,
         stop_order,
         stock,
         category_id,
       } = req.body;
       const data = {
         name_product: name_product,
         price: price,
         description: description,
         size: size,
         delivery: delivery,
         start_order: start_order,
         stop_order: stop_order,
         stock: stock,
         category_id: category_id,
         image_product: image_product,
         updatedAt: new Date(),
       };
        productModel
          .updateProduct(id, data)
          .then(() => {
            helpers.response(res, "Success update product", data, 200);
              if (image_product === oldImageProduct) {
                console.log("no change on image!");
              } else {
                fs.unlink(`${dirPath}/${oldImageProduct.substr(28)}`, (err) => {
                  if (err) {
                    console.log("Error unlink image product!" + err);
                  }
                });
              }
          })
          .catch((error) => {
            console.log(error);
            helpers.response(res, "Failed update product", null, 404);
             fs.unlink(`${dirPath}/${imageProductInput}`, (err) => {
               if (err) {
                 console.log("Error unlink image product!" + err);
               }
             });
          });
      });
};
const deleteProduct = (req, res) => {
  const id = req.params.id;
  productModel
    .deleteProduct(id)
    .then((result) => {
      helpers.response(res, "Success delete data", id, 200);
    //    fs.unlink(`${dirPath}/${result[0].image_product.substr(28)}`, (err) => {
    //      if (err) {
    //        console.log("Error unlink image product!" + err);
    //      }
    //    });
    })
    .catch((err) => {
      console.log(err);
      helpers.response(res, "Not found id product", null, 404);
      
    });
};

module.exports = {
  getAllProduct,
  getProduct,
  getProductByCategory,
  insertProduct,
  updateProduct,
  deleteProduct,
};
