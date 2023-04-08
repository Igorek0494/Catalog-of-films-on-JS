// Настройки
const apiKey = 'b3357f5a-6044-4ddb-81b0-766064fc37c1';
const url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const options = {
    method: 'GET',
    headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
    },
}

// DOM-элементы
const filmsWrapper = document.querySelector('.films');
const loader = document.querySelector('.loader-wrapper');
const btnLoadMore = document.querySelector('.show-more');
btnLoadMore.onclick = fetchAndRenderFilms;

// Получение и вывод фильмов
async function fetchData(url, options) {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

function renderFilms(films) {
    for (film of films) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = film.filmId;
        card.onclick = openFilmDetails;

        const html = ` <img src=${film.posterUrlPreview} alt="Обливион" class="card__img" />
        <h3 class="card__title">${film.nameRu}</h3>
        <p class="card__year">${film.year}</p>
        <p class="card__rate">Рейтинг: ${film.rating}</p>`

        card.insertAdjacentHTML('afterbegin', html);
        filmsWrapper.insertAdjacentElement('beforeend', card);
    }
}

async function openFilmDetails(e) {
    console.log('FUNCTION RUNNING!!!');
    const id = e.currentTarget.id
    const data = await fetchData(url + id, options);

    renderFilmData(data);
}

function renderFilmData(film) {
    console.log('RENDER FILM!!!');

    const containerRight = document.createElement('div');
    containerRight.classList.add('container-right');
    document.body.insertAdjacentElement('beforeend', containerRight);

    const btnClose = document.createElement('button');
    btnClose.classList.add('btn-close');
    btnClose.innerHTML = ` <img src="./img/close.svg" alt="Close" width="24" />`;
    containerRight.insertAdjacentElement('afterbegin', btnClose);

    btnClose.onclick = () => { containerRight.remove() };

    const html = `<div class="film">
    <div class="film__title">${film.nameRu}</div>
    <div class="film__img">
      <img src=${film.posterUrl} alt=${film.nameRu} />
    </div>
    <div class="film__desc">
      <p class="film__details">Год: ${film.year}</p>
      <p class="film__details">Рейтинг: ${film.ratingKinopoisk}</p>
      <p class="film__details">Продолжительность: ${film.filmLength}</p>
      <p class="film__details">Страна: ${film.countries[0]['country']}</p>
      <p class="film__text">${film.description}</p>
    </div>
  </div>`;

    containerRight.insertAdjacentHTML('beforeend', html);
}

let page = 1;

async function fetchAndRenderFilms() {
    // Показываем лоадер
    loader.classList.remove('none');

    const data = await fetchData(url + `top?page=${page}`, options);
    if (data.pagesCount > 1) {
        page++
        btnLoadMore.classList.remove('none');
    }

    // Удаляем лоадер
    loader.classList.add('none');

    renderFilms(data.films);
    if (page > data.pagesCount) {
        btnLoadMore.classList.add('none');
    }
}

fetchAndRenderFilms().catch(err => console.log(err))
