
import { getCalendarTypeFromHref , date, createNoteElement} from "./index.js"
import { DataService } from "./dataService.js"

export function TodaysNotes(){

    this.refresh = function refresh(){
        let parent = document.querySelector(`.todays-notes--container-${getCalendarTypeFromHref()}`)
        parent.innerHTML = ""
        let todaysNotesArray = DataService('READ', `${getCalendarTypeFromHref()}-${date.buildFormatedId()}`)
        if (todaysNotesArray){
            todaysNotesArray.forEach((note)=>{
                parent.appendChild(createNoteElement(note, parent))
            })
        }
    }
    this.refresh()
}