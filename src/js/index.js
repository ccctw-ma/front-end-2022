// let componentTree = {
//     id: "root",
//     title: '周期树',
//     isOpen: true,
//     type: 'folder',
//     children: [
//         {
//             title: "大周期",
//             id: "1",
//             icon: "FolderOutline",
//             isOpen: true,
//             type: 'folder',
//             children: [
//                 {
//                     id: "2",
//                     title: "中周期",
//                     isOpen: true,
//                     type: 'folder',
//                     children: [
//                         {
//                             id: "3",
//                             title: "小周期",
//                             isOpen: false,
//                             type: 'leaf',
//                             children: [],
//                         },
//                         {
//                             id: "4",
//                             title: "小周期",
//                             isOpen: false,
//                             type: 'leaf',
//                             children: [],
//                         },
//                     ],
//                 },
//             ],
//         }
//     ]
// };
//
//
// let res = null;
// const dfs = (root, node, parent) => {
//    if(root.id===node.id){
//        res = parent;
//        return;
//    }
//    for(let i=0;i<root.children.length;i++){
//         dfs(root.children[i],node,root)
//    }
// }
//
//
//
//
// let node = {
//     id: "4",
//     title: "小周期",
//     isOpen: false,
//     type: 'leaf',
//     children: [],
// };
//
// dfs(componentTree,node,null)
// console.log(res)
//


// const data = {
//     appId: "123",
//     size: 100,
//     teams: [
//         {
//             id: "1",
//             name: "田径一队",
//             members: [
//                 {
//                     name: "申卓辉1",
//                     id: "1.1",
//                     imageUrl:
//                         "http://10.112.147.163:10000/appuser-avatars/app_fa524ca8abfa4c96aeb4232d2c004c26/us_7c3748ba992d46f98c102ff5253b41aa/avatar/e14c484a-8534-40f7-8951-e21bd1f46763.jpg",
//                 },
//                 {
//                     name: "申卓辉2",
//                     id: "1.2",
//                     imageUrl:
//                         "http://10.112.147.163:10000/appuser-avatars/app_fa524ca8abfa4c96aeb4232d2c004c26/us_7c3748ba992d46f98c102ff5253b41aa/avatar/e14c484a-8534-40f7-8951-e21bd1f46763.jpg",
//                 },
//                 {
//                     name: "申卓辉3",
//                     id: "1.3",
//                     imageUrl:
//                         "http://10.112.147.163:10000/appuser-avatars/app_fa524ca8abfa4c96aeb4232d2c004c26/us_7c3748ba992d46f98c102ff5253b41aa/avatar/e14c484a-8534-40f7-8951-e21bd1f46763.jpg",
//                 },
//                 {
//                     name: "申卓辉4",
//                     id: "1.4",
//                     imageUrl:
//                         "http://10.112.147.163:10000/appuser-avatars/app_fa524ca8abfa4c96aeb4232d2c004c26/us_7c3748ba992d46f98c102ff5253b41aa/avatar/e14c484a-8534-40f7-8951-e21bd1f46763.jpg",
//                 },
//                 {
//                     name: "申卓辉5",
//                     id: "1.5",
//                     imageUrl:
//                         "http://10.112.147.163:10000/appuser-avatars/app_fa524ca8abfa4c96aeb4232d2c004c26/us_7c3748ba992d46f98c102ff5253b41aa/avatar/e14c484a-8534-40f7-8951-e21bd1f46763.jpg",
//                 },
//                 {
//                     name: "申卓辉6",
//                     id: "1.6",
//                     imageUrl:
//                         "http://10.112.147.163:10000/appuser-avatars/app_fa524ca8abfa4c96aeb4232d2c004c26/us_7c3748ba992d46f98c102ff5253b41aa/avatar/e14c484a-8534-40f7-8951-e21bd1f46763.jpg",
//                 },
//                 {
//                     name: "申卓辉7",
//                     id: "1.7",
//                     imageUrl:
//                         "http://10.112.147.163:10000/appuser-avatars/app_fa524ca8abfa4c96aeb4232d2c004c26/us_7c3748ba992d46f98c102ff5253b41aa/avatar/e14c484a-8534-40f7-8951-e21bd1f46763.jpg",
//                 },
//                 {
//                     name: "申卓辉8",
//                     id: "1.8",
//                     imageUrl:
//                         "http://10.112.147.163:10000/appuser-avatars/app_fa524ca8abfa4c96aeb4232d2c004c26/us_7c3748ba992d46f98c102ff5253b41aa/avatar/e14c484a-8534-40f7-8951-e21bd1f46763.jpg",
//                 },
//                 {
//                     name: "申卓辉9",
//                     id: "1.9",
//                     imageUrl:
//                         "http://10.112.147.163:10000/appuser-avatars/app_fa524ca8abfa4c96aeb4232d2c004c26/us_7c3748ba992d46f98c102ff5253b41aa/avatar/e14c484a-8534-40f7-8951-e21bd1f46763.jpg",
//                 },
//             ],
//         },
//         {
//             id: "2",
//             name: "田径二队",
//             members: [
//                 {
//                     name: "申卓辉2.1",
//                     id: "2.1",
//                     imageUrl:
//                         "http://10.112.147.163:10000/appuser-avatars/app_fa524ca8abfa4c96aeb4232d2c004c26/us_7c3748ba992d46f98c102ff5253b41aa/avatar/e14c484a-8534-40f7-8951-e21bd1f46763.jpg",
//                 },
//                 {
//                     name: "申卓辉2.2",
//                     id: "2.2",
//                     imageUrl:
//                         "http://10.112.147.163:10000/appuser-avatars/app_fa524ca8abfa4c96aeb4232d2c004c26/us_7c3748ba992d46f98c102ff5253b41aa/avatar/e14c484a-8534-40f7-8951-e21bd1f46763.jpg",
//                 },
//                 {
//                     name: "申卓辉2.3",
//                     id: "2.3",
//                     imageUrl:
//                         "http://10.112.147.163:10000/appuser-avatars/app_fa524ca8abfa4c96aeb4232d2c004c26/us_7c3748ba992d46f98c102ff5253b41aa/avatar/e14c484a-8534-40f7-8951-e21bd1f46763.jpg",
//                 },
//             ],
//         },
//     ],
// }
//
// // console.log(data.teams[0].members.filter(member=> member.name.includes('3')))
//
//
// let labels = [
//     "月份",
//     "周期块",
//     "大环",
//     "中环",
//     "小环",
//     "比赛",
//     "外训",
//     "组数",
//     "次数",
//     "恢复时间",
// ]
//
// labels = labels.map(label => {
//     return {type: 'label', value: label}
// })
// console.log(labels)


const tree = {
    _id: "root",
    title: '训练计划结构树',
    children: [
        {
            _id: 'aaa',
            title: '大周期',
            members: ['user1', 'user2'],
            beginTime: null,
            timeRange: null,
            children: [
                {
                    _id: 'aaa_bbb',
                    title: '中周期',
                    timeRange: null,
                    children: [
                        {
                            _id: 'aaa_bbb_ccc',
                            title: "小周期1",
                            timeRange: 2,
                            children: [ //具体到天
                                {
                                    id: '',
                                    name: '',
                                    content: {}
                                },
                                {
                                    id: '',
                                    name: '',
                                    content: {}
                                }
                            ]
                        }
                    ]
                },
                {
                    _id: 'aaa_ccc',
                    title: '中周期',
                    timeRange: null,
                    children: [
                        {
                            _id: 'aaa_bbb_ccc',
                            title: "小周期1",
                            timeRange: 2,
                            children: [ //具体到天
                                {
                                    id: '',
                                    name: '',
                                    content: {}
                                },
                                {
                                    id: '',
                                    name: '',
                                    content: {}
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}


const getNode = node => {
    let queue = [tree];
    while (queue.length) {
        for (let i = 0; i < queue.length; i++) {
            let temp = queue.shift();
            if (temp._id === node._id) {
                return temp;
            } else if (temp._id.split("_").length !== 3) {
                temp.children.forEach(c => queue.push(c))
            }
        }
    }
    return null;
}

const getParent = (node) => {
    let levels = node._id.split('_');
    let tar = {};
    if (levels.length === 1) {
        tar._id = 'root';
    } else if (levels.length === 2) {
        tar._id = levels[0];
    } else {
        tar._id = levels[0] + '_' + levels[1];
    }
    return getNode(tar);
}


let node = {
    _id: 'aaa_bbb',
    title: "小周期1",
    timeRange: 2,
    children: [ //具体到天
        {
            id: '',
            name: '',
            content: {}
        },
        {
            id: '',
            name: '',
            content: {}
        }
    ]
}

console.log(tree.children[0].children.findIndex(e=>e._id===node._id))


