import { describe, it, expect, vi } from "vitest";
import { nextTick } from "vue";
import useHandlers from "@/composables/useHandlers";

describe("useHandlers", () => {
  describe("inputs", () => {
    it("should be empty array", () => {
      const { inputs } = useHandlers();
      expect(inputs.value).toEqual([]);
    });
  });

  describe("getLastInput", () => {
    it("should return last input", () => {
      const { inputs, getLastInput } = useHandlers();
      inputs.value = ["1"];
      expect(getLastInput()).toBe("1");
    });
  });

  describe("inputHandler", () => {
    it("should be called and inputs should be updated", () => {
      const handlers = useHandlers();
      const spied = vi.spyOn(handlers, "inputHandler");
      handlers.inputHandler("1");
      expect(spied).toHaveBeenCalled();
      expect(spied).toHaveBeenCalledWith("1");
      expect(handlers.inputs.value).toEqual(["1"]);
    });
  });

  describe("handleNumber", () => {
    it("should enter number in inputs ", () => {
      const { inputs, handleNumber } = useHandlers();
      handleNumber("2");
      expect(inputs.value).toEqual(["2"]);
    });

    it("should concatenate if last input is number, float or exp ", () => {
      const { inputs, handleNumber } = useHandlers();
      inputs.value = ["2"];
      handleNumber("1");
      expect(inputs.value).toEqual(["21"]);

      inputs.value = ["2E"];
      handleNumber("2");
      expect(inputs.value).toEqual(["2E2"]);

      inputs.value = ["0."];
      handleNumber("2");
      expect(inputs.value).toEqual(["0.2"]);
    });

    it("should multiply if last input is constant or ! or ) or Ans", () => {
      const { inputs, handleNumber } = useHandlers();
      inputs.value = ["e"];
      handleNumber("2");
      expect(inputs.value).toEqual(["e", "×", "2"]);

      inputs.value = ["7!"];
      handleNumber("2");
      expect(inputs.value).toEqual(["7!", "×", "2"]);

      inputs.value = [")"];
      handleNumber("2");
      expect(inputs.value).toEqual([")", "×", "2"]);

      inputs.value = ["Ans"];
      handleNumber("2");
      expect(inputs.value).toEqual(["Ans", "×", "2"]);
    });

    it("should merge in power if last input is power expression", () => {
      const { inputs, handleNumber } = useHandlers();
      inputs.value = ['2<sup class="pow empty"></sup>'];
      handleNumber("6");
      expect(inputs.value).toEqual(['2<sup class="pow ">6</sup>']);
    });
  });

  describe("handleOperator", () => {
    it("should only allow - on emtpy input", () => {
      const { inputs, handleOperator } = useHandlers();
      handleOperator("-");
      expect(inputs.value).toEqual(["-"]);
    });

    it("should not update input if last input is operator", () => {
      const { inputs, handleOperator } = useHandlers();
      inputs.value = ["-"];
      handleOperator("+");
      expect(inputs.value).toEqual(["-"]);
    });

    it("should not update input if last input is ( and input is not allowed on empty", () => {
      const { inputs, handleOperator } = useHandlers();
      inputs.value = ["("];
      handleOperator("+");
      expect(inputs.value).toEqual(["("]);
    });

    it("should update input if input not empty and lastInput is not operator", () => {
      const { inputs, handleOperator } = useHandlers();
      inputs.value = ["2"];
      handleOperator("+");
      expect(inputs.value).toEqual(["2", "+"]);
      inputs.value = ["(", "2", ")"];
      handleOperator("-");
      expect(inputs.value).toEqual(["(", "2", ")", "-"]);
    });
  });

  describe("handleFunc", () => {
    it("should update input and add ( on empty input", () => {
      const { inputs, handleFunc } = useHandlers();
      handleFunc("sin");
      expect(inputs.value).toEqual(["sin", "("]);
    });

    it("should update input and multiply if last input is number, constant, ans etc. ", () => {
      const { inputs, handleFunc } = useHandlers();
      inputs.value = ["2"];
      handleFunc("sin");
      expect(inputs.value).toEqual(["2", "×", "sin", "("]);
      inputs.value = ["e"];
      handleFunc("cos");
      expect(inputs.value).toEqual(["e", "×", "cos", "("]);
      inputs.value = ["e"];
      handleFunc("tan");
      expect(inputs.value).toEqual(["e", "×", "tan", "("]);
    });
  });

  describe("handleConst", () => {
    it("should update input and if input is empty", () => {
      const { inputs, handleConst } = useHandlers();
      handleConst("e");
      expect(inputs.value).toEqual(["e"]);
    });

    it("should udpate input and add multiply if not empty and last input is const, number etc", () => {
      const { inputs, handleConst } = useHandlers();
      inputs.value = ["e"];
      handleConst("e");
      expect(inputs.value).toEqual(["e", "×", "e"]);

      inputs.value = ["12"];
      handleConst("e");
      expect(inputs.value).toEqual(["12", "×", "e"]);

      inputs.value = ["0.3"];
      handleConst("e");
      expect(inputs.value).toEqual(["0.3", "×", "e"]);
    });
  });

  describe("handleAnswer", () => {
    it("should add Ans on empty input", () => {
      const { inputs, handleAnswer } = useHandlers();
      handleAnswer();
      expect(inputs.value).toEqual(["Ans"]);
    });

    it("should replace with ans if last input is number", () => {
      const { inputs, handleAnswer } = useHandlers();
      inputs.value = ["12"];
      handleAnswer();
      expect(inputs.value).toEqual(["Ans"]);
    });

    it("should add ans if last input is operator", () => {
      const { inputs, handleAnswer } = useHandlers();
      inputs.value = ["12", "+"];
      handleAnswer();
      expect(inputs.value).toEqual(["12", "+", "Ans"]);
    });

    it("should multiply ans if last input is const, float etc", () => {
      const { inputs, handleAnswer } = useHandlers();
      inputs.value = ["e"];
      handleAnswer();
      expect(inputs.value).toEqual(["e", "×", "Ans"]);
    });
  });

  describe("handleDelete", () => {
    it("should delete last input", () => {
      const { inputs, handleDelete } = useHandlers();
      inputs.value = ["2"];
      handleDelete();
      expect(inputs.value).toEqual([]);
    });
  });

  describe("evaluateResult", () => {
    it("should evaluate result", async () => {
      const { inputs, evaluateResult } = useHandlers();
      inputs.value = ["2", "+", "2"];
      await evaluateResult();
      expect(inputs.value).toEqual(["4"]);
    });

    it("should print error", async () => {
      const { inputs, evaluateResult } = useHandlers();
      inputs.value = ["sin", "("];
      await evaluateResult();
      expect(inputs.value).toEqual(["Error"]);
    });
  });
});
