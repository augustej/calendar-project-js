const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let date = new CurrentDate();
let newCalendar = buildCalendarTemplate()
let addNote = new AddNote()
let todaysNotes = new TodaysNotes()
let nextMonth = new ChangeMonthBtn('next')
let prevMonth = new ChangeMonthBtn('prev')

function getCalendarTypeFromHref(){
    return window.location.href.split("/").pop().split(".")[0]
}

function refreshDayInDom(dayId){
    let calendarField = document.querySelector(`#${dayId}`)

    // delete all notes before refreshing notes in day field
    let alreadyDisplayedNotes = calendarField.querySelectorAll(".note")
    if (alreadyDisplayedNotes){
        alreadyDisplayedNotes.forEach(note =>{
            note.remove()
        })
    }

    // refreshing notes in day field
    if (DataService('READ', dayId)){
        DataService('READ', dayId).forEach((note)=>{
            calendarField.appendChild(createNoteElement(note, calendarField))
        })
    }
    // refresh todays notes
    todaysNotes.refresh()
}

function buildCalendarTemplate(){

    let calendarType = getCalendarTypeFromHref();
    let calendarContainer = document.querySelector(`.calendar--container-${calendarType}`);
    calendarContainer.addEventListener('click', (event) => changeCurrentDate(event))

    buildCalendarInDom()
    highlightActiveDay()

    function changeCurrentDate(event){
        [type, newYear, newMonth, newDay] = event.target.closest('div').id.split("-")
        let newMonthArrayValue = parseInt(newMonth) - 1
        date.day = newDay
        date.year = newYear
        if (date.month !== newMonthArrayValue){
            date.month = newMonthArrayValue 
            buildCalendarInDom()
        }
        highlightActiveDay()
        todaysNotes.refresh()
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

    function getArrayOfDaysToDisplay(day, month, year){

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
    
    function buildCalendarInDom(){
        let daysArrayToRepresent = getArrayOfDaysToDisplay(date.day, date.month, date.year);
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
        })
    }
}

function AddNote(){

    this.noteType = getCalendarTypeFromHref();

    this.closeModal = function closeModal(){
        document.querySelector(".modal").remove()
    }
    this.saveNote = function saveNote(){
        let noteTextarea = document.querySelector(".modal > textarea")
        let dayId = `${this.noteType}-${date.buildFormatedId()}`

        if (noteTextarea.value){
            DataService('CREATE', dayId, noteTextarea.value)
        }
        document.querySelector(".modal").remove()
        refreshDayInDom(dayId)
    }

    let calendarContainer = document.querySelector(`.calendar--container-${this.noteType}`)
    buildAddNewNoteBtnInDom(this.noteType)

    function buildAddNewNoteBtnInDom(noteType){
        let newAddNoteBtn = document.createElement("button")
        newAddNoteBtn.setAttribute("class", `${noteType}-add-note-btn`)
        newAddNoteBtn.appendChild(document.createTextNode('Add note'))
        calendarContainer.after(newAddNoteBtn)
    
        newAddNoteBtn.addEventListener('click', event =>{
            createNewNoteModal(noteType)
        })
    }

    function createNewNoteModal(noteType){
        // display modal in DOM
        let modal = document.createElement("div")
        modal.setAttribute("class", "modal")

        let titleElement = document.createElement("p")
        titleElement.appendChild(document.createTextNode(`${date.buildFormatedId()} ${noteType}`))
        titleElement.setAttribute("class", "note-title")

        let noteElement = document.createElement("textarea")
        noteElement.setAttribute("placeholder", "add your note")

        let closeModalBtn = document.createElement("button")
        closeModalBtn.setAttribute("type", "button")
        closeModalBtn.appendChild(document.createTextNode("X"))
        closeModalBtn.setAttribute("onclick", "addNote.closeModal()")

        let saveNoteBtn = document.createElement("button")
        saveNoteBtn.setAttribute("type", "button")
        saveNoteBtn.setAttribute("onclick", "addNote.saveNote()")
        saveNoteBtn.appendChild(document.createTextNode("Save"))

        modal.appendChild(titleElement)
        modal.appendChild(noteElement)
        modal.appendChild(closeModalBtn)
        modal.appendChild(saveNoteBtn)

        let bodyElement = document.querySelector('body')
        bodyElement.appendChild(modal)
    }
}

function CurrentDate(){
    const d = new Date();
    this.day = d.getDate();
    this.month = d.getMonth();
    this.year = d.getFullYear();

    this.buildFormatedId = function buildFormatedId(){
        return `${this.year}-${(this.month+1).toLocaleString('en-US', {minimumIntegerDigits: 2 })}-${this.day}`
    }

    this.monthName = months[this.month]
    // this.activeDate = new Date(`${this.year}-${this.month+1}-${this.day}`).getDay()
    // this.weekday = weekdays[this.activeDate];
}

function DataService(method, dayId, body, idToDelete){

    let currentNotesArray = JSON.parse(localStorage.getItem(dayId))
    let response = []

    switch (method) {
        case 'CREATE':
            let noteId = createNoteId()
            let newNoteDict = {}
            newNoteDict[noteId] = body

            if (!currentNotesArray){
                let newArray = []
                newArray.push(newNoteDict)
                localStorage.setItem(dayId, JSON.stringify(newArray))
                break
            }
            currentNotesArray.push(newNoteDict)
            localStorage.setItem(dayId, JSON.stringify(currentNotesArray))
            break
        case 'READ':
            response = currentNotesArray
            break

        case 'DELETE':
            let modifiedArray = currentNotesArray.filter((noteObject) =>{
                if (Object.keys(noteObject)[0] !== idToDelete){
                    return true
                }
            })            
            modifiedArray.length === 0 ? modifiedArray = null : modifiedArray = modifiedArray
            localStorage.setItem(dayId, JSON.stringify(modifiedArray))
            break
    }
    return response

    function createNoteId(){
        let noteId = localStorage.getItem("noteId")
        if (!noteId){
            localStorage.setItem("noteId", 0)
            noteId = 0
        }
        else{        
            localStorage.setItem("noteId", (parseInt(noteId) + 1))
        }
        return noteId
    }
}

function DayField(calendarType, date, parentElement){
    
    this.id = `${calendarType}-${date}`
    
    let newDayField = document.createElement("div");
    buildDayFieldInDom()

    function buildDayFieldInDom(){

        let dayNr = date.split("-")[2];
        let dayTextPElement = document.createElement("p")
        dayTextPElement.appendChild(document.createTextNode(dayNr))
        newDayField.setAttribute("id", this.id)
        newDayField.appendChild(dayTextPElement)
        parentElement.appendChild(newDayField)

        // show month name on the first day of month
        if (dayNr === '1'){showMonth()}

        // add notes from local storage if any
        if (DataService('READ', newDayField.id)){showNotes()}

    }

    function showNotes(){
        DataService('READ', this.id).forEach((note)=>{
            newDayField.appendChild( createNoteElement(note, newDayField))
        })
    }

    function showMonth(){
        let monthText = document.createTextNode(months[(parseInt(date.split("-")[1]) - 1)].slice(0,3))
        let monthTextPElement = document.createElement("p")
        monthTextPElement.appendChild(monthText)
        newDayField.insertBefore(monthTextPElement, newDayField.firstChild)
    }
}

function deleteNote(event){
    let idToDelete = event.target.parentElement.getAttribute("id")
    let dayId = `${getCalendarTypeFromHref()}-${date.buildFormatedId()}`
    DataService('DELETE', dayId, "", idToDelete)
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

function TodaysNotes(){

    this.refresh = function refresh(){
        let todaysNotesArray = DataService('READ', `${getCalendarTypeFromHref()}-${date.buildFormatedId()}`)
        let parent = document.querySelector(`.todays-notes--container-${getCalendarTypeFromHref()}`)
        parent.innerHTML = ""
        if (todaysNotesArray){
            todaysNotesArray.forEach((note)=>{
                parent.appendChild(createNoteElement(note, parent))
            })
        }
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
    })
}