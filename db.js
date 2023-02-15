const Sequelize = require('sequelize');
const connection = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_people_places_things');

const Person = connection.define('person', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

const Place = connection.define('place', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

const Thing = connection.define('thing', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

const Souvenir = connection.define('souvenir')

Souvenir.belongsTo(Person);
Souvenir.belongsTo(Place);
Souvenir.belongsTo(Thing);
Person.hasMany(Souvenir);
Place.hasMany(Souvenir);
Thing.hasMany(Souvenir);

const syncAndSeed = async() =>{
    await connection.sync({force: true});
    const data = {
        people: ['moe', 'larry', 'lucy', 'ethyl'],
        places: ['paris', 'nyc', 'chicago', 'london'],
        things: ['hat', 'bag', 'shirt', 'cup'],
    };

    const people = await Promise.all([
        data.people.map((peep) =>{
            Person.create({name: peep})
        })
    ])

    const places = await Promise.all([
        data.places.map((loc) =>{
            Place.create({name: loc})
        })
    ])

    const things = await Promise.all([
        data.things.map((stuff) =>{
            Thing.create({name: stuff})
        })
    ])

}

module.exports = {
    connection,
    Person,
    Place,
    Thing,
    Souvenir,
    syncAndSeed
}
