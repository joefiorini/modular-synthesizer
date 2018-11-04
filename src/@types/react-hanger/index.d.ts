interface ArrayHook {
  value: Array<any>;
  setValue(arr: Array<any>): void;
  add(item: any): void;
  clear(): void;
  removeIndex(index: number): void;
  removeById(id: number): void;
}

declare module "react-hanger" {
  export function useArray(arr: Array<any>): ArrayHook;
}
