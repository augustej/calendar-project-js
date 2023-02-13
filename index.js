const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getCalendarTypeFromHref(){
    return window.location.href.split("/").pop().split(".")[0]
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
        if (noteTextarea.value){
            let dayId = `${this.noteType}-${date.buildFormatedId()}`
            DataService('CREATE', dayId, noteTextarea.value)
        }

        console.log("test")
        console.log(noteTextarea.value, noteTextarea, "noteTextarea")
    }

    let calendarContainer = document.querySelector(`.calendar--container-${this.noteType}`)
    let newAddNoteBtn = document.createElement("button")
    newAddNoteBtn.setAttribute("class", `${this.noteType}-add-note-btn`)
    newAddNoteBtn.appendChild(document.createTextNode('Add note'))
    calendarContainer.after(newAddNoteBtn)
    newAddNoteBtn.addEventListener('click', event =>{
        createNewNoteModal(this.noteType)
    })

    function createNewNoteModal(noteType){
        // display modal in DOM
        let modal = document.createElement("div")
        let titleElement = document.createElement("p")
        let titleText = document.createTextNode(`${date.year}-${(date.month+1).toLocaleString('en-US', {minimumIntegerDigits: 2})}-${date.day} ${noteType}`)
        let noteElement = document.createElement("textarea")
        let closeModalBtn = document.createElement("button")
        closeModalBtn.setAttribute("type", "button")
        closeModalBtn.appendChild(document.createTextNode("X"))
        closeModalBtn.setAttribute("onclick", "addNote.closeModal()")

        let saveNoteBtn = document.createElement("button")
        saveNoteBtn.setAttribute("type", "button")
        saveNoteBtn.setAttribute("onclick", "addNote.saveNote()")
        saveNoteBtn.appendChild(document.createTextNode("Save"))


        noteElement.setAttribute("placeholder", "add your note")
        modal.setAttribute("class", "new-note-modal")
        titleElement.setAttribute("class", "note-title")
        titleElement.appendChild(titleText)
        
        modal.setAttribute("class", "modal")
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
    this.activeDate = new Date(`${this.year}-${this.month+1}-${this.day}`).getDay()
    this.weekday = weekdays[this.activeDate];
}

function DataService(method, dayId, body){
    // localStorage.removeItem(dayId)
    
    // create noteId
    let noteId = localStorage.getItem("noteId")
    if (!noteId){
        localStorage.setItem("noteId", 0)
    }
    else{        
        localStorage.setItem("noteId", (parseInt(noteId) + 1))
    }

    let currentNotesArray = JSON.parse(localStorage.getItem(dayId))
    let response = []

    switch (method) {
        case 'CREATE':
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
            currentNotesArray.filter((noteObject) =>{
                if (key in noteObject !== noteId){
                    return true
                }
            })
            localStorage.setItem(dayId, JSON.stringify(currentNotesArray))
            break
    }
    return response

}

function DayField(calendarType, date, parentElement){
    
    this.id = `${calendarType}-${date}`
    
    let newDayField = document.createElement("div");
    buildDayFieldInDom()

    function buildDayFieldInDom(){

        let dayToDisplay = date.split("-")[2];
        let dayTextPElement = document.createElement("p")
        let dayText = document.createTextNode(dayToDisplay)
        newDayField.setAttribute("id", this.id)
        dayTextPElement.appendChild(dayText)
        newDayField.appendChild(dayTextPElement)
        parentElement.appendChild(newDayField)

        // show month name on the first day of month
        if (dayToDisplay === '1'){showMonth()}

        // add notes from local storage if any
        if (DataService('READ', newDayField.id)){showNotes()}

    }

    function showNotes(){
        DataService('READ', this.id).forEach((note)=>{
            newDayField.appendChild( createNoteElement(note))
        })
    }

    function createNoteElement(note){
        let noteId = Object.keys(note)[0]
        let noteText = note[noteId]
        let pElement = document.createElement("p")
        pElement.setAttribute("id", noteId)
        let textElement = document.createTextNode(noteText)
        pElement.appendChild(textElement)
        newDayField.appendChild( pElement)
        return pElement
    }

    function showMonth(){
        let monthText = document.createTextNode(months[(parseInt(date.split("-")[1]) - 1)].slice(0,3))
        let monthTextPElement = document.createElement("p")
        monthTextPElement.appendChild(monthText)
        newDayField.insertBefore(monthTextPElement, newDayField.firstChild)
    }
}


let date = new CurrentDate();
let newCalendar = buildCalendarTemplate()
let addNote = new AddNote()
// DataService('CREATE', 'events-2023-02-14', 'id5', 'Valennt')

let nextMonthBtn = document.querySelector(".next-month")

nextMonthBtn.addEventListener('click', event =>{
    date.month = 5;
    calendarContainer.innerHTML = ""
    newCalendar = CalendarTemplate(date.day, date.month, date.year)


})