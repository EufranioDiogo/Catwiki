const catId = window.location.href.split('?')[1].split('=')[1];

async function getCatInfo(id){
    const response = await fetch('/specific-breed/' + catId);
    const breed = await response.json();

    app.cat = breed;
    app.catImg = breed.url;
}

async function getCatOtherPhotos(id){
    const response = await fetch('/breed-imgs/' + catId);
    const data = await response.json();

    app.otherCatImgs = data;
}

let app = new Vue({
    el: '.main-container',
    data: {
        cat: {},
        catImg: null,
        otherCatImgs: []
    }
});

getCatInfo(catId)
getCatOtherPhotos(catId)