const movieList = document.getElementById("movie_list")
const movieDiv = document.getElementById("movies")

const tvList = document.getElementById("tv_list")
const tvDiv = document.getElementById("tv")


const bookList = document.getElementById("book_list")
const bookDiv = document.getElementById("books")

const searchbar = document.getElementById("searchbar")

String.prototype.removeStart = function(ss) { 
    (this.startsWith(ss) ? this.substring(ss.length) : this)
}

const nameSort = (a, b) => {
    if(typeof a === 'string') return 1;
    if(typeof b === 'string') return 1;
    
    const aa = a.name.toLowerCase().removeStart("the ")
    const ba = b.name.toLowerCase().removeStart("the ")
    return (aa > ba) * 1 + (aa < ba) * -1
}

window.onload = () => {
    movies.sort(nameSort)
    tv.sort(nameSort)
    
    movies.forEach((m, i) => {
        if(typeof m !== 'string') {
            const elem = document.createElement("li")
            elem.classList.add("movie-item", "item")
            elem.dataset.name = m.name.toLowerCase()

            const tooltipDiv = document.createElement('div')
            tooltipDiv.className = 'tooltip'

            const elemName = document.createElement('span')
            elemName.textContent = m.name

            tooltipDiv.appendChild(elemName)
            if('watches' in m) {
                const tt = document.createElement('span')
                tt.className = 'tooltiptext'
                tt.textContent = `Watches: ${m.watches}`
                tooltipDiv.appendChild(tt)
                elem.classList.add("rewatched")
            } 

            elem.appendChild(tooltipDiv)
            movieList.appendChild(elem)
        } else {
            const periodDiv = document.createElement('div')
            const hr = document.createElement("hr")
            const header = document.createElement("h3")
            
            header.innerHTML = m
            
            if(i !== 0) {
                periodDiv.append(hr, header)
            } else {
                periodDiv.append(header)
            }
            periodDiv.classList.add('period_header')
            periodDiv.dataset.period = m
            movieList.append(periodDiv)
        }
    })
    
    tv.forEach(t => {
        const elem = document.createElement('li')
        elem.classList.add("tv_item", "item")
        elem.dataset.name = t.name.toLowerCase()

        const elemDiv = document.createElement('div')
        elemDiv.className = 'season-div'

        const elemName = document.createElement('span')
        elemName.textContent = t.name

        elemDiv.append(elemName)
        elemDiv.appendChild(document.createTextNode(" ["))
        

        for(let i = 1; i < t.seasons+1; i++) {
            const tooltipDiv = document.createElement('div')
            tooltipDiv.className = 'tooltip'

            const sn = document.createElement("span")
            sn.textContent = i

            if(!t.unwatched && !t.unfinished && !t.abandoned) sn.classList.add("watched")
            else if(t.unfinished == i || (Array.isArray(t.unfinished) && t.unfinished?.includes(i))) {
                sn.classList.add('unfinished')
            }
            else if(t.abandoned == i || (Array.isArray(t.abandoned) && t.abandoned?.includes(i))) {
                sn.classList.add('abandoned')
            } 
            else if(t.unwatched && ((Array.isArray(t.unwatched) && t.unwatched.includes(i)) || t.unwatched == i))  {
                sn.classList.add('unwatched')
            }
            else sn.classList.add('saw')

            tooltipDiv.appendChild(sn)
            if(i != t.seasons) tooltipDiv.appendChild(document.createTextNode("-"))
            if(t.watches && t.watches[i]) {
                const tt = document.createElement('span')
                tt.className = "tooltiptext"
                tt.textContent = `Watches: ${t.watches[i]}`
                tooltipDiv.appendChild(tt)
                sn.classList.add('rewatched')
            }
            elemDiv.appendChild(tooltipDiv)
            elem.appendChild(elemDiv)
        }
        elemDiv.appendChild(document.createTextNode("]"))
        tvList.appendChild(elem)
    })

    let currPeriod = ""
    books.reverse().forEach((b, i) => {
        if(typeof b != 'string') {
            const n = document.createElement("li")
            
            n.textContent = b.name 
            const sn = document.createElement("span")
            if(!('series' in b)) b['series'] = {'name':"", "book":""}
            else if(typeof b['series'] == "string") b['series'] = {'name':b['series'], "book":""}

            sn.textContent = (' [' + [
                b.author, 
                b.series?.name,
                b.series?.book
            ].filter(p => !!p).join(" | ") + ']')
            
            if(b.progress) 
                sn.textContent += ' ' + (
                    b.progress.chapter ? `@ Chapter ${b.progress.chapter}` : 
                    b.progress.page ? `@ Page ${b.progress.page}` :
                    b.progress.percent ? `@ ${b.progress.percent}%` : ''
                )


            n.appendChild(sn)
            n.setAttribute("data-name", b.name.toLowerCase() + " " + b.series['name'].toLowerCase() + " " + b.author.toLowerCase())
            n.classList.add("book_item", "item")
            
            if(b['progress']) n.classList.add('unfinished')

            n.dataset.period = currPeriod
            
            bookList.appendChild(n)
        } else {
            currPeriod = b
            const periodDiv = document.createElement('div')
            const hr = document.createElement("hr")
            const header = document.createElement("h3")
            
            header.textContent = b
            
            if(i !== 0) {
                periodDiv.append(hr, header)
            } else {
                periodDiv.append(header)
            }
            periodDiv.classList.add('period_header')
            periodDiv.dataset.period = b
            bookList.append(periodDiv)
        }
    })   

    tvDiv.style.display = "block"
    movieDiv.style.display = "none"
    bookDiv.style.display = "none"

}

function filterItems() {
    const items = document.getElementsByClassName("item")
    const headers = document.getElementsByClassName("period_header")
    const periods = {}
    
    if(searchbar.value === "") {
        Array.from(items).forEach(item => item.style.display = 'list-item')
        Array.from(headers).forEach(h => h.style.display = 'block')
    } else {
        for(let i = 0; i < items.length; i++) {
            if(!items[i].getAttribute("data-name").includes(searchbar.value.toLowerCase())) {
                items[i].style.display = "none"
            } else {
                items[i].style.display = "list-item"
                periods[items[i].dataset.period] = (periods[items[i].dataset.period] || 0) + 1
            }
        }

        Array.from(headers).forEach(h => h.style.display = (h.dataset.period in periods) ? 'block' : 'none')
    }
}

document.getElementById("movie_button").addEventListener("click", function() {
   if(movieDiv.style.display === "none") {
       movieDiv.style.display = "block"
       tvDiv.style.display = "none"
       bookDiv.style.display = "none"
   }
})

document.getElementById("tv_button").addEventListener("click", function() {
    if(tvDiv.style.display === "none") {
        tvDiv.style.display = "block"
        movieDiv.style.display = "none"
        bookDiv.style.display = "none"
    }
})

document.getElementById("book_button").addEventListener("click", function() {
    if(bookDiv.style.display === "none") {
        tvDiv.style.display = "none"
        movieDiv.style.display = "none"
        bookDiv.style.display = "block"
    }
})

searchbar.addEventListener("keyup", filterItems)