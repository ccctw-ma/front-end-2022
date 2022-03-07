"use strict";
/*
 * @Author: msc
 * @Date: 2022-03-02 20:53:06
 * @LastEditTime: 2022-03-03 10:00:36
 * @LastEditors: msc
 * @Description: function
 */
let myAdd = (baseValue, increment) => {
    return baseValue + increment;
};
/**
 * optionParams and default params
 */
function buildName(firstName = "smith", lastName) {
    return firstName + " " + lastName;
}
let result1 = buildName("Bob"); // error, too few parameters
// let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams"); // ah, just right
/**
 * remainParams
 */
function buildName2(firstName, ...restName) {
    return firstName + " " + restName.join(" ");
}
let employeeName = buildName2("Joseph", "Samuel", "Lucas", "MacKinzie");
console.log(employeeName);
let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    // NOTE: The function now explicitly specifies that its callee must be of type Deck
    createCardPicker: function () {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);
            return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
        };
    }
};
let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();
// class Handler {
//     info: string;
//     onClickBad(this: Handler, e: Event) {
//         // oops, used this here. using this callback would crash at runtime
//         this.info = e.message;
//     }
// }
// let h = new Handler();
// uiElement.addClickListener(h.onClickBad); // error!
