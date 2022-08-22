import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppComponent from "@/App.vue";

describe("AppComponent", () => {
  it("should render the component", () => {
    const wrapper = mount(AppComponent);
    expect(wrapper.find('[data-test-id="calculator"]').exists()).toBe(true);
  });

  it("should write to input on keydown event", async () => {
    const wrapper = mount(AppComponent);
    const input = wrapper.find('[data-test-id="input"]');
    await input.trigger("keydown", { key: "1" });
    expect(input.text()).toBe("1");
  });

  it("should write to input on button click", async () => {
    const wrapper = mount(AppComponent);
    const input = wrapper.find('[data-test-id="input"]');
    await wrapper.find('[data-test-id="1"]').trigger("click");
    expect(input.text()).toBe("1");
  });

  it("should delete the last input on backspace", async () => {
    const wrapper = mount(AppComponent);
    const input = wrapper.find('[data-test-id="input"]');
    await input.trigger("keydown", { key: "2" });
    await input.trigger("keydown", { key: "3" });
    const btn = wrapper.find('[data-test-id="backspace"]');
    await btn.trigger("click");
    expect(input.text()).toBe("");
  });

  it("should invert some controls on invert button click", async () => {
    const wrapper = mount(AppComponent);

    const btn = wrapper.find('[data-test-id="invert"]');
    const sin = wrapper.find('[data-test-id="sin"]');
    const cos = wrapper.find('[data-test-id="cos"]');
    const tan = wrapper.find('[data-test-id="tan"]');
    const ln = wrapper.find('[data-test-id="ln"]');
    const log = wrapper.find('[data-test-id="log"]');
    const sqrt = wrapper.find('[data-test-id="sqrt"]');
    const Ans = wrapper.find('[data-test-id="Ans"]');

    expect(sin.text()).toBe("sin");
    expect(cos.text()).toBe("cos");
    expect(tan.text()).toBe("tan");
    expect(ln.text()).toBe("ln");
    expect(log.text()).toBe("log");
    expect(sqrt.text()).toBe("√");
    expect(Ans.text()).toBe("Ans");
    await btn.trigger("click");
    expect(sin.text()).toBe("sin-1");
    expect(cos.text()).toBe("cos-1");
    expect(tan.text()).toBe("tan-1");
    expect(ln.text()).toBe("ex");
    expect(log.text()).toBe("10x");
    expect(sqrt.text()).toBe("x2");
    expect(Ans.text()).toBe("Rnd");
  });

  it("should have invalid-input class on error", async () => {
    const wrapper = mount(AppComponent);
    const input = wrapper.find('[data-test-id="input"]');
    await wrapper.find('[data-test-id="log"]').trigger("click");
    await wrapper.find('[data-test-id="Enter"]').trigger("click");
    expect(input.classes()).toContain("invalid-input");
  });

  it("should show the ans expression once we have inputs", async () => {
    const wrapper = mount(AppComponent);
    await wrapper.find('[data-test-id="log"]').trigger("click");
    expect(wrapper.find('[data-test-id="expression"]').exists()).toBe(true);
  });
});
