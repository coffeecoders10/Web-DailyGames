import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "secondary", className, ...props }: ButtonProps) {
  const classes = [styles.button, className].filter(Boolean).join(" ");
  return <button type="button" className={classes} data-variant={variant} {...props} />;
}
