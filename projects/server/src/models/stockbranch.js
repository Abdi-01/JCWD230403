'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stockBranch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // stockBranch.belongsTo(models.admin);
      stockBranch.belongsTo(models.branch, {
        foreignKey:'branch_id'});
      stockBranch.belongsTo(models.product, {
        foreignKey:'product_id'});
      stockBranch.hasMany(models.product, {
        foreignKey:'stockBranchId'});
      stockBranch.hasMany(models.historyStockProduct);
      stockBranch.hasMany(models.cart, {
        foreignKey: 'stockBranchId' 
      });
    } 
  } 
  stockBranch.init({
    stock: DataTypes.INTEGER, 
    booking: DataTypes.INTEGER,
    entryDate: DataTypes.DATEONLY,
    product_id: DataTypes.INTEGER,
    branch_id: DataTypes.INTEGER,
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'stockBranch',
  });
  return stockBranch;
};