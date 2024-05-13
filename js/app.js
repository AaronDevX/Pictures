const form = document.querySelector("#form");
const search = document.querySelector("#termino");
const results = document.querySelector("#results");
const paginacion = document.querySelector("#paginacion");
const picturesPage = 40;
let totalPages;
let actualPage = 1;

document.addEventListener("DOMContentLoaded", startApp)

function startApp(){
    form.addEventListener("submit", validateForm)
}

function validateForm(e){
    e.preventDefault();
    cleanHtml(results);

    if(search.value == ""){
        const emptyMessage = document.createElement("P");
        emptyMessage.textContent = "Ingresa una Palabra";
        results.appendChild(emptyMessage)
        return;
    }
    getApi()
}

function cleanHtml(element){
    while(element.hasChildNodes()){
        element.firstChild.remove()
    }
}

function showPages(totalHits){
    return Math.ceil(totalHits/picturesPage)
}

function getApi(){
    const searchValue = document.querySelector("#termino").value;

    const apiKey = "43822489-e2d03f7f85283372c2c69cdb2";
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchValue}&image_type=photo&per_page=${picturesPage}&page=${actualPage}`
    
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPages = showPages(resultado.totalHits);
            displayPictures(resultado.hits);
        })
}

function displayPictures(pictures){
    cleanHtml(results)
    pictures.forEach(picture => {
        const {likes, previewURL, views} = picture;
        const cardPic = document.createElement("DIV");
        const cardPicImg = document.createElement("IMG")
        const cardPicData = document.createElement("DIV")
        const cardPicLikes = document.createElement("DIV");
        const cardPicLikesSpan = document.createElement("SPAN");
        const cardPicLikesText = document.createElement("P");
        const cardPicViews = document.createElement("DIV");
        const cardPicViewsSpan = document.createElement("SPAN");
        const cardPicViewsText = document.createElement("P");
        const cardPicBtn = document.createElement("BUTTON");

        cardPicImg.src = previewURL;
        cardPicImg.classList.add("card-pic__img")
        cardPicLikesSpan.textContent = "Likes: ";
        cardPicLikesText.textContent = likes;
        cardPicViewsSpan.textContent = "Views: ";
        cardPicViewsText.textContent = views;

        cardPicLikesSpan.classList.add("card-pic__Span");
        cardPicViewsSpan.classList.add("card-pic__Span");
        cardPicLikes.classList.add("flex");
        cardPicViews.classList.add("flex");
        cardPicData.classList.add("card-pic__data");
        cardPicBtn.textContent = "View Picture";
        cardPicBtn.classList.add("card-pic__btn");

        cardPic.appendChild(cardPicImg);
        cardPicLikes.appendChild(cardPicLikesSpan);
        cardPicLikes.appendChild(cardPicLikesText);
        cardPicViews.appendChild(cardPicViewsSpan);
        cardPicViews.appendChild(cardPicViewsText);
        cardPicData.appendChild(cardPicLikes);
        cardPicData.appendChild(cardPicViews);
        cardPic.appendChild(cardPicData);
        cardPic.appendChild(cardPicBtn);
        results.appendChild(cardPic);
        cardPic.classList.add("card-pic");
    })

    cleanHtml(paginacion)
    displayPaginador()
}

function* Paginador(){
    for(let i = 1; i<=totalPages; i++){
        yield i;
    }
}

function displayPaginador(){
    const iterador = Paginador();
    
    while(true){
        const {value, done} = iterador.next();
        if(done) return;

        const pageBtn = document.createElement("BUTTON");
        pageBtn.href = "#";
        pageBtn.dataset.pagina = value;
        pageBtn.textContent = value;
        pageBtn.classList.add("page-btn");

        pageBtn.onclick = ()=>{
            actualPage = value;
            getApi()
        }
        paginacion.appendChild(pageBtn)
    }
}
