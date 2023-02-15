import { date, months , getCalendarTypeFromHref, createNoteElement, todaysNotes, displayMonthAndYear} from "./index.js"
import { DataService } from "./dataService.js"

function buildCalendarTemplate(){
    let calendarType = getCalendarTypeFromHref();
    let calendarContainer = document.querySelector(`.calendar--container-${calendarType}`);
    calendarContainer.addEventListener('click', (event) => changeCurrentDate(event))

    buildCalendarInDom()
    highlightActiveDay()

    // if clicked on calendar day 
    function changeCurrentDate(event){
        // update date object created by CurrentDate
        let [type, newYear, newMonth, newDay] = event.target.closest('div').id.split("-")
        let newMonthArrayValue = parseInt(newMonth) - 1
        date.day = newDay
        date.year = newYear
        // if clicked on day of other month -> display other month as current
        if (date.month !== newMonthArrayValue){
            date.month = newMonthArrayValue 
            buildCalendarInDom()
        }
        // change active day
        highlightActiveDay()
        // update notes
        todaysNotes.refresh()
        // update month/year title on top
        displayMonthAndYear.refresh()
    }

    function highlightActiveDay(){

        // remove highlight from previous day
        let previousActiveDay = document.querySelector(`.active-day`)
        if (previousActiveDay) {previousActiveDay.classList.remove("active-day")}

        // get current url to determine calendar type
        let dayId = `${getCalendarTypeFromHref()}-${date.buildFormatedId()}`
        let activeDateField = document.querySelector(`#${dayId}`)
        activeDateField.setAttribute("class", "active-day")
    }

    function buildCalendarInDom(){
        // refresh localStorage before displaying calendar
        localStorage.removeItem("current-month-day")

        let daysArrayToRepresent = getArrayOfDaysToDisplay(date.month, date.year);
        calendarContainer.innerHTML = ""

        daysArrayToRepresent.forEach((date, index) =>{
            // create weeks
            if (index % 7 === 0 || index === 0){
                let parentElement = document.createElement("div")
                parentElement.setAttribute("class", "week--container")
                calendarContainer.appendChild(parentElement)
            }
            // select last created week to add a day
            let parentElement = document.querySelector(".week--container:last-child")
            buildDayField(calendarType, date, parentElement)
            // add weeknames to the first week
        })

        function buildDayField(calendarType, date, parentElement){
            let id = `${calendarType}-${date}`
            
            let newDayField = document.createElement("div");
            buildDayFieldInDom()
        
            function buildDayFieldInDom(){
        
                let dayNr = date.split("-")[2];
        
                if (dayNr === '1'){
                    // add/remove current-month class to days of this month
                    let className = setCurrentMonthInLocalStorage()
                    // display month name for the first day
                    showMonth(`${className} month-name`)
                }
        
                let dayTextPElement = document.createElement("p")
                dayTextPElement.appendChild(document.createTextNode(dayNr))
        
                // add current-month class to days of this month
                let currentMonthClass = localStorage.getItem("current-month-day")
                dayTextPElement.setAttribute("class", `${currentMonthClass? currentMonthClass : ""} day-nr`)
                newDayField.setAttribute("id", id)
                newDayField.appendChild(dayTextPElement)
                parentElement.appendChild(newDayField)
        
                // add notes from local storage if any
                let notesArray = DataService('READ', newDayField.id)
                if (notesArray){showNotes(notesArray)}
        
                function setCurrentMonthInLocalStorage(){
                    if (!localStorage.getItem("current-month-day")){
                        localStorage.setItem("current-month-day", "current-month-day")
                        return "current-month-day"
                    }
                    else{
                        localStorage.removeItem("current-month-day")
                        return ""
                    }
                }
            }
        
            function showNotes(notesArray){
                notesArray.forEach((note)=>{
                    newDayField.appendChild( createNoteElement(note, newDayField))
                })
            }
        
            function showMonth(classToAdd){
                let monthText = document.createTextNode(months[(parseInt(date.split("-")[1]) - 1)].slice(0,3))
                let monthTextPElement = document.createElement("p")
                monthTextPElement.setAttribute("class", classToAdd)
                monthTextPElement.appendChild(monthText)
                newDayField.insertBefore(monthTextPElement, newDayField.firstChild)
            }
        }
    }

    function getArrayOfDaysToDisplay(month, year){

        let daysArrayToRepresent = []

        let daysInMonth = new Date(year, (month + 1), 0).getDate()
        let weekdayOfFirstDay = new Date(`${year}-${month+1}-01`).getDay()
        let weekdayOfLastDay = new Date(`${year}-${month+1}-${daysInMonth}`).getDay()

        // get number of days in previous month which needs to be displayed
        let previousMonth = month !== 0 ? (month - 1) : 11
        let yearOfPreviousMonth = previousMonth !== 11 ? year : (year - 1)
        let daysInPreviousMonth = new Date(yearOfPreviousMonth, (previousMonth + 1), 0).getDate()
        let nrOfPreviousMonthDays = weekdayOfFirstDay === 0 ? 6 : weekdayOfFirstDay - 1;
        
        // get number of days in next month which needs to be displayed
        let nextMonth = month !== 11 ? (month + 1) : 0
        let yearOfNextMonth = nextMonth !== 0 ? year : (year + 1)
        let nrOfNextMonthDays = weekdayOfLastDay === 0 ? 0 : (7 - weekdayOfLastDay);


        // add days of the previous month
        for (let i = 0; i < nrOfPreviousMonthDays; i++){
            let newDay = `${yearOfPreviousMonth}-${
                                (previousMonth + 1).toLocaleString('en-US', {minimumIntegerDigits: 2 })
                            }-${daysInPreviousMonth-nrOfPreviousMonthDays+i+1}`
            daysArrayToRepresent.push(newDay)
        }

        // add days of current month
        for (let i = 0; i < daysInMonth; i++){
            let newDay = `${year}-${
                                (month + 1).toLocaleString('en-US', {minimumIntegerDigits: 2})
                            }-${(i+1)
                        }`
            daysArrayToRepresent.push(newDay)
        }

        // add days of next month
        for (let i = 0; i < nrOfNextMonthDays; i++){
            let newDay = `${yearOfNextMonth}-${
                                (nextMonth + 1).toLocaleString('en-US', {minimumIntegerDigits: 2 })
                            }-${(i+1)}`
            daysArrayToRepresent.push(newDay)
        }

        return daysArrayToRepresent
    }
}

export { buildCalendarTemplate }