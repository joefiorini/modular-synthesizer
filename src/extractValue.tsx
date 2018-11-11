import { ChangeEvent } from "react";
import { pipe } from "rambda";

export const extractValue = (fn: (value: string) => void) => (
  e: ChangeEvent<HTMLInputElement>
) => fn(e.currentTarget.value);

interface ExtractNumber {
  (fn: (n: number) => void): void;
}
export const extractNumber = (fn: (n: number) => void) =>
  extractValue(v => fn(Number(v)));
