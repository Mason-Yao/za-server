// const toMoveArray = (commands) => {
//   return commands.split("").map((item) => {
//     switch (item) {
//       case "R":
//         return [1, 0];
//       case "L":
//         return [-1, 0];
//       case "D":
//         return [0, 1];
//       case "U":
//         return [0, -1];
//       default:
//         break;
//     }
//   });
// };

// console.log(toMoveArray("RDLU"));

const arr = [[1, 2, 3], [2, 3, 4]];
const f = (arr) => {
  arr.pop();
}
f(arr)
console.log(arr);