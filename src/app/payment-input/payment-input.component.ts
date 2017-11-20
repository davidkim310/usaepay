import { Component, OnInit } from '@angular/core';
import { Payer } from "./payer";
import { NgForm } from '@angular/forms'
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-payment-input',
  templateUrl: './payment-input.component.html',
  styleUrls: ['./payment-input.component.css']
})
export class PaymentInputComponent implements OnInit {
  public maskDate = [/\d/, /\d/, '/', /\d/, /\d/];  //Creates forward slash in expiration input
  amounts:any[] = [{'amount': '1.00'}, {'amount': '5.00'}, {'amount': '15.00'}, {'amount': 'USD Custom Amount'}];
  selectedAmount = this.amounts[1];
  custom: string = "";
  model = new Payer("", "", "", "", "", "", this.amounts[1].amount);
  approved: boolean;
  invalidCard: boolean;
  expired: boolean;
  chosenAmount: any;

  constructor( private paymentApi: PaymentService ) {}
  ngOnInit() {
    this.chosenAmount = this.amounts[1];
    this.approved = false;
    this.invalidCard = false;
    this.expired = false;
  }
  clickNum(){
    this.invalidCard = false;
    this.approved = false;
    this.expired = false;    
  }
  clickExp(){
    this.invalidCard = false;
    this.approved = false;
    this.expired = false;
  }
  onChange(amount) {
    console.log("amount", amount);
    this.model.amount = amount.amount;
  }
  public donate(){
    //If we have a custom amount, we need to remove $ for api call
    if(this.custom.length > 1){
      this.model.amount = this.custom.replace("$", "").toString()
    }
    //Create of object to send to API
    let obj = {
      command: "cc:sale",
      // amount: this.model.amount.replace("$", "").toString(),  //Removes $ characters
      amount: this.model.amount,
      amount_detail: {
          tax: "0.00",
          tip: "0.00"
      },
      creditcard: {
          cardholder: this.model.name,
          number: this.model.cardNum.toString(),
          expiration: this.model.exp.replace(/[^\w\s]/gi, '').toString(), //Removes forward slash
          cvc: this.model.cvc.toString(),
          avs_street: this.model.address,
          avs_zip: this.model.zipCode.toString()
      },
      invoice:  Math.floor(Math.random() * (99999 - 10000)) + 1 //Creates a random invoice number
      }
      this.paymentApi.post(obj).subscribe(data=>{
        console.log("response data", data)
        //The following will show the proper responses upon submitting payment info. Establishes booleans for HTML *ngIf
        if(data.result === "Approved"){
          this.approved = true;
        } else if(data.error === "Invalid Card Number (3)"){
          this.invalidCard = true;
        } else if(data.error === "Credit card has expired." ){
          this.expired = true;
        }
        console.log(obj)
      })
  }
}
