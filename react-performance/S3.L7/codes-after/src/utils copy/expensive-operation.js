export const randomExpensiveOperation = () => {
  function wait() {
    var start = new Date();
    //empty while loop until the required amount of time has passed
    while ((new Date() - start) / 1000 < 0.5);
  }
  wait();
};
