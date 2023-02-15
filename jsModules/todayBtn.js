import { buildCalendarTemplate } from "/jsModules/buildCalendarTemplate.js"
import { date, displayMonthAndYear} from "/jsModules/index.js"

export function TodayBtn(){
    let todayBtn = document.querySelector(".today-btn")
    todayBtn.addEventListener("click", e =>{
        date.setToday()
        buildCalendarTemplate()
        displayMonthAndYear.refresh()
    })
}