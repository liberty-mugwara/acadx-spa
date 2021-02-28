const list: any[] = [];
let itemList;
if (list.length > 0) {
  for (const items of list.slice(1)) {
    if (items.length < 10) {
      itemList = items;
    }
  }
} else {
  list[1] = [];
  itemList = list[1];
  itemList.push(1);
}
const z = list.indexOf(itemList);
z;
list;
