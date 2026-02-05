declare module "react-code-input" {
  import { ComponentType } from "react";

  interface ReactCodeInputProps {
    type?: string;
    fields?: number;
    onChange?: (value: string) => void;
    inputStyle?: React.CSSProperties;
    value?: string;
  }

  const ReactCodeInput: ComponentType<ReactCodeInputProps>;
  export default ReactCodeInput;
}
