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
export { CurrentDate }