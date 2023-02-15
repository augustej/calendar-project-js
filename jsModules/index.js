import { DataService } from "/jsModules/dataService.js";
import { CurrentDate } from "/jsModules/currentDate.js";
import { buildCalendarTemplate } from "/jsModules/buildCalendarTemplate.js";
import { noteFunctionality } from "/jsModules/noteFunctionality.js";
import { ChangeMonthBtn } from "/jsModules/changeMonthBtn.js";
import { MonthAndYearDisplay } from "/jsModules/monthAndYearDisplay.js";
import { Weeknames } from "/jsModules/displayWeeknames.js";
import { TodaysNotes } from "/jsModules/todaysNotes.js";
import { TodayBtn } from "/jsModules/todayBtn.js";

export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export let date = new CurrentDate();
buildCalendarTemplate()
noteFunctionality()
export let todaysNotes = new TodaysNotes()
export let displayMonthAndYear = new MonthAndYearDisplay()

new ChangeMonthBtn('next')
new ChangeMonthBtn('prev')
new TodayBtn()
let weekNames = window.innerWidth > 600 ? new Weeknames('desktop') : new Weeknames('mobile')
weekNames.addToDom()


export function getCalendarTypeFromHref(){
    return window.location.href.split("/").pop().split(".")[0]
}

export function createNoteElement(note, parentElement){
    let noteId = Object.keys(note)[0]
    let noteText = note[noteId]
    let pElement = document.createElement("p")
    let deleteElement = document.createElement("button")
    deleteElement.appendChild(document.createTextNode("X"))
    deleteElement.setAttribute("class", "delete-note")
    deleteElement.setAttribute("type", "button")
    deleteElement.addEventListener("click", event=>{
        deleteNote(event)
    })

    pElement.appendChild(deleteElement)
    pElement.setAttribute("id", noteId)
    pElement.setAttribute("class", "note")
    let textElement = document.createTextNode(noteText)
    pElement.appendChild(textElement)
    parentElement.appendChild( pElement)
    return pElement

    function deleteNote(event){
        let idToDelete = event.target.parentElement.getAttribute("id")
        let dayId = `${getCalendarTypeFromHref()}-${date.buildFormatedId()}`
        DataService('DELETE', dayId, "", idToDelete)
        refreshDayInDom(dayId)
    }
}

export function refreshDayInDom(dayId){
    let calendarField = document.querySelector(`#${dayId}`)

    // delete all notes before refreshing notes in day field
    let alreadyDisplayedNotes = calendarField.querySelectorAll(".note")
    alreadyDisplayedNotes.forEach(note =>{
        note.remove()
    })

    // refreshing notes in day field
    let notesArray = DataService('READ', dayId)
    if (notesArray){
        notesArray.forEach((note)=>{
            calendarField.appendChild(createNoteElement(note, calendarField))
        })
    }

    // refresh todays notes
    todaysNotes.refresh()
}
