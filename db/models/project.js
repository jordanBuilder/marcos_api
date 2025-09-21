const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

module.exports = sequelize.define("projects", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "title cannot be null",
      },
      notEmpty: {
        msg: "title cannot be empty",
      },
    },
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    validate: {
      isIn: {
        args: [[true, false]],
        msg: "isFeatured value must be true or false",
      },
    },
  },
  productImage: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      notNull: {
        msg: "poductImage cannot be null",
      },
    },
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      notNull: {
        msg: "price cannot be null",
      },
      isDecimal: {
        msg: "price value must be in decimal",
      },
    },
  },
  shortDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "shortDescription cannot be null",
      },
      notEmpty: {
        msg: "shortDescription cannot be empty",
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  productUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    validate:{
      notNull:{
        msg: 'productUrl cannot be null',
      },
      notEmpty: {
        msg: 'productUrl cannot be empty'
      },
      isUrl:{
        msg: 'Invalid productUrl string'
      }
    }
  },
  category: {
    type: DataTypes.JSON,
  },
  tags: {
    type: DataTypes.JSON,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
}, {
  paranoid: true,
  freezeTableName: true,
  modelName: 'projects'
});
