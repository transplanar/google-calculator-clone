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

import { expect, describe, it } from "vitest";

describe("isFactorial", () => {
  it("should only allow integer based expressions", () => {
    expect(isFactorial("7!")).toBe(true);
    expect(isFactorial("5!")).toBe(true);
    expect(isFactorial("0.5!")).toBe(false);
    expect(isFactorial("sdf!")).toBe(false);
  });
});

describe("isEXP", () => {
  it("should only allow exponent expressions", () => {
    expect(isEXP("2E2")).toBe(true);
    expect(isEXP("2E2")).toBe(true);
    expect(isEXP("2.2E2")).toBe(false);
    expect(isEXP("2E2.2")).toBe(false);
    expect(isEXP("2.2E2.2")).toBe(false);
    expect(isEXP("xEf")).toBe(false);
  });
});

describe("isOperator", () => {
  it("should only allow operators", () => {
    expect(isOperator("+")).toBe(true);
    expect(isOperator("-")).toBe(true);
    expect(isOperator("/")).toBe(true);
    expect(isOperator("*")).toBe(true);
    expect(isOperator("%")).toBe(true);
    expect(isOperator("x")).toBe(false);
    expect(isOperator("2")).toBe(false);
    expect(isOperator("E")).toBe(false);
  });
});

describe("isConst", () => {
  it("should only allow constants", () => {
    expect(isConst("e")).toBe(true);
    expect(isConst("π")).toBe(true);
    expect(isConst("p")).toBe(true);
    expect(isConst("s")).toBe(false);
    expect(isConst("x")).toBe(false);
  });
});

describe("isFunc", () => {
  it("should only allow functions", () => {
    expect(isFunc("sin")).toBe(true);
    expect(isFunc("cos")).toBe(true);
    expect(isFunc("tan")).toBe(true);
    expect(isFunc("s")).toBe(true);
    expect(isFunc("c")).toBe(true);
    expect(isFunc("t")).toBe(true);
  });
});

describe("isFloat", () => {
  it("should only allow decimal numbers", () => {
    expect(isFloat("0.23")).toBe(true);
    expect(isFloat("123.23")).toBe(true);
    expect(isFloat("1.0")).toBe(true);
    expect(isFloat("93.12")).toBe(true);
    expect(isFloat("0.")).toBe(true);
    expect(isFloat("2334")).toBe(false);
  });
});

describe("isNumber", () => {
  it("should only allow integers", () => {
    expect(isNumber("23")).toBe(true);
    expect(isNumber("0123")).toBe(true);
    expect(isNumber("1")).toBe(true);
    expect(isNumber("0")).toBe(true);
    expect(isNumber("0.2")).toBe(false);
  });
});

describe("isParan", () => {
  it("should only allow paranthesis", () => {
    expect(isParan("(")).toBe(true);
    expect(isParan(")")).toBe(true);
    expect(isParan("[")).toBe(false);
    expect(isParan("]")).toBe(false);
  });
});

describe("isPowExp", () => {
  it("should only allow power expressions", () => {
    expect(isPowExp('2<sup class="pow ">2</sup>')).toBe(true);
    expect(isPowExp('0.123<sup class="pow "></sup>')).toBe(true);
    expect(isPowExp("2**2")).toBe(false);
    expect(isPowExp('2<sup class="pow ">0.2</sup>')).toBe(false);
  });
});

describe("calcFactorial", () => {
  it("should only allow power expressions", () => {
    expect(calcFactorial(0)).toBe(1);
    expect(calcFactorial(2)).toBe(2);
  });
});
