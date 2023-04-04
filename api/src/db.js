require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_URI
} = process.env;

const db = new Sequelize(DB_URI, {
    define: {
        timestamps: false
    }
});
// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/bebidas`, {
//     logging: false, // set to console.log to see the raw SQL queries
//     native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        modelDefiners.push(require(path.join(__dirname, '/models', file)));
    });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Producto, Usuario, Orden, Carrito, Comprado, Favorito, Review ,Direcciones} = sequelize.models;

// Aca vendrian las relaciones
Orden.belongsTo(Usuario);

Orden.belongsTo(Carrito);

Orden.belongsToMany(Comprado, { through: 'Orden_Comprado' });

Comprado.belongsTo(Producto);

Carrito.belongsToMany(Producto, { through: 'Carrito_Producto' });

Carrito.belongsTo(Usuario);


Usuario.belongsToMany(Producto, { through: Favorito });


Usuario.hasMany(Comprado)
Comprado.belongsTo(Usuario)

Usuario.hasMany(Review);
Review.belongsTo(Usuario);

Producto.hasMany(Review);
Review.belongsTo(Producto);

Usuario.hasMany(Direcciones);
Direcciones.belongsTo(Usuario);



// Product.hasMany(Reviews);


module.exports = {
    ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
    conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};