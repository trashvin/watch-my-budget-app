export class Entry {
  id: number;
  description: string;
  is_expense: boolean;
  amount: number;
  category: string;
  is_excluded: boolean;
  constructor(
    an_id: number,
    a_description: string,
    an_expense: boolean,
    an_amount: number,
    a_category: string
  ) {
    this.id = an_id;
    this.description = a_description;
    this.is_expense = an_expense;
    this.amount = an_amount;
    this.category = a_category;
  }
}
