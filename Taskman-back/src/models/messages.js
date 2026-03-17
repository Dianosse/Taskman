const { DataTypes } = require("sequelize")
const db = require('../config/database')

const Messages = db.define('messages', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_conversation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'conversations',
      key: 'id'
    }
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  db,
  tableName: 'messages',
  schema: 'public',
  timestamps: true,
  indexes: [
    {
      name: "pk_messages",
      unique: true,
      fields: [
        { name: "id" },
      ]
    },
  ]
});

module.exports = Messages
