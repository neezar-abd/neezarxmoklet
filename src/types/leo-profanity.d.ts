declare module 'leo-profanity' {
  export function clean(text: string, char?: string): string;
  export function check(text: string): boolean;
  export function list(): string[];
  export function add(words: string | string[]): void;
  export function remove(words: string | string[]): void;
  export function reset(): void;
  export function clearList(): void;
  export function getDictionary(): string[];
}
