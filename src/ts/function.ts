


/*
 * @Author: msc
 * @Date: 2022-03-02 20:53:06
 * @LastEditTime: 2022-03-02 21:19:39
 * @LastEditors: msc
 * @Description: function
 */

let myAdd = (baseValue: number, increment: number): number => {
    return baseValue + increment;
}

/**
 * optionParams and default params
 */
function buildName(firstName: string = "smith", lastName?: string) {
    return firstName + " " + lastName;
}
let result1 = buildName("Bob");                  // error, too few parameters
// let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");         // ah, just right

/**
 * remainParams
 */
function buildName2(firstName: string, ...restName: string[]) {
    return firstName + " " + restName.join(" ");
}
let employeeName = buildName2("Joseph", "Samuel", "Lucas", "MacKinzie");
console.log(employeeName);


/**
 * this usage
 */
 interface Card {
    suit: string;
    card: number;
}
interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}
let deck: Deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    // NOTE: The function now explicitly specifies that its callee must be of type Deck
    createCardPicker: function(this: Deck) {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

// alert("card: " + pickedCard.card + " of " + pickedCard.suit);

interface UIElement {
    addClickListener(onclick: (this: void, e: Event) => void): void;
}
class Handler {
    info: string;
    onClickBad(this: Handler, e: Event) {
        // oops, used this here. using this callback would crash at runtime
        this.info = e.message;
    }
}
let h = new Handler();
uiElement.addClickListener(h.onClickBad); // error!

