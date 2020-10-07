const { raw } = require('express');
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
const axios = require('axios');
const API_KEY = 'APIKEY';
const API_URL = 'https://api.thecatapi.com/v1';
const mongoose = require('mongoose');
const DBURI = 'mongodb+srv://<username>:<password>@cluster0.dfuhn.mongodb.net/<db>?retryWrites=true&w=majority';
const Cat = require('./models/cat')

mongoose.connect(DBURI, () => {
    app.listen(PORT, () => {
        console.log('Server running at port: ' + PORT)
    })
})


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

app.get('/top-cat-board', (req, res) => {
    res.sendFile('public/HTML/top-cat.html', { root: __dirname })
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

        for (let i = 0; i < possibleBreeds.length; i++) {
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

app.get('/specific-breed/:breed', async (req, res) => {
    try {
        const response = await Cat.findOne({ breed: req.params.breed });

        if (response == null) {
            const newCat = new Cat({
                breed: req.params.breed,
                votes: 1,
            });

            newCat.save((error) => {
                if (error) {
                    console.log(error.message);
                    return
                }
                console.log('saved')
            })
        } else {
            await Cat.findOneAndUpdate({ breed: req.params.breed }, { votes: response.votes + 1 })
        }

        let speficBreed = await axios.get(`/images/search?breed_ids=${req.params['breed']}`);
        speficBreed = speficBreed.data[0];

        res.send(speficBreed);
    } catch (e) {
        console.log(e.message)
    }
})

app.get('/breed-imgs/:breed', async (req, res) => {
    try {
        let breedsImg = await axios.get(`/images/search?breed_ids=${req.params['breed']}&limit=8`);
        breedsImg = breedsImg.data;

        for (let i = 0; i < breedsImg.length; i++) {
            breedsImg[i] = breedsImg[i].url
        }

        res.send(breedsImg);
    } catch (e) {
        console.log(e)
    }
})
app.get('/more-voted', async (req, res) => {
    try {
        const response = await Cat.find().sort({ votes: -1 });
        let aux = []

        for(let i = 0; i < response.length && i < 10; i++){
            aux.push(response[i])
        }
        
        res.send(aux);
    } catch (e) {
        console.log(e.message)
    }
})
// Api Key: