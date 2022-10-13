(() => {


    /*
 * @Author: msc
 * @Date: 2022-03-03 11:05:51
 * @LastEditTime: 2022-03-03 11:35:56
 * @LastEditors: msc
 * @Description: 
 */

    enum Direction {
        Up = 1,
        Down,
        Left,
        Right
    }

    enum Responses {
        No,
        Yes
    }
    function respond(recipient: string, message: Responses): void {
        1 + 1;
    }

    respond("Princess Caroline", Responses.Yes)

    // console.log(Responses.Yes === Responses.Yes);

    const enum Directions {
        Up,
        Down,
        Left,
        Right
    }

    let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
    enum Enum {
        A = 1,
        B,
        C = 2
    }


    interface Named {
        name: string;
    }

    let xx: Named;
    let y = { name: "Alice", location: "Seattle" };
    xx = y;



    enum Permission {
        None = 0,
        Read = 1 << 0,
        Write = 1 << 1,
        Delete = 1 << 2,
        Manage = Read | Write | Delete,
    }

    type User = {
        permission: Permission;
    }

    console.log(Permission);

    const user: User = { permission: 0b0101 };
    if ((user.permission & Permission.Write) === Permission.Write) {
        console.log('有写的去权限');
    }

    type Fruit = 'apple' | 'banana' | 'pineapple' | 'watermelon'

    let a: Fruit = 'watermelon';

    console.log(a);

})();