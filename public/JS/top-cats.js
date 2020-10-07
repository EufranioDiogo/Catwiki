async function startTopCats(){
    const response = await fetch('/more-voted');
    const data = await response.json();
    let auxResponse = null;
    let auxData = null;

    for(let i = 0; i < data.length; i++){
        auxResponse = await fetch('/specific-breed/' + data[i].breed);
        auxData = await auxResponse.json();

        app.cats.push(auxData)
    }
    console.log(data)
}

let app = new Vue({
    el: '.main-container',
    data: {
        cats: []
    },
    methods: {
        moreabout(id){
            window.location.assign('/more-about-breed?id=' + id)
        }
    }
})
startTopCats()