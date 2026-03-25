const API_KEY = "d2c069361eb58ac9b3fcfaeb997a0105";

function showFilters(){
document.getElementById("filters").classList.remove("hidden")
}

// 🔥 Safe TMDB poster fetch
async function getPoster(title){
try{
let url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
let res = await fetch(url)
let data = await res.json()

if(data.results && data.results.length){
let item = data.results.find(i => i.poster_path)
if(item){
return "https://image.tmdb.org/t/p/w500" + item.poster_path
}
}
}catch(e){
console.log("Poster error:", e)
}

// fallback (VERY IMPORTANT)
return "https://via.placeholder.com/300x450?text=" + encodeURIComponent(title)
}

async function findSuggestion(){

const response = await fetch("data.json")
const data = await response.json()

const type = document.getElementById("type").value
const genre = document.getElementById("genre").value
const language = document.getElementById("language").value
const mood = document.getElementById("mood").value

let results = data.filter(item => {

let match =
(!type || item.type === type) &&
(!genre || item.genre === genre) &&
(!language || item.language === language)

// ✅ mood filter (safe)
if(mood){
match = match && item.mood && item.mood.some(m => 
m.toLowerCase().includes(mood.toLowerCase()) || 
mood.toLowerCase().includes(m.toLowerCase())
)
}

return match
})

// random 6
results = results.sort(() => 0.5 - Math.random()).slice(0,6)

document.getElementById("results-title").innerText = "Your Picks 🍿"

let html=""

// 🔥 SAFE LOOP (main fix)
for(const movie of results){

let poster;
try{
poster = await getPoster(movie.title)
}catch{
poster = "https://via.placeholder.com/300x450?text=" + encodeURIComponent(movie.title)
}

html += `
<div class="movie-card">
<img src="${poster}">
<div class="movie-info">
<div class="movie-title">${movie.title}</div>
<div class="movie-meta">
${movie.genre} • ${movie.duration}<br>
${movie.language}<br>
Watch on: ${movie.platform}
</div>
</div>
</div>
`
}

// ✅ empty state (IMPORTANT)
if(!html){
html = `<p style="color:#aaa;">😕 No matches found. Try different filters.</p>`
}

document.getElementById("results").innerHTML = html
}

// 🎲 Surprise Me
async function randomPicks(){

const response = await fetch("data.json")
const data = await response.json()

let results = data.sort(() => 0.5 - Math.random()).slice(0,6)

document.getElementById("results-title").innerText = "Surprise Picks 🎲"

let html=""

for(const movie of results){

let poster;
try{
poster = await getPoster(movie.title)
}catch{
poster = "https://via.placeholder.com/300x450?text=" + encodeURIComponent(movie.title)
}

html += `
<div class="movie-card">
<img src="${poster}">
<div class="movie-info">
<div class="movie-title">${movie.title}</div>
<div class="movie-meta">
${movie.genre} • ${movie.duration}<br>
${movie.language}<br>
Watch on: ${movie.platform}
</div>
</div>
</div>
`
}

document.getElementById("results").innerHTML = html
}