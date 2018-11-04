import { ChangeEvent } from "react";
export const extractValue = (fn: Function) => (
  e: ChangeEvent<HTMLInputElement>
) => fn(e.currentTarget.value);
