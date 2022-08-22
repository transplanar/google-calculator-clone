<script setup lang="ts">
import useHandlers from "./composables/useHandlers";

const { isInvalidInput, inputs, expression, isInv, inputHandler } =
  useHandlers();
</script>

<template>
  <div id="calculator" data-test-id="calculator">
    <div class="input-box">
      <transition name="boxin">
        <div
          data-test-id="expression"
          class="ans"
          v-if="inputs.length"
          v-html="expression"
        ></div>
      </transition>
      <div
        id="input"
        class="input"
        data-test-id="input"
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
            <button data-test-id="backspace" @click="inputHandler('Backspace')">
              AC
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button data-test-id="invert" @click="isInv = !isInv">Inv</button>
          </td>
          <td>
            <button
              data-test-id="sin"
              v-html="isInv ? 'sin<sup>-1</sup>' : 'sin'"
              @click="isInv ? inputHandler('arcsin') : inputHandler('s')"
            ></button>
          </td>
          <td>
            <button
              data-test-id="ln"
              v-html="isInv ? 'e<sup>x</sup>' : 'ln'"
              @click="isInv ? inputHandler('e**') : inputHandler('n')"
            ></button>
          </td>
          <td>
            <button data-test-id="7" class="light" @click="inputHandler('7')">
              7
            </button>
          </td>
          <td>
            <button data-test-id="8" class="light" @click="inputHandler('8')">
              8
            </button>
          </td>
          <td>
            <button data-test-id="9" class="light" @click="inputHandler('9')">
              9
            </button>
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
            <button
              data-test-id="cos"
              v-html="isInv ? 'cos<sup>-1</sup>' : 'cos'"
              @click="isInv ? inputHandler('arccos') : inputHandler('c')"
            ></button>
          </td>
          <td>
            <button
              data-test-id="log"
              v-html="isInv ? '10<sup>x</sup>' : 'log'"
              @click="isInv ? inputHandler('10**') : inputHandler('l')"
            ></button>
          </td>
          <td>
            <button data-test-id="4" class="light" @click="inputHandler('4')">
              4
            </button>
          </td>
          <td>
            <button data-test-id="5" class="light" @click="inputHandler('5')">
              5
            </button>
          </td>
          <td>
            <button data-test-id="6" class="light" @click="inputHandler('6')">
              6
            </button>
          </td>
          <td>
            <button @click="inputHandler('*')">×</button>
          </td>
        </tr>
        <tr>
          <td><button @click="inputHandler('e')">e</button></td>
          <td>
            <button
              data-test-id="tan"
              v-html="isInv ? 'tan<sup>-1</sup>' : 'tan'"
              @click="isInv ? inputHandler('arctan') : inputHandler('t')"
            ></button>
          </td>
          <td>
            <button
              data-test-id="sqrt"
              v-html="isInv ? 'x<sup>2</sup>' : '√'"
              @click="isInv ? inputHandler('x**') : inputHandler('q')"
            ></button>
          </td>
          <td>
            <button data-test-id="1" class="light" @click="inputHandler('1')">
              1
            </button>
          </td>
          <td>
            <button data-test-id="2" class="light" @click="inputHandler('2')">
              2
            </button>
          </td>
          <td>
            <button data-test-id="3" class="light" @click="inputHandler('3')">
              3
            </button>
          </td>
          <td>
            <button @click="inputHandler('-')">−</button>
          </td>
        </tr>
        <tr>
          <td>
            <button
              data-test-id="Ans"
              v-html="isInv ? 'Rnd' : 'Ans'"
              @click="isInv ? inputHandler('rnd') : inputHandler('ans')"
            ></button>
          </td>
          <td>
            <button @click="inputHandler('E')">EXP</button>
          </td>
          <td>
            <button @click="inputHandler('**')">x<sup>y</sup></button>
          </td>
          <td>
            <button data-test-id="0" class="light" @click="inputHandler('0')">
              0
            </button>
          </td>
          <td>
            <button data-test-id="." class="light" @click="inputHandler('.')">
              .
            </button>
          </td>
          <td>
            <button
              data-test-id="Enter"
              class="blue bold"
              @click="inputHandler('Enter')"
            >
              =
            </button>
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
