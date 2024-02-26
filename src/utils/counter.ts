export default function counter() {
  let count = 1;
  return function () {
    return count++;
  };
}
