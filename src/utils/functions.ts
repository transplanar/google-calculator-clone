import { operators, constants, funcs, parans } from "./constants";

export const isFactorial = (number: string): boolean => {
  return /^[0-9]+!$/.test(number);
};

export const isEXP = (number: string): boolean => {
  return /^[0-9]+E[0-9]*$/.test(number);
};

export const isOperator = (operator: string): boolean => {
  return operators.includes(operator);
};

export const isConst = (constant: string): boolean => {
  return constants.includes(constant);
};

export const isFunc = (func: string): boolean => {
  return funcs.includes(func);
};

export const isFloat = (number: string): boolean => {
  return /^[0-9]+[.][0-9]*$/.test(number);
};

export const isNumber = (number: string): boolean => {
  return /^[0-9]+$/.test(number);
};

export const isParan = (paran: string): boolean => {
  return parans.includes(paran);
};

export const isPowExp = (exp: string): boolean => {
  return /^[0-9|e]+<sup class="pow [empty]*">[0-9]*<\/sup>|^[0-9]+[.][0-9]*<sup class="pow [empty]*">[0-9]*<\/sup>/.test(
    exp
  );
};

export const calcFactorial = (n: number, memo: Record<string, number> = {}) => {
  if (n == 0) return 1;
  if (n <= 2) return n;

  const result: number = n * calcFactorial(n - 1, memo);

  memo[n] = result;

  return result;
};
