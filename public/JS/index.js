async function getHomePageCats() {
    await fetch('/home-content')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        app.randomCats = data
    })
}

let app = new Vue({
    el: '.main-container',
    data: {
        possibleBreeds: [],
        searchBreed: '',
        randomCats: [],
        search: true
    },
    methods: {
        async searchBreeds(){
            if(this.searchBreed){
                const response = await fetch(`/search-breeds/${this.searchBreed}`)
                const data = await response.json();

                this.possibleBreeds = data;
                this.search = false;
            } else {
                this.possibleBreeds = []
                this.search = true;
            }
        },
        cleanSearch(){
            document.querySelector('.search-result').value = '';
            this.searchBreed = '';
            this.search = true;
        },
        moreAbout(id){
            window.location.assign('/more-about-breed?id=' + id)
        }
    }
});




getHomePageCats();