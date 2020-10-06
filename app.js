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

app.get('/more-about-breed', (req, res) => {
    res.sendFile('public/HTML/breed.html', { root: __dirname })
})


app.get('/home-content', async (req, res) => {
    try {
        let allBreeds = await axios.get('/breeds');
        allBreeds = allBreeds.data;
        let response = [];
        let counter = 0;
        let result = null;

        while (counter < 5) {
            result = await axios.get('/images/search', { breed_ids: allBreeds[counter]["id"] })

            response.push(
                {
                    id: allBreeds[counter]["id"],
                    name: allBreeds[counter]["name"],
                    img_url: result.data['0']['url']
                }
            )
            counter++;
            if (counter == 5) {
                res.send(response)
                break
            }
        }
    } catch (e) {
        console.log(e)
    }
})

app.get('/search-breeds/:breed', async (req, res) => {
    try {
        searchBreed = req.params.breed.toLowerCase();
        let possibleBreeds = await axios.get('/breeds/search?q=' + searchBreed)
        possibleBreeds = possibleBreeds.data;

        for(let i = 0; i < possibleBreeds.length; i++){
            possibleBreeds[i] = {
                id: possibleBreeds[i].id,
                name: possibleBreeds[i].name,
            }
        }
        res.send(possibleBreeds)
    } catch (e) {
        console.log(e.message);
    }

})

app.get('/specific-breed/:breed-id', async (req, res) => {
    try {
        const speficBreed = axios.get(`/images/search?breed_ids=${req.params['breed-id']}`);
        speficBreed = speficbreed[0];

        res.send(speficBreed);
    } catch (e) {
        console.log(e.message)
    }
})
app.listen(PORT, () => {
    console.log('Server running at the port: ' + PORT)
})

// Api Key: 