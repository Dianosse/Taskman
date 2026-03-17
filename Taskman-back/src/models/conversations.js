const { DataTypes } = require("sequelize")
const db = require('../config/database')

const Conversations = db.define('conversations', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_annonce: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'annonces',
      key: 'id'
    },
    unique: "uq_conv"
  },
  id_user1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    unique: "uq_conv"
  },
  id_user2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    unique: "uq_conv"
  }
}, {
  sequelize,
  tableName: 'conversations',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "pk_conversations",
      unique: true,
      fields: [
        { name: "id" },
      ]
    },
    {
      name: "uq_conv",
      unique: true,
      fields: [
        { name: "id_annonce" },
        { name: "id_user1" },
        { name: "id_user2" },
      ]
    },
  ]
});

module.exports = Conversations;