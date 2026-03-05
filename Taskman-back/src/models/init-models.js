var DataTypes = require("sequelize").DataTypes;
var _annonces = require("./annonces");
var _conversations = require("./conversations");
var _favoris = require("./favoris");
var _messages = require("./messages");
var _users = require("./users");

function initModels(sequelize) {
  var annonces = _annonces(sequelize, DataTypes);
  var conversations = _conversations(sequelize, DataTypes);
  var favoris = _favoris(sequelize, DataTypes);
  var messages = _messages(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  annonces.belongsToMany(users, { as: 'id_user_users', through: favoris, foreignKey: "id_annonce", otherKey: "id_user" });
  users.belongsToMany(annonces, { as: 'id_annonce_annonces', through: favoris, foreignKey: "id_user", otherKey: "id_annonce" });
  conversations.belongsTo(annonces, { as: "id_annonce_annonce", foreignKey: "id_annonce"});
  annonces.hasMany(conversations, { as: "conversations", foreignKey: "id_annonce"});
  favoris.belongsTo(annonces, { as: "id_annonce_annonce", foreignKey: "id_annonce"});
  annonces.hasMany(favoris, { as: "favoris", foreignKey: "id_annonce"});
  messages.belongsTo(conversations, { as: "id_conversation_conversation", foreignKey: "id_conversation"});
  conversations.hasMany(messages, { as: "messages", foreignKey: "id_conversation"});
  annonces.belongsTo(users, { as: "id_creator_user", foreignKey: "id_creator"});
  users.hasMany(annonces, { as: "annonces", foreignKey: "id_creator"});
  conversations.belongsTo(users, { as: "id_user1_user", foreignKey: "id_user1"});
  users.hasMany(conversations, { as: "conversations", foreignKey: "id_user1"});
  conversations.belongsTo(users, { as: "id_user2_user", foreignKey: "id_user2"});
  users.hasMany(conversations, { as: "id_user2_conversations", foreignKey: "id_user2"});
  favoris.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(favoris, { as: "favoris", foreignKey: "id_user"});
  messages.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(messages, { as: "messages", foreignKey: "id_user"});

  return {
    annonces,
    conversations,
    favoris,
    messages,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
