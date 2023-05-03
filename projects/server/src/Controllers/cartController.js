const { Op } = require('sequelize');
const models = require('../models');
const { v4: uuidv4 } = require('uuid');
const cart = require('../models/cart');
// const {} = require('')

module.exports = {
    addToCart: async (req, res, next) => {
        try {
            // const { quantity } = req.body;
            // 
            // const { userId } = req.decrypt.id

            const getUser = await models.user.findAll({
                where: {
                    uuid: req.decrypt.uuid,
                    isVerified: req.decrypt.isVerified,
                    roleId: req.decrypt.roleId
                }
            })
            // console.log('ini get user:', getUser);


            if (getUser.length > 0) {
                const uuid = uuidv4()
                const { stockBranchId, quantity, productId } = req.body
                const addProduct = await models.cart.create({
                    uuid,
                    // stockBranchId,
                    userId: req.decrypt.id,
                    productId: productId,
                    quantity: quantity
                })

                // const findProductItem = await models.cart.findAll({
                //     where: {
                //         productId: addProduct.stockBranchId
                //     },
                //     include: [{
                //         models: models.stockBranch
                //     }]
                // })

                return res.status(200).send({
                    message: 'Product added to cart',
                    data: addProduct
                })

            } else {
                console.log(error)
                next(error)
            }

        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    getAllCartItem: async (req, res, next) => {
        try {
            const getUser = await models.user.findAll({
                where: {
                    uuid: req.decrypt.uuid,
                    isVerified: req.decrypt.isVerified,
                    roleId: req.decrypt.roleId
                }
            })
            // console.log('ini get user:', getUser);


            if (getUser.length > 0) {

                const getUsersCart = await models.cart.findAll({
                    where: {
                        [Op.and]: [
                            { isChecked: 0 },
                            { userId: req.decrypt.id }
                        ],
                    },
                    include: [
                        {
                            model: models.product,
                            // include: [{ model: models.stockBranch }]
                        }
                    ],
                    order: [["createdAt", "DESC"]]
                })
                return res.status(200).send({
                    message: 'get user\'s cart',
                    data: getUsersCart
                })
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    },

    checkProduct: async (req, res, next) => {
        try {
            const { id } = req.params

            const checkProduct = await models.cart.findByPk(id)

            if (checkProduct.isChecked === true) {
                await models.cart.update(
                    { isChecked: false },
                    { where: { id: checkProduct.id } }
                )

                const uncheckProduct = await models.cart.findByPk(id, {
                    include: [
                        { model: models.product },
                    ],
                })

                return res.status(200).send({
                    message: "Product Uncheck",
                    data: uncheckProduct,
                })
            }

            await models.cart.update(
                { isChecked: true },
                { where: { id: checkProduct.id } }
            )

            const checkProductById = await models.cart.findByPk(id, {
                include: [
                    { model: models.product },
                ],
            })

            return res.status(200).send({
                message: "Product Checked",
                data: checkProductById,
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    },

    checkAllProduct: async (req, res, next) => {
        try {
            const checkAllProduct = await models.cart.findAll({
                where: { userId: req.decrypt.id },
                include: [
                    { model: models.product },
                ],
            })

            const productCheck = checkAllProduct.map((val) => val.isChecked)

            if (!productCheck.includes(false)) {
                await models.cart.update(
                    { isChecked: false },
                    { where: { userId: req.decrypt.id } }
                )

                const uncheckAllProduct = await models.cart.findAll({
                    where: { userId: req.decrypt.id },
                    include: [
                        { model: models.product },
                    ],
                })

                return res.status(200).send({
                    message: "All Product Uncheck",
                    data: uncheckAllProduct,
                })
            }

            await models.cart.update(
                { isChecked: true },
                { where: { userId: req.decrypt.id } }
            )

            const findCheckAllProduct = await models.cart.findAll({
                where: { userId: req.decrypt.id },
                include: [
                    { model: models.product },
                ],
            })

            return res.status(200).send({
                message: "All Product Checked",
                data: findCheckAllProduct,
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
  
    totalPrice: async (req, res, next) => {
        try {
          const { id } = req.decrypt.id;
      
          const getSubTotal = await models.cart.findAndCountAll({
            attributes: [
              [sequelize.fn("sum", sequelize.col("models.product.price * models.cart.quantity")), "totalPrice"],
              [sequelize.fn("sum", sequelize.col("models.quantity")), "totalQty"]
            ],
            include: {
              model: models.product,
              attributes: []
            },
            where: {
              isChecked: true,
              userId: id
            },
            raw: true
          });
      
          const totalPrice = getSubTotal.rows[0];
      
          return res.status(200).send({ message: "Total Price", data: totalPrice });
        } catch (error) {
          console.error(error);
          next(error)
        }
      },
      
    // getCartProductById: async (req, res) => {
    //     try {
    //       const { ProductId } = req.params
    //       const getCartProductById = await db.Cart.findOne({
    //         where: { ProductId },
    //         include: [
    //           {
    //             model: db.Product,
    //             include: [{ model: db.ProductPicture }, { model: db.ProductStock }],
    //           },
    //         ],
    //       })
    //       return res.status(200).json({
    //         message: "Get Product Cart By Id",
    //         data: getCartProductById,
    //       })
    //     } catch (err) {
    //       console.log(err)
    //       return res.status(500).json({
    //         message: err.message,
    //       })
    //     }
    //   },
    getCartById: async (req, res, next) => {
        try {
            const { id } = req.params
            const getCartById = await models.cart.findByPk(id, {
                include: [
                    {
                        model: models.product,
                        include: [{ model: models.stockBranch }],
                    },
                ],
            })
            return res.status(200).send({
                message: "Get Cart By Id",
                data: getCartById,
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    },

    deleteProduct: async (req, res, next) => {
        try {
            const {id} = req.params

            await models.cart.destroy({
                where: {
                    id:id
                },
            })
            return res.status(200).send({
                message: "Item has been removed from your cart"
            })
            
        } catch (error) {
            console.log(error)
            next(error)
        }
    }, 

    deleteAllProduct: async (req,res,next) => {
        try {
            await models.cart.destroy({
                where: {
                    userId: req.decrypt.id
                }
            })
            return res.status(200).send({
                message: 'All items has been removed from your cart'
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}
    //   // add same product, if product already added just increment the quantity of product
    //   addProductQty: async (req, res) => {
    //     try {
    //       const { ProductId } = req.params
    //       const { quantity } = req.body
    //       const addProductQty = await db.Cart.findOne({
    //         where: { ProductId },
    //         include: [
    //           {
    //             model: db.Product,
    //             include: [{ model: db.ProductPicture }, { model: db.ProductStock }],
    //           },
    //         ],
    //       })

    //       const productStock = addProductQty.Product.ProductStocks.map(
    //         (val) => val.stock
    //       )
    //       let subtotal = 0

    //       for (let i = 0; i < productStock.length; i++) {
    //         subtotal += Number(productStock[i])
    //       }

    //       const totalProductStock = subtotal

    //       if (addProductQty.quantity + quantity > totalProductStock) {
    //         return res.status(400).json({
    //           message: "Stok Barang Habis",
    //         })
    //       }

    //       if (!quantity) {
    //         await db.Cart.update(
    //           { quantity: addProductQty.quantity + 1 },
    //           { where: { id: addProductQty.id } }
    //         )

    //         return res.status(200).json({ message: "Product Added" })
    //       }

    //       if (quantity) {
    //         await db.Cart.update(
    //           { quantity: addProductQty.quantity + quantity },
    //           { where: { id: addProductQty.id } }
    //         )

    //         return res.status(200).json({ message: "Product Added" })
    //       }
    //     } catch (err) {
    //       console.log(err)
    //       return res.status(500).json({
    //         message: err.message,
    //       })
    //     }
    //   },
    //   decreaseQty: async (req, res) => {
    //     try {
    //       const { id } = req.params

    //       const findProduct = await db.Cart.findByPk(id)

    //       if (findProduct.quantity <= 1) {
    //         return res.status(200).json({
    //           message: "Minimal 1 Quantity Produk",
    //         })
    //       }

    //       await db.Cart.update(
    //         { quantity: findProduct.quantity - 1 },
    //         { where: { id: findProduct.id } }
    //       )

    //       return res.status(200).json({ message: "Quantity Berkurang" })
    //     } catch (err) {
    //       console.log(err)
    //     }
    //   },
    //   addQty: async (req, res) => {
    //     try {
    //       const { id } = req.params

    //       const findProduct = await db.Cart.findByPk(id, {
    //         include: [
    //           {
    //             model: db.Product,
    //             include: [{ model: db.ProductPicture }, { model: db.ProductStock }],
    //           },
    //         ],
    //       })

    //       const productCart = findProduct.Product.ProductStocks.map(
    //         (val) => val.stock
    //       )
    //       let total = 0

    //       for (let i = 0; i < productCart.length; i++) {
    //         total += Number(total[i])
    //       }

    //       const subTotal = total

    //       if (findProduct.quantity + 1 > subTotal) {
    //         return res.status(400).json({ message: "Stok Produk Habis" })
    //       }

    //       await db.Cart.update(
    //         { quantity: findProduct.quantity + 1 },
    //         { where: { id: findProduct.id } }
    //       )

    //       return res.status(200).json({ message: "Berhasil Menambah Quantity" })
    //     } catch (err) {
    //       return res.status(500).json({ message: err.message })
    //     }
    //   },
