<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import type { Ref } from "vue";

const invalidInput: Ref<boolean> = ref(false);
const isTouched: Ref<boolean> = ref(false);
const inputs: Ref<Array<string>> = ref([]);
const answer: Ref<string> = ref("0");
const expression: Ref<string> = ref("Ans = 0");
const isInv: Ref<boolean> = ref(false);
// map of key:value and value:key
const opMap: Map<string, string> = new Map([
  ["*", "×"],
  ["/", "÷"],
  ["+", "+"],
  ["-", "-"],
  ["%", "%"],
  ["×", "*"],
  ["÷", "/"],
]);

const operators: Array<string> = [...opMap.keys()];

const isInvalidInput = computed(() => {
  if (isTouched.value) return false;

  return invalidInput.value;
});

const parans: Array<string> = ["(", ")"];

const funcMap: Map<string, Array<string>> = new Map([
  ["s", ["sin", "Math.sin"]],
  ["c", ["cos", "Math.cos"]],
  ["t", ["tan", "Math.tan"]],
  ["q", ["√", "Math.sqrt"]],
  ["n", ["ln", "Math.log10"]],
  ["l", ["log", "Math.log2"]],
  //inverse map
  ["sin", ["s", "Math.sin"]],
  ["cos", ["c", "Math.cos"]],
  ["tan", ["t", "Math.tan"]],
  ["√", ["q", "Math.sqrt"]],
  ["ln", ["n", "Math.log10"]],
  ["log", ["l", "Math.log2"]],
  // inverse of sin, cos, tan
  ["asin", ["arcsin", "Math.asin"]],
  ["acos", ["arccos", "Math.acos"]],
  ["atan", ["arctan", "Math.atan"]],
  // inverse map of sin, cos, ta
  ["arcsin", ["asin", "Math.asin"]],
  ["arccos", ["acos", "Math.acos"]],
  ["arctan", ["atan", "Math.atan"]],
]);

const funcs: Array<string> = [...funcMap.keys()];

const constMap: Map<string, Array<string>> = new Map([
  ["p", ["π", "Math.PI"]],
  ["e", ["e", "Math.E"]],
  ["π", ["p", "Math.PI"]],
  ["e", ["e", "Math.E"]],
]);

const constants: Array<string> = [...constMap.keys()];

const getLastInput = (): string => {
  return inputs.value[inputs.value.length - 1];
};

const isFactorial = (number: string): boolean => {
  return /^[0-9]+!$/.test(number);
};

const isEXP = (number: string): boolean => {
  return /^[0-9]+E[0-9]*$/.test(number);
};

const isOperator = (operator: string): boolean => {
  return operators.includes(operator);
};

const isConst = (constant: string): boolean => {
  return constants.includes(constant);
};

const isFunc = (func: string): boolean => {
  return funcs.includes(func);
};

const isFloat = (number: string): boolean => {
  return /^[0-9]+[.][0-9]*$/.test(number);
};

const isNumber = (number: string): boolean => {
  return /^[0-9]+$/.test(number);
};

const isParan = (paran: string): boolean => {
  return parans.includes(paran);
};

const isPowExp = (exp: string): boolean => {
  return /^[0-9|e]+<sup class="pow [empty]*">[0-9]*<\/sup>|^[0-9]+[.][0-9]*<sup class="pow [empty]*">[0-9]*<\/sup>/.test(
    exp
  );
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

  const top = inputs.value.length - 1;
  const lastInput = inputs.value[top];

  // if the lastInput is a number , concat the incoming number
  if (isNumber(lastInput) || isEXP(lastInput) || isFloat(lastInput)) {
    inputs.value[top] = `${lastInput}${input}`;
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
  if ((isOperator(lastInput) || lastInput === parans[0]) && paran === parans[1])
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

const calcFactorial = (n: number, memo: Record<string, number> = {}) => {
  if (n == 0) return 1;
  if (n <= 2) return n;

  const result: number = n * calcFactorial(n - 1, memo);

  memo[n] = result;

  return result;
};
</script>

<template>
  <div id="calculator">
    <div class="input-box">
      <transition name="boxin">
        <div class="ans" v-if="inputs.length" v-html="expression"></div>
      </transition>
      <div
        id="input"
        class="input"
        v-html="inputs.join(' ')"
        contenteditable="true"
        @input.prevent="null"
        @keyup.prevent="null"
        @keydown="(event) => inputHandler(event.key)"
        @keypress.prevent="null"
        :class="{ 'invalid-input': isInvalidInput }"
      ></div>
    </div>

    <table id="keys-table">
      <tbody>
        <tr>
          <td colspan="2">
            <button>
              <span class="rad">Rad</span>
              <span>|</span>
              <span class="deg">Deg</span>
            </button>
          </td>
          <td>
            <button @click="inputHandler('!')">x!</button>
          </td>
          <td>
            <button @click="inputHandler('(')">(</button>
          </td>
          <td>
            <button @click="inputHandler(')')">)</button>
          </td>

          <td>
            <button @click="inputHandler('%')">%</button>
          </td>
          <td>
            <button @click="inputHandler('Backspace')">AC</button>
          </td>
        </tr>
        <tr>
          <td>
            <button @click="isInv = !isInv">Inv</button>
          </td>
          <td>
            <button v-if="isInv" @click="inputHandler('arcsin')">
              sin<sup>-1</sup>
            </button>
            <button v-else @click="inputHandler('s')">sin</button>
          </td>
          <td>
            <button v-if="isInv" @click="inputHandler('e**')">
              e<sup>x</sup>
            </button>
            <button v-else @click="inputHandler('n')">ln</button>
          </td>
          <td>
            <button class="light" @click="inputHandler('7')">7</button>
          </td>
          <td>
            <button class="light" @click="inputHandler('8')">8</button>
          </td>
          <td>
            <button class="light" @click="inputHandler('9')">9</button>
          </td>
          <td>
            <button @click="inputHandler('/')">÷</button>
          </td>
        </tr>
        <tr>
          <td>
            <button @click="inputHandler('p')">π</button>
          </td>
          <td>
            <button v-if="isInv" @click="inputHandler('arccos')">
              cos<sup>-1</sup>
            </button>
            <button v-else @click="inputHandler('c')">cos</button>
          </td>
          <td>
            <button v-if="isInv" @click="inputHandler('10**')">
              10<sup>x</sup>
            </button>
            <button v-else @click="inputHandler('l')">log</button>
          </td>
          <td>
            <button class="light" @click="inputHandler('4')">4</button>
          </td>
          <td>
            <button class="light" @click="inputHandler('5')">5</button>
          </td>
          <td>
            <button class="light" @click="inputHandler('6')">6</button>
          </td>
          <td>
            <button @click="inputHandler('*')">×</button>
          </td>
        </tr>
        <tr>
          <td><button @click="inputHandler('e')">e</button></td>
          <td>
            <button v-if="isInv" @click="inputHandler('arctan')">
              tan<sup>-1</sup>
            </button>
            <button v-else @click="inputHandler('t')">tan</button>
          </td>
          <td>
            <button v-if="isInv" @click="inputHandler('x**')">
              x<sup>2</sup>
            </button>
            <button v-else @click="inputHandler('q')">√</button>
          </td>
          <td>
            <button class="light" @click="inputHandler('1')">1</button>
          </td>
          <td>
            <button class="light" @click="inputHandler('2')">2</button>
          </td>
          <td>
            <button class="light" @click="inputHandler('3')">3</button>
          </td>
          <td>
            <button @click="inputHandler('-')">−</button>
          </td>
        </tr>
        <tr>
          <td>
            <button v-if="isInv" @click="inputHandler('rnd')">Rnd</button>
            <button v-else @click="inputHandler('ans')">Ans</button>
          </td>
          <td>
            <button @click="inputHandler('E')">EXP</button>
          </td>
          <td>
            <button @click="inputHandler('**')">x<sup>y</sup></button>
          </td>
          <td>
            <button class="light" @click="inputHandler('0')">0</button>
          </td>
          <td>
            <button class="light" @click="inputHandler('.')">.</button>
          </td>
          <td>
            <button class="blue bold" @click="inputHandler('Enter')">=</button>
          </td>
          <td>
            <button @click="inputHandler('+')">+</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
#calculator {
  margin: 50px auto;
  max-width: 652px;
  font-family: arial, sans-serif;
}

#calculator .input-box {
  position: relative;
  z-index: 10;
}

#calculator div.input.invalid-input,
#calculator div.input.invalid-input:focus,
#calculator div.input.invalid-input:active,
#calculator div.input.invalid-input:focus-visible {
  border: 2px solid red;
  outline: none;
}

#calculator .input-box .ans {
  position: absolute;
  right: 20px;
  top: 8px;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #70757a;
}

.visibility-hidden {
  visibility: hidden;
}
#calculator div.input {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 95%;
  height: 50px;
  font-size: 32px;
  text-align: right;
  padding: 20px 14px 0 10px;
  margin: auto;
  border: 1px solid #dadce0;
  border-radius: 8px;
  overflow: hidden;
  white-space: nowrap;
}

#calculator div.input:active,
#calculator div.input:focus {
  border: 1px solid #4285f4;
  outline: none;
}

#keys-table {
  width: 100%;
  border-spacing: 5px;
}
#keys-table tbody tr td[colspan="2"] button {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
#keys-table tbody tr td[colspan="2"] button .deg {
  color: #70757a;
}

sup.pow {
  min-width: 12px;
  min-height: 12px;
  border-radius: 2px;
  font-size: 14px;
  margin-bottom: 12px;
  padding: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ans sup.pow {
  font-size: 11px;
}

sup.pow.empty {
  border: 1px solid lightsteelblue;
}

#calculator button {
  width: 85px;
  height: 36px;
  background: #dadce0;
  border: 1px solid #dadce0;
  color: #202124;
  border-radius: 4px;
  font-size: 14px;
}

#calculator button:active {
  box-shadow: 0 1px 6px rgb(32 33 36 / 28%);
}
#calculator button.light {
  background: #f1f3f4;
  border-color: #f1f3f4;
}
#calculator button.blue {
  color: #fff;
  background: #4285f4;
  border-color: #4285f4;
}

#calculator button.bold {
  font-weight: bold;
}

/* animations and transitions */

.boxin-enter-from,
.boxin-leave-to {
  transform: scale(2) translate(-15px, 2px);
  opacity: 0;
}

.boxin-enter-to,
.boxin-leave-from {
  transform: scale(1) translateY(0, 0);
}

.boxin-enter-active,
.boxin-leave-active {
  transition: transform 0.2s;
  /* transition: position 1s; */
}
</style>
