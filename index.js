const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let date = new CurrentDate();
let newCalendar = buildCalendarTemplate()
let addNote = new AddNote()
let todaysNotes = new TodaysNotes()
let nextMonth = new ChangeMonthBtn('next')
let prevMonth = new ChangeMonthBtn('prev')
let displayMonthAndYear = new MonthAndYearDisplay()
let todayBtn = new TodayBtn()
let weekNames = window.innerWidth > 600 ? new Weeknames('desktop') : new Weeknames('mobile')
weekNames.addToDom()

async function importDataService(){
    let DataServiceModule = await import("./dataService.js")
    return DataServiceModule
}

function CurrentDate(){
    const d = new Date();
    this.day = d.getDate();
    this.month = d.getMonth();
    this.year = d.getFullYear();
    this.buildFormatedId = function buildFormatedId(){
        return `${this.year}-${(this.month+1).toLocaleString('en-US', {minimumIntegerDigits: 2 })}-${this.day}`
    }
    this.setToday = function setToday(){
        this.day = d.getDate();
        this.month = d.getMonth();
        this.year = d.getFullYear();
    }
}

function buildCalendarTemplate(){
    let calendarType = getCalendarTypeFromHref();
    let calendarContainer = document.querySelector(`.calendar--container-${calendarType}`);
    calendarContainer.addEventListener('click', (event) => changeCurrentDate(event))

    buildCalendarInDom()
    highlightActiveDay()

    // if clicked on calendar day 
    function changeCurrentDate(event){
        // update date object created by CurrentDate
        [type, newYear, newMonth, newDay] = event.target.closest('div').id.split("-")
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
            DayField(calendarType, date, parentElement)
            // add weeknames to the first week
        })
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

function Weeknames(weeknamesStyle){
    // display weeknames
    this.currentWeeknamesArray = weeknamesStyle;
    this.addToDom = function addToDom(){
        let modifiedWeekdayArray = getModifiedWeekdaysArray(this.currentWeeknamesArray)
        let weekdayElement = document.querySelector(".weekday-names")
        modifiedWeekdayArray.forEach(weekday=>{
            let newEl = document.createElement("p")
            newEl.appendChild(document.createTextNode(weekday))
            weekdayElement.appendChild(newEl)
        })
    }

    function getModifiedWeekdaysArray(currentWeeknamesArray){
        let modifiedWeekdayArray = weekdays.map((name)=> { 
            let returnValue = currentWeeknamesArray === 'desktop' ? name.substring(0,3) : name.substring(0,1)
            return returnValue
        })
        let sunday = modifiedWeekdayArray.splice(0,1)[0]
        modifiedWeekdayArray.push(sunday)
        return modifiedWeekdayArray
    }
}

function AddNote(){

    this.noteType = getCalendarTypeFromHref();

    this.closeModal = function closeModal(){
        document.querySelector(".modal").remove()
    }
    this.saveNote = function saveNote(){
        let noteTextarea = document.querySelector(".inner-modal > textarea")
        let dayId = `${this.noteType}-${date.buildFormatedId()}`

        if (noteTextarea.value){
            importDataService().then((module)=> module.DataService('CREATE', dayId, noteTextarea.value))
        }
        document.querySelector(".modal").remove()
        refreshDayInDom(dayId)
    }

    let calendarContainer = document.querySelector(`.calendar--container-${this.noteType}`)
    buildAddNewNoteBtnInDom(this.noteType)

    function buildAddNewNoteBtnInDom(noteType){
        let outerDiv = document.createElement("div")
        outerDiv.setAttribute("class", "add-note-btn-outer-div")
        let newAddNoteBtn = document.createElement("button")
        newAddNoteBtn.setAttribute("class", `${noteType}-add-note-btn`)
        newAddNoteBtn.appendChild(document.createTextNode('Add new note'))
        outerDiv.appendChild(newAddNoteBtn)
        calendarContainer.after(outerDiv)
    
        newAddNoteBtn.addEventListener('click', event =>{
            createNewNoteModal(noteType)
        })
    }

    function createNewNoteModal(noteType){
        // display modal in DOM
        let modal = document.createElement("div")
        let innerModal = document.createElement("div")
        innerModal.setAttribute("class", "inner-modal")

        modal.setAttribute("class", "modal")

        let titleElement = document.createElement("p")
        titleElement.appendChild(document.createTextNode(`${date.buildFormatedId()} ${noteType}`))
        titleElement.setAttribute("class", "note-title")

        let noteElement = document.createElement("textarea")
        noteElement.setAttribute("placeholder", "add your note")

        let closeModalBtn = document.createElement("button")
        closeModalBtn.setAttribute("type", "button")
        closeModalBtn.setAttribute("class", "close-modal-btn")
        closeModalBtn.appendChild(document.createTextNode("X"))
        closeModalBtn.setAttribute("onclick", "addNote.closeModal()")

        let saveNoteBtn = document.createElement("button")
        saveNoteBtn.setAttribute("type", "button")
        saveNoteBtn.setAttribute("onclick", "addNote.saveNote()")
        saveNoteBtn.appendChild(document.createTextNode("Save"))

        innerModal.appendChild(titleElement)
        innerModal.appendChild(noteElement)
        innerModal.appendChild(closeModalBtn)
        innerModal.appendChild(saveNoteBtn)
        modal.appendChild(innerModal)

        let bodyElement = document.querySelector('body')
        bodyElement.appendChild(modal)
    }
}

function DayField(calendarType, date, parentElement){
    this.id = `${calendarType}-${date}`
    
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
        
        newDayField.setAttribute("id", this.id)
        newDayField.appendChild(dayTextPElement)
        parentElement.appendChild(newDayField)

        // add notes from local storage if any
        importDataService().then( (module) => {
            let notesArray = module.DataService('READ', newDayField.id)
            if (notesArray){showNotes(notesArray)}
        })

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

function TodaysNotes(){

    this.refresh = function refresh(){
        let parent = document.querySelector(`.todays-notes--container-${getCalendarTypeFromHref()}`)
        parent.innerHTML = ""
        importDataService().then( (module) =>{
            let todaysNotesArray = module.DataService('READ', `${getCalendarTypeFromHref()}-${date.buildFormatedId()}`)
            if (todaysNotesArray){
                todaysNotesArray.forEach((note)=>{
                    parent.appendChild(createNoteElement(note, parent))
                })
            }
        })        
    }
    this.refresh()
}

function ChangeMonthBtn(type){
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

function TodayBtn(){
    let todayBtn = document.querySelector(".today-btn")
    todayBtn.addEventListener("click", e =>{
        date.setToday()
        buildCalendarTemplate()
        displayMonthAndYear.refresh()
    })
}

function MonthAndYearDisplay(){
    this.refresh = function refresh(){
        let monthAndYearDiv = document.querySelector(".month-year-container")
        monthAndYearDiv.innerHTML = ""
        let h2El = document.createElement('h2')
        h2El.appendChild(document.createTextNode(`${months[date.month]} ${date.year}`))
        monthAndYearDiv.appendChild(h2El)
    }
    this.refresh()
}

function deleteNote(event){
    let idToDelete = event.target.parentElement.getAttribute("id")
    let dayId = `${getCalendarTypeFromHref()}-${date.buildFormatedId()}`
    importDataService().then( (module) =>{
        module.DataService('DELETE', dayId, "", idToDelete)
    })
    refreshDayInDom(dayId)
}

function createNoteElement(note, parentElement){
    let noteId = Object.keys(note)[0]
    let noteText = note[noteId]
    let pElement = document.createElement("p")
    let deleteElement = document.createElement("button")
    deleteElement.appendChild(document.createTextNode("X"))
    deleteElement.setAttribute("class", "delete-note")
    deleteElement.setAttribute("type", "button")
    deleteElement.setAttribute("onclick", "deleteNote(event)")

    pElement.appendChild(deleteElement)
    pElement.setAttribute("id", noteId)
    pElement.setAttribute("class", "note")
    let textElement = document.createTextNode(noteText)
    pElement.appendChild(textElement)
    parentElement.appendChild( pElement)
    return pElement
}

function getCalendarTypeFromHref(){
    return window.location.href.split("/").pop().split(".")[0]
}

function refreshDayInDom(dayId){
    let calendarField = document.querySelector(`#${dayId}`)

    // delete all notes before refreshing notes in day field
    let alreadyDisplayedNotes = calendarField.querySelectorAll(".note")
    alreadyDisplayedNotes.forEach(note =>{
        note.remove()
    })

    // refreshing notes in day field
    importDataService().then( (module) =>{
        let notesArray = module.DataService('READ', dayId)
        if (notesArray){
            notesArray.forEach((note)=>{
                calendarField.appendChild(createNoteElement(note, calendarField))
            })
        }
    })

    // refresh todays notes
    todaysNotes.refresh()
}