let calendarContainer = document.querySelector('.calendar--container');
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function CalendarTemplate(type){
    this.calendarType = type;

    let daysArrayToRepresent = getArrayOfDaysToDisplay(date.day, date.month, date.year);

    // build calendar in DOM
    daysArrayToRepresent.forEach(date =>{
        DayField(this.calendarType, date)
    })

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
}

function CurrentDate(){
    const d = new Date();
    
    this.day = d.getDate();
    this.month = d.getMonth();
    this.year = d.getFullYear();

    this.monthName = months[this.month]
    this.activeDate = new Date(`${this.year}-${this.month+1}-${this.day}`).getDay()
    this.weekday = weekdays[this.activeDate];
}


function DayField(calendarType, date){

    let newDayField = document.createElement("div");
    let dayToDisplay = date.split("-")[2];
    let dayTextPElement = document.createElement("p")
    let dayText = document.createTextNode(dayToDisplay)
    newDayField.setAttribute("id", `${calendarType}-${date}`)
    dayTextPElement.appendChild(dayText)
    newDayField.appendChild(dayTextPElement)
    calendarContainer.appendChild(newDayField)

    // show month name on the first day of month
    if (dayToDisplay === '1'){showMonth()}

    function showMonth(){
        let monthText = document.createTextNode(months[(parseInt(date.split("-")[1]) - 1)].slice(0,3))
        let monthTextPElement = document.createElement("p")
        monthTextPElement.appendChild(monthText)
        newDayField.insertBefore(monthTextPElement, newDayField.firstChild)
    }
}


function ActiveDay(){

}

let date = new CurrentDate();
let newCalendar = CalendarTemplate('food')



let nextMonthBtn = document.querySelector(".next-month")

nextMonthBtn.addEventListener('click', event =>{
    date.month = 5;
    console.log(date)
    calendarContainer.innerHTML = ""
    newCalendar = CalendarTemplate(date.day, date.month, date.year)


})