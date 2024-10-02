import { planningArea, QNode, specializationNodes, welcome } from "./questions";

export function getQuestions() {
  // welcome question
  welcome.next = function (answer) {
    if (answer[this.key] === "KNOW") {
      return planningArea;
    }
    return planningArea;
  };

  // planning area
  // This one is complicated because of JS closures. We need to create a new function for each node
  planningArea.next = function (answer) {
    let current: QNode | null = null;
    let prev: QNode | null = null;
    for (const name of answer[this.key] ?? []) {
      if (!specializationNodes[name]) {
        current = specializationNodes[name];
      }
      if (current) {
        current.next = (function () {
          const captured = prev ? prev : null;
          return function (answer) {
            return captured;
          };
        })();
      }
      if (prev) {
        prev.prev = (function () {
          const captured = current;
          return function (answer) {
            return captured;
          };
        })();
      }
      prev = current;
    }
    if(current) {
      current.prev = function () {
        return planningArea;
      };
    }
    return current;
  };
  planningArea.prev = function () {
    return welcome;
  };

  //

  return welcome;
}
