const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function Weeknames(weeknamesStyle){
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