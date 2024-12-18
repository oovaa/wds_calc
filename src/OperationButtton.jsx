import { ACTIONS } from "./App";
import React from "react";

function OperationButtton({ dispatch, Operation }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OP, payload: { Operation } })
      }
    >
      {Operation}
    </button>
  );
}

export default OperationButtton;
