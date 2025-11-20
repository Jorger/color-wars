import { JS_CSS_VARIABLES } from "./constants";
import { setCssVariable } from "./setCssVariable";
import { snakeToKebab } from "./snakeToKebab";

const rootDocument = document.documentElement;

/**
 * Listado de variables css que se crean a partir de las contantes creadas en JS/TS
 */
Object.keys(JS_CSS_VARIABLES).forEach((name) => {
  const snakeNameVariable = snakeToKebab(name);
  const unit = snakeNameVariable.includes("time") ? "ms" : "px";

  setCssVariable(
    rootDocument,
    snakeNameVariable,
    `${JS_CSS_VARIABLES[name]}${unit}`
  );
});
