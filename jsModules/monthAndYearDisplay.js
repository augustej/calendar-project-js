import { months, date } from "/jsModules/index.js"

export function MonthAndYearDisplay(){
    this.refresh = function refresh(){
        let monthAndYearDiv = document.querySelector(".month-year-container")
        monthAndYearDiv.innerHTML = ""
        let h2El = document.createElement('h2')
        h2El.appendChild(document.createTextNode(`${months[date.month]} ${date.year}`))
        monthAndYearDiv.appendChild(h2El)
    }
    this.refresh()
}