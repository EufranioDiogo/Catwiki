const { raw } = require('express');
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
const axios = require('axios');
const mongoose = require('mongoose');
const dbURL = ''
const API_KEY = '152ead9a-93db-4284-8bce-994a390b11d2';
const API_URL = 'https://api.thecatapi.com/v1';




axios.defaults.headers.common['x-api-key'] = API_KEY;
axios.defaults.baseURL = API_URL;



app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded())
app.use(express.json())

app.get('/', async (req, res) => {
    res.sendFile('public/index.html', { root: __dirname })
})

app.get('/home-content', async(req, res) => {
    try {
        let allBreeds = await axios.get('/breeds');
        allBreeds = allBreeds.data;
        let response = [];
        let counter = 0

        for (let i = 0; i < 5; i++){
            axios.get('/images/search', { breed_ids: allBreeds[i]["id"] }).then(result => {
                response.push(
                    {
                        id: allBreeds[i]["id"],
                        name: allBreeds[i]["name"],
                        find: result.data['0']['url']
                    }
                )
                counter += 1;
                if (counter == 5){
                    res.send(response)
                }
            })
        }
    } catch (e) {
        console.log(e)
    }
})

app.get('/search-breeds/:breed', async (req, res) => {
    try {
        const possibleBreeds = await axios.get('/search', { q : req.params.breed });

        possibleBreeds.map(breed => {
            return {
                id: breed.id,
                name: breed.name,
            }
        })
    } catch (e) {
        console.log(e.message)
    }

})


app.listen(PORT, () => {
    console.log('Server running at the port: ' + PORT)
})

// Api Key: 