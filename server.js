const express = require('express');
const app = express();

const { connection, Person, Place, Thing, Souvenir, syncAndSeed } = require('./db');

app.use(express.urlencoded({extended: false}));

const port = process.env.PORT || 4400;

app.post('/', async(req, res, next) =>{

    try{
        if(req.body.personId === ''){
            req.body.personId = null;
        }
        if(req.body.placeId === ''){
            req.body.placeId = null;
        }
        if(req.body.thingId === ''){
            req.body.thingId = null;
        }

        await Souvenir.create({
            personId: req.body.personId,
            placeId: req.body.placeId,
            thingId: req.body.thingId
        })

        res.redirect('/');
    }
    catch(err){
        next(err);
    }
})

app.get('/', async(req, res, next) =>{
    try{
        const people = await Person.findAll({
            include: [ Souvenir ]
        });
        const places = await Place.findAll({
            include: [ Souvenir ]
        });
        const things = await Thing.findAll({
            include: [ Souvenir ]
        });

        const souvenirs = await Souvenir.findAll({
            include: [ Person, Place, Thing ]

        })
        console.log(souvenirs);

        res.send(`
            <html>
                <head>
                    <title>Acme People, Places and Things</title>
                </head>
                <body>
                    <h1>Acme People, Places and Things</h1>

                    <h2>People</h2>
                        <ul>
                            ${
                                people.map(person =>{
                                    return `
                                    <li>
                                    ${person.name}
                                    </li>
                                    `
                                }).join('')
                            }
                        </ul>

                    <h2>Places</h2>
                        <ul>
                            ${
                                places.map(place => {
                                    return `
                                    <li>
                                    ${place.name}
                                    </li>
                                    `
                                }).join('')
                            }
                        </ul>
                    
                    <h2>Things</h2>
                        <ul>
                            ${
                                things.map(thing => {
                                    return `
                                    <li>
                                        ${thing.name}
                                    </li>
                                    `
                                }).join('')
                            }
                        </ul>
                    
                    <h2>Souvenir Purchases</h2>
                    <p>Create a new Souvenir Purchase by selecting a Person, the Place they purchased the souvenir, and the Thing they bought.</p>
                        <form method='POST' action='/'>
                            Person 
                            <select name='personId'>
                                ${people.map(person => {
                                    return `
                                        <option value=${person.id}>${person.name}
                                        </option>
                                    `
                                    }).join('')
                                }
                            </select>
                            Place
                            <select name='placeId'>
                                ${places.map(place => {
                                    return `
                                        <option value="${place.id}">${place.name}</option>
                                    `
                                    }).join('')
                                }
                            </select>
                            Thing
                            <select name='thingId'>
                                ${things.map(thing => {
                                    return `
                                        <option value=${thing.id}>${thing.name}</option>
                                    `
                                    }).join('')
                                };
                            </select>
                            <button>Create</button>
                        </form>
                        <ul>
                                ${
                                    souvenirs.map(souvenir => {
                                        return `
                                        <li>
                                            ${souvenir.person.name} purchased ${souvenir.thing.name} in ${souvenir.place.name}
                                        </li>
                                        `
                                    }).join('')
                                }
                        </ul>
                </body>
            </html>
        `)
    }
    catch(err){
        next(err);
    }
})

app.listen(port, async() => {
    try{
    console.log(`listening on port ${port}`)
    syncAndSeed();
    }
    catch(err){
        console.log(err);
    }
})