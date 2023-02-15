import { date, getCalendarTypeFromHref, displayMonthAndYear, refreshDayInDom} from "./index.js"
import { buildCalendarTemplate } from "./buildCalendarTemplate.js"

export function ChangeMonthBtn(type){
    let btn = document.querySelector(`.${type}-month`)
    btn.addEventListener('click', event =>{
        date.day = 1
        if (type === 'prev'){
            if (date.month === 0){
                date.year = date.year-1
                date.month = 11
            }
            else {date.month -= 1} 
        }
        else{
            if (date.month === 11){
                date.year = date.year+1
                date.month = 0
            }
            else {date.month += 1} 
        }
        buildCalendarTemplate()
        refreshDayInDom(`${getCalendarTypeFromHref()}-${date.buildFormatedId()}`)
        displayMonthAndYear.refresh()
    })
}