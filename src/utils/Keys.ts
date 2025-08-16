export const KEY_TAB = "Tab";
export const KEY_ESCAPE = "Escape";
export const KEY_BACKSPACE = "Backspace";

export const KEY_ARROW_RIGHT = "ArrowRight";
export const KEY_ARROW_LEFT = "ArrowLeft";
export const KEY_ARROW_UP = "ArrowUp";
export const KEY_ARROW_DOWN = "ArrowDown";

export const ARROW_KEYS = [
  KEY_ARROW_RIGHT,
  KEY_ARROW_LEFT,
  KEY_ARROW_UP,
  KEY_ARROW_DOWN,
] as const;

export const KEYBOARD_KEYS = [
  ...ARROW_KEYS,
  KEY_ESCAPE,
  KEY_BACKSPACE,
] as const;

export type KeyboardKey = typeof KEYBOARD_KEYS[number];

export const isKeyboardKey = (k: string): k is KeyboardKey =>
  (KEYBOARD_KEYS as readonly string[]).includes(k);
