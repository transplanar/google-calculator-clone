import { parans, opMap, funcMap, constMap } from "@/utils/constants";
import {
  isFactorial,
  isEXP,
  isOperator,
  isConst,
  isFunc,
  isFloat,
  isNumber,
  isParan,
  isPowExp,
  calcFactorial,
} from "@/utils/functions";

import type { Ref } from "vue";
import { ref, nextTick, computed } from "vue";

export default function () {
  const inputs: Ref<Array<string>> = ref([]);
  const answer: Ref<string> = ref("0");
  const expression: Ref<string> = ref("Ans = 0");
  const isInv: Ref<boolean> = ref(false);

  const invalidInput: Ref<boolean> = ref(false);
  const isTouched: Ref<boolean> = ref(false);

  const isInvalidInput = computed(() => {
    if (isTouched.value) return false;

    return invalidInput.value;
  });

  const getLastInput = (): string => {
    return inputs.value[inputs.value.length - 1];
  };

  const handleFloat = (number: string) => {
    if (inputs.value.length === 0) {
      inputs.value.push(`0${number}`);
      return;
    }

    const lastInput = getLastInput();

    if (isNumber(lastInput)) {
      inputs.value[inputs.value.length - 1] = `${lastInput}${number}`;
      return;
    }
  };

  const handleNumber = (input: string) => {
    // if inputs empty, then just push the number
    if (inputs.value.length === 0) {
      inputs.value.push(input);
      return;
    }

    const lastInput = getLastInput();

    // if the lastInput is a number , concat the incoming number
    if (isNumber(lastInput) || isEXP(lastInput) || isFloat(lastInput)) {
      inputs.value[inputs.value.length - 1] = `${lastInput}${input}`;
      return;
    }

    if (
      isConst(lastInput) ||
      isFactorial(lastInput) ||
      lastInput === parans[1] ||
      lastInput === "Ans"
    ) {
      const op = opMap.get("*") as string;
      inputs.value.push(op);
      inputs.value.push(input);
      return;
    }

    if (isPowExp(lastInput)) {
      let openTag = lastInput.slice(0, lastInput.indexOf(">") + 1);
      openTag = openTag.replace("empty", "");
      const tagValue = lastInput.slice(
        lastInput.indexOf(">") + 1,
        lastInput.indexOf("</")
      );
      const closeTag = lastInput.slice(lastInput.indexOf("</"));

      inputs.value[
        inputs.value.length - 1
      ] = `${openTag}${tagValue}${input}${closeTag}`;
      return;
    }

    // if something is enterd and the lastInput is not a number , then just simply push the number
    inputs.value.push(input);
  };

  const handleOperator = (operator: string) => {
    // isTouched.value = true; later
    // if inputs empty, and operator comes in,
    // then check the operator and only allow
    // -, ( operators
    const allowedOpOnEmptyInput = ["-"];
    if (inputs.value.length === 0) {
      if (allowedOpOnEmptyInput.includes(operator)) {
        const op = opMap.get(operator) as string;
        inputs.value.push(op);
      }

      return;
    }

    const lastInput = getLastInput();
    // if lastInput is operator, then return
    if (isOperator(lastInput)) return;

    // if lastInput is a paranthesis, and incoming operator not allowed then just return
    if (lastInput === parans[0] && !allowedOpOnEmptyInput.includes(operator))
      return;

    // for all othercases, push the operator
    const op = opMap.get(operator) as string;
    inputs.value.push(op);
  };

  const handleFunc = (func: string) => {
    if (inputs.value.length === 0) {
      inputs.value.push(...[func, "("]);
      return;
    }

    const lastInput = getLastInput();

    if (
      isNumber(lastInput) ||
      isConst(lastInput) ||
      isFactorial(lastInput) ||
      isEXP(lastInput) ||
      isFloat(lastInput) ||
      isPowExp(lastInput) ||
      lastInput === parans[1] ||
      lastInput === "Ans"
    ) {
      const op = opMap.get("*") as string;
      inputs.value.push(...[op, func, "("]);
      return;
    }

    inputs.value.push(...[func, "("]);
  };

  const handleConst = (constant: string) => {
    // if inputs is empty, allow incoming constant
    if (inputs.value.length === 0) {
      inputs.value.push(constant);
      return;
    }

    // if inputs is not empty, check the lastInput
    // if lastInput is one of conditions, then multiply with incoming constant

    const lastInput = getLastInput();

    if (
      isConst(lastInput) ||
      isNumber(lastInput) ||
      isEXP(lastInput) ||
      isFloat(lastInput) ||
      isFactorial(lastInput) ||
      isPowExp(lastInput) ||
      lastInput === parans[1] ||
      lastInput === "Ans"
    ) {
      const op = opMap.get("*") as string;
      inputs.value.push(op);
      inputs.value.push(constant);
      return;
    }

    inputs.value.push(constant);
  };

  const handleAnswer = () => {
    if (inputs.value.length === 0) {
      inputs.value = ["Ans"];
      return;
    }

    const lastInput = getLastInput();
    if (isNumber(lastInput)) {
      inputs.value = ["Ans"];
      return;
    }

    if (isOperator(lastInput)) {
      inputs.value.push("Ans");
      return;
    }
    if (
      isConst(lastInput) ||
      isFloat(lastInput) ||
      isPowExp(lastInput) ||
      lastInput === parans[1] ||
      lastInput === "Ans"
    ) {
      const op = opMap.get("*") as string;
      inputs.value.push(op);
      inputs.value.push("Ans");
      return;
    }

    inputs.value.push("Ans");
    // handleNumber(answer.value);
  };

  const getRandomNumber = (): string => {
    // fixed number to 7 places as per the google calculator
    return Math.random().toFixed(7);
  };

  const handleRandom = () => {
    if (inputs.value.length === 0) {
      inputs.value = [getRandomNumber()];
      return;
    }

    const lastInput = getLastInput();
    if (
      isNumber(lastInput) ||
      isConst(lastInput) ||
      isFloat(lastInput) ||
      isPowExp(lastInput) ||
      lastInput === "Ans" ||
      lastInput === parans[1]
    ) {
      const op = opMap.get("*") as string;
      inputs.value.push(op);
      inputs.value.push(getRandomNumber());
      return;
    }

    inputs.value.push(getRandomNumber());
  };

  const handleParans = (paran: string) => {
    // if inputs is empty, just allow the opening paran
    if (inputs.value.length === 0 && paran === parans[0]) {
      inputs.value.push(paran);
      return;
    }

    //if lastInput is number + incoming paran is ) then add x in btw
    const lastInput = getLastInput();

    //if lastInput is number or constant and incoming paran is (
    // then add x in btw
    if (
      (isNumber(lastInput) ||
        isConst(lastInput) ||
        isEXP(lastInput) ||
        isFloat(lastInput) ||
        lastInput === "Ans" ||
        isFactorial(lastInput)) &&
      paran === parans[0]
    ) {
      const op = opMap.get("*") as string;
      inputs.value.push(op);
      inputs.value.push(paran);
      return;
    }

    // if incoming paran is ) and inputs do not have the (, then just return
    if (paran === parans[1] && !inputs.value.includes(parans[0])) return;

    // if the lastInput is operator or ( and incoming paran is ), then just return
    if (
      (isOperator(lastInput) || lastInput === parans[0]) &&
      paran === parans[1]
    )
      return;

    // if lastInput is ) and incoming paran is ( , then add x in btw
    if (lastInput === parans[1] && paran === parans[0]) {
      const op = opMap.get("*") as string;
      inputs.value.push(op);
      inputs.value.push(paran);
      return;
    }

    inputs.value.push(paran);
  };

  const handlePow = (string: string) => {
    let powHtml = `<sup class="pow empty">`;

    switch (string) {
      case "10**":
        powHtml = `10${powHtml}`;
        break;
      case "e**":
        powHtml = `e${powHtml}`;
        break;
      case "x**":
        powHtml = `${powHtml.replace("empty", "")}2`;
    }

    powHtml += "</sup>";

    if (inputs.value.length === 0 && (string === "10**" || string === "e**")) {
      inputs.value.push(powHtml);
      return;
    }

    const lastInput = getLastInput();

    if (
      (isNumber(lastInput) || isFloat(lastInput)) &&
      (string === "**" || string === "x**")
    ) {
      inputs.value[inputs.value.length - 1] = `${lastInput}${powHtml}`;
      return;
    }

    if (
      isNumber(lastInput) ||
      isConst(lastInput) ||
      isEXP(lastInput) ||
      isFloat(lastInput) ||
      lastInput === "Ans" ||
      lastInput === ")"
    ) {
      const op = opMap.get("*") as string;
      inputs.value.push(op);
      inputs.value.push(`${powHtml}`);
      return;
    }
  };

  const handleSymbol = (symbol: string) => {
    if (inputs.value.length === 0) return;

    const lastInput = getLastInput();

    if (isNumber(lastInput)) {
      inputs.value[inputs.value.length - 1] = `${lastInput}${symbol}`;
      return;
    }
  };

  const handleDelete = () => {
    inputs.value.pop();
  };

  const inputHandler = function (key: string) {
    if (isInv.value) isInv.value = false;
    if (invalidInput.value) {
      inputs.value = [];
      invalidInput.value = false;
    }

    if (isNumber(key)) {
      handleNumber(key);
      return;
    }

    if (isOperator(key)) {
      handleOperator(key);
      return;
    }

    if (isParan(key)) {
      handleParans(key);
      return;
    }

    if (isFunc(key)) {
      const [value] = funcMap.get(key) as Array<string>;
      handleFunc(value);
      return;
    }

    if (isConst(key)) {
      const [value] = constMap.get(key) as Array<string>;
      handleConst(value);
      return;
    }

    if (key === ".") {
      handleFloat(key);
      return;
    }

    if (key === "!" || key === "E") {
      handleSymbol(key);
      return;
    }

    if (key.indexOf("**") >= 0) {
      handlePow(key);
      return;
    }

    if (key === "ans") {
      handleAnswer();
      return;
    }
    if (key === "rnd") {
      handleRandom();
      return;
    }

    if (key === "Enter") {
      evaluateResult();
      return;
    }

    if (key === "Backspace") {
      handleDelete();
      return;
    }
  };

  const parseInputArray = (): Array<string> => {
    const parsed: Array<string> = [];

    for (let i = 0; i < inputs.value.length; i++) {
      const current: string = inputs.value[i];
      // check in opMap, if found, set value to parsed array
      if (opMap.has(current)) {
        const op = opMap.get(current) as string;
        parsed.push(op);
        continue;
      }

      // check in funcMap, if found, set value to parsed array
      if (funcMap.has(current)) {
        const funcArr = funcMap.get(current) as Array<string>;
        parsed.push(funcArr[1]);
        continue;
      }

      // check in constMap, if found, set value to parsed array
      if (constMap.has(current)) {
        const constArr = constMap.get(current) as Array<string>;
        parsed.push(constArr[1]);
        continue;
      }

      // id is factorial , calculate the factorial
      if (isFactorial(current)) {
        const sliced = current.slice(0, current.indexOf("!"));
        const num = Number.parseInt(sliced);
        parsed.push(String(calcFactorial(num)));
        continue;
      }

      // is exp , calculate the exp
      if (isEXP(current)) {
        const [num, exp] = current.split("E");
        parsed.push(`${num}*Math.pow(10, ${exp || 0})`);
        continue;
      }

      // if a power expression
      if (isPowExp(current)) {
        let base = current.slice(0, current.indexOf("<"));
        const pow = current.slice(
          current.indexOf(">") + 1,
          current.indexOf("</")
        );
        if (base === "e") base = Math.E.toString();
        const res = Math.pow(Number(base), Number(pow)).toString();
        parsed.push(res);
        continue;
      }

      if (current === "Ans") {
        parsed.push(answer.value);
        continue;
      }

      parsed.push(current);
    }

    return parsed;
  };

  const evaluateResult = async () => {
    try {
      if (!inputs.value.length) return;
      const parsed = parseInputArray();
      const result = eval(parsed.join(""));
      expression.value = [inputs.value.join(" "), " ="].join("");
      answer.value = result.toString();
      inputs.value = [];
      await nextTick();
      inputs.value = [result.toString()];
    } catch (error) {
      isTouched.value = false;
      invalidInput.value = true;
      inputs.value = ["Error"];
    }
  };

  return {
    isInvalidInput,
    inputs,
    expression,
    isInv,
    getLastInput,
    handleFloat,
    handleNumber,
    handleOperator,
    handleFunc,
    handleConst,
    handleAnswer,
    handleRandom,
    handleParans,
    handlePow,
    handleSymbol,
    handleDelete,
    inputHandler,
    parseInputArray,
    evaluateResult,
  };
}
