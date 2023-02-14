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

export {DataService}