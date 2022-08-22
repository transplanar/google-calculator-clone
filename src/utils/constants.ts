export const parans: Array<string> = ["(", ")"];
export const opMap: Map<string, string> = new Map([
  ["*", "×"],
  ["/", "÷"],
  ["+", "+"],
  ["-", "-"],
  ["%", "%"],
  ["×", "*"],
  ["÷", "/"],
]);

export const operators: Array<string> = [...opMap.keys()];

export const funcMap: Map<string, Array<string>> = new Map([
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

export const funcs: Array<string> = [...funcMap.keys()];

export const constMap: Map<string, Array<string>> = new Map([
  ["p", ["π", "Math.PI"]],
  ["e", ["e", "Math.E"]],
  ["π", ["p", "Math.PI"]],
  ["e", ["e", "Math.E"]],
]);
export const constants: Array<string> = [...constMap.keys()];
