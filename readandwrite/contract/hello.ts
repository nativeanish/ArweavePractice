declare const ContractError: any;
export interface helloState {
  text: string;
}
interface helloAction {
  input: helloInput;
}
interface helloInput {
  function: "set";
  text: string;
}
export function handle(
  state: helloState,
  action: helloAction
): { state: helloState } {
  if (action.input.function == "set") {
    state.text = action.input.text;
  } else {
    throw new ContractError("Wrong function called");
  }
  return { state };
}
