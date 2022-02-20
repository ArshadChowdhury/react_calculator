// importing components, hook & css
import { useReducer } from "react";
import DigitButtons from "./DigitButtons";
import OperationButtons from "./OperationButtons";
import "./styles.css";


// Defining the Actions here
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

// This is the function that gets passed in useReducer below
function reducer(state, { type, payload }) {
  // Switch statement to determine cases & actions
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      // this If statement checks if the calculator only has 0 currently & if it on;y has 0, it doesn't let you add more 0's
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      // this If statement makes sure to not add multiple . in the beginning or later
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      // if other If statements doesn't apply to it thn here it returns updated state with new digit
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
      // this part of the code helps to choose operations of the calculator.
    case ACTIONS.CHOOSE_OPERATION:
      // here if the current state is null or previous operand is null just return the state as it is, can't add only operation symbols
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      // if the user mistakenly puts a wrong operation in it'll overwrite the operation symbol here
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      // this part makes the previous operand as current operand also adds the operation symbol
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      // when we're entering a new digit, the previous two digits need to be calculated & displayed as previous operand, this part handles that
      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation,
      };
    // this is the all clear (AC) button's action pressing it will return empty object by clearing everything
    case ACTIONS.CLEAR:
      return {};
    // this part is for deleting the last digit from the current operand
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        };
      }
      // if current operand is null then the delete button will return state so basically do nothing
      if (state.currentOperand == null) return state;
      // but if it has 1 digit in there it'll set to null
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      // .slice function to clear the last digit from current operand
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    // this is the action call of = from the calculator
    case ACTIONS.EVALUATE:
      // if the state operation,current,previous operand is null return state( do nothing )
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      // if it's not null overwrite previous states & set operation and prev,current operand to null
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        currentOperand: evaluate(state),
        operation: null,
      };
  }
}
// this part does the calculation
function evaluate({ currentOperand, previousOperand, operation }) {
  // everything were passed as a string previously now we're making them integer here
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  // checking whether if operands are number or not if not there'll be no calculation
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  // another switch statement to calculate as per different operation symbol selected
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }

  return computation.toString();
}
// adding , after 3 digits to make it easier to count
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer);
  }

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  // defining hook at the top of the main function component
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <>
      <div className="description">
        Hello Everyone, I'm Arshad, I built this react calculator from scratch
        with Math Logic built here, no libraries to handle the calculation.{" "}
        <br />
        <a href="https://github.com/ArshadChowdhury/react_calculator">
          See The Code On Github
        </a>
      </div>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {formatOperand(previousOperand)} {operation}
          </div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
          DEL
        </button>
        <OperationButtons operation="÷" dispatch={dispatch} />
        <DigitButtons digit="1" dispatch={dispatch} />
        <DigitButtons digit="2" dispatch={dispatch} />
        <DigitButtons digit="3" dispatch={dispatch} />
        <OperationButtons operation="*" dispatch={dispatch} />
        <DigitButtons digit="4" dispatch={dispatch} />
        <DigitButtons digit="5" dispatch={dispatch} />
        <DigitButtons digit="6" dispatch={dispatch} />
        <OperationButtons operation="+" dispatch={dispatch} />
        <DigitButtons digit="7" dispatch={dispatch} />
        <DigitButtons digit="8" dispatch={dispatch} />
        <DigitButtons digit="9" dispatch={dispatch} />
        <OperationButtons operation="-" dispatch={dispatch} />
        <DigitButtons digit="." dispatch={dispatch} />
        <DigitButtons digit="0" dispatch={dispatch} />
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </>
  );
}

export default App;
