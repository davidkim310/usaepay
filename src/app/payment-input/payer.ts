export class Payer {
    constructor(
        public name: string,
        public cardNum: string,
        public cvc: string,
        public exp: string,
        public address: string,
        public zipCode: string,
        public amount: string
      ) {  }
}
