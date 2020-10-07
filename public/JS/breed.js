const catId = window.location.href.split('?')[1].split('=')[1];

async function getCatInfo(id){
    const response = await fetch('/specific-breed/' + catId);
    const data = await response.json();

    app.cat = data.breeds[0];
    app.catImg = data.url;
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