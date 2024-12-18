import React, { useReducer } from "react";
import "./App.css";
import DigitbButton from "./DigitbButton";
import OperationButtton from "./OperationButtton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OP: "choose-op",
  CLEAR: "clear",
  DELETE: "delete",
  EVALUATE: "evaluate",
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;

  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.override) {
        return {
          ...state,
          cur: payload.digit,
          override: false,
        };
      }

      if (payload.digit === "0" && state.cur === "0") return state;

      if (payload.digit === "." && (state.cur || "").includes("."))
        return state;

      return {
        ...state,
        cur: `${state.cur || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OP:
      if (state.cur == null && state.prev == null) return state;

      if (state.prev == null) {
        return {
          ...state,
          op: payload.Operation,
          prev: state.cur,
          cur: null,
        };
      }
      if (state.prev != null && state.op != null && state.cur == null)
        return state;

      return {
        ...state,
        prev: evaluate(state.prev, state.cur, state.op),
        op: payload.Operation,
        cur: null,
      };

    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if (state.cur == null || state.prev == null || state.op == null)
        return state;
      return {
        ...state,
        cur: evaluate(state.cur, state.prev, state.op),
        prev: null,
        op: null,
        override: true,
      };

    case ACTIONS.DELETE:
      if (state.override)
        return {
          ...state,
          cur: null,
          override: false,
        };

      if (state.cur == null) return state;

      if (state.cur.length === 1)
        return {
          ...state,
          cur: null,
        };

      return {
        ...state,
        cur: state.cur.slice(0, -1),
      };

    default:
      break;
  }
};

function evaluate(current, previous, op) {
  const cur = parseFloat(current);
  const prev = parseFloat(previous);
  if (isNaN(prev) || isNaN(cur)) {
    return "";
  }
  let result = "";

  switch (op) {
    case "+":
      result = cur + prev;
      break;
    case "*":
      result = cur * prev;
      break;
    case "-":
      result = prev - cur;
      break;
    case "÷":
      result = prev / cur;
      break;
    default:
      return "";
  }
  return result.toString();
}

function App() {
  const [{ cur, prev, op }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-gird">
      <div className="output">
        <div className="prev-operand">
          {formatOperand(prev)}
          {op}
        </div>
        <div className="cur-operand">{formatOperand(cur)} </div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE })}>DEL</button>
      <OperationButtton Operation="÷" dispatch={dispatch} />
      <DigitbButton digit="1" dispatch={dispatch} />
      <DigitbButton digit="2" dispatch={dispatch} />
      <DigitbButton digit="3" dispatch={dispatch} />
      <OperationButtton Operation="*" dispatch={dispatch} />
      <DigitbButton digit="4" dispatch={dispatch} />
      <DigitbButton digit="5" dispatch={dispatch} />
      <DigitbButton digit="6" dispatch={dispatch} />
      <OperationButtton Operation="+" dispatch={dispatch} />
      <DigitbButton digit="7" dispatch={dispatch} />
      <DigitbButton digit="8" dispatch={dispatch} />
      <DigitbButton digit="9" dispatch={dispatch} />
      <OperationButtton Operation="-" dispatch={dispatch} />
      <DigitbButton digit="." dispatch={dispatch} />
      <DigitbButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
