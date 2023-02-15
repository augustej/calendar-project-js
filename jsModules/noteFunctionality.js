import { getCalendarTypeFromHref , date, refreshDayInDom} from "/jsModules/index.js";
import { DataService } from "/jsModules/dataService.js";

export function noteFunctionality(){

    let noteType = getCalendarTypeFromHref();
    let calendarContainer = document.querySelector(`.calendar--container-${noteType}`)
    buildAddNewNoteBtnInDom(noteType)

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
        closeModalBtn.addEventListener("click", event=>{ closeModal(event) })

        let saveNoteBtn = document.createElement("button")
        saveNoteBtn.setAttribute("type", "button")
        saveNoteBtn.addEventListener("click", event=>{ saveNote(event) })
        saveNoteBtn.appendChild(document.createTextNode("Save"))

        innerModal.appendChild(titleElement)
        innerModal.appendChild(noteElement)
        innerModal.appendChild(closeModalBtn)
        innerModal.appendChild(saveNoteBtn)
        modal.appendChild(innerModal)

        let bodyElement = document.querySelector('body')
        bodyElement.appendChild(modal)
    }

    function closeModal(event){
        let modal = event.target.closest(".modal")
        modal.remove()
    }

    function saveNote(event){
        let noteTextarea = document.querySelector(".inner-modal > textarea")
        let dayId = `${noteType}-${date.buildFormatedId()}`

        if (noteTextarea.value){
            DataService('CREATE', dayId, noteTextarea.value)
        }
        document.querySelector(".modal").remove()
        refreshDayInDom(dayId)
    }
}