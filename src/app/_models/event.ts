import { Entry } from "./Entry";
export class Event {
  _id: string;
  owner_id: string;
  description: string;
  date: Date;
  entry_counter: number;
  is_closed: boolean;
  exclude: boolean;
  entries: Entry[];
  constructor(an_owner_id: string, a_description: string, a_date: Date) {
    this.owner_id = an_owner_id;
    this.description = a_description;
    this.date = a_date !== undefined ? a_date : new Date();
    this.entry_counter = 0;
    this.is_closed = false;
    this.entries = new Array<Entry>();
  }
  getTotalFund() {
    let val = 0;
    this.entries.forEach( element => {
      if ( !element.is_expense) {
        val += +element.amount;
      }
    });
    return val;
  }
  getTotalExpense() {
    let val = 0;
    this.entries.forEach( element => {
      if (element.is_expense) {
        val += +element.amount;
      }
    });
    return val;
  }
}
