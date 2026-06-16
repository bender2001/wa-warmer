"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type TextFieldOwnProps = {
  label: string
  variant?: "outlined" | "filled"
  supportingText?: React.ReactNode
  error?: boolean
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  /** render a multi-line field (textarea) instead of a single-line input */
  multiline?: boolean
  containerClassName?: string
}

type TextFieldProps = TextFieldOwnProps &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement> &
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "size"
  >

/**
 * Material 3 (Expressive) text field — floating label that animates from the
 * resting position into the label slot, a notched outline (outlined variant)
 * or bottom active indicator (filled variant), optional leading/trailing icons,
 * supporting text, and error state. Replaces the plain Input/Textarea + Label.
 *
 * The label rests inside the field only while it is empty AND unfocused
 * (`:placeholder-shown:not(:focus)`); otherwise it floats. The input always
 * carries a placeholder (a single space if none is given) to drive that state.
 */
function TextField({
  label,
  variant = "outlined",
  supportingText,
  error = false,
  leadingIcon,
  trailingIcon,
  multiline = false,
  containerClassName,
  className,
  id,
  placeholder,
  rows,
  disabled,
  ...props
}: TextFieldProps) {
  const reactId = React.useId()
  const fieldId = id ?? reactId
  const supportId = supportingText ? `${fieldId}-support` : undefined

  const fieldClasses = cn(
    "peer w-full bg-transparent md-body-large text-on-surface outline-none",
    "placeholder:text-transparent focus:placeholder:text-on-surface-variant",
    "[caret-color:var(--md-primary)] disabled:cursor-not-allowed disabled:text-on-surface/40",
    leadingIcon ? "pl-12" : "pl-4",
    trailingIcon ? "pr-12" : "pr-4",
    variant === "filled"
      ? multiline
        ? "block min-h-[7rem] resize-y pt-6 pb-2"
        : "h-14 pt-4 pb-1"
      : multiline
        ? "block min-h-[7rem] resize-y py-4"
        : "h-14 py-0",
    className,
  )

  const commonFieldProps = {
    id: fieldId,
    placeholder: placeholder ?? " ",
    disabled,
    "aria-describedby": supportId,
    "aria-invalid": error || undefined,
    className: fieldClasses,
  }

  const field = multiline ? (
    <textarea
      rows={rows ?? 4}
      {...commonFieldProps}
      {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
    />
  ) : (
    <input
      {...commonFieldProps}
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  )

  // vertical center of the input box differs by variant (outlined wrapper has pt-2)
  const iconTop = variant === "filled" ? "top-7" : "top-9"
  const icon = (node: React.ReactNode, side: "left" | "right") =>
    node ? (
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-10 -translate-y-1/2 text-on-surface-variant [&>svg]:size-6",
          iconTop,
          side === "left" ? "left-3.5" : "right-3.5",
        )}
      >
        {node}
      </span>
    ) : null

  // The floating <label>. Default classes = floated; the peer-variant classes
  // pull it back to the resting position only while empty AND unfocused.
  const labelEl = (
    <label
      htmlFor={fieldId}
      className={cn(
        "pointer-events-none absolute left-[14px] z-10 origin-top-left px-1 md-body-small transition-all duration-200",
        error
          ? "text-error peer-focus:text-error"
          : "text-on-surface-variant peer-focus:text-primary",
        // floated vertical position differs by variant
        variant === "filled" ? "top-2 -translate-y-0" : "top-2 -translate-y-1/2",
        // resting position (empty + unfocused) — grows to body-large, drops in
        "peer-[:placeholder-shown:not(:focus)]:md-body-large",
        variant === "filled"
          ? "peer-[:placeholder-shown:not(:focus)]:top-1/2 peer-[:placeholder-shown:not(:focus)]:-translate-y-1/2"
          : multiline
            ? "peer-[:placeholder-shown:not(:focus)]:top-6 peer-[:placeholder-shown:not(:focus)]:translate-y-0"
            : "peer-[:placeholder-shown:not(:focus)]:top-[2.25rem]",
        leadingIcon && "peer-[:placeholder-shown:not(:focus)]:left-12",
        disabled && "text-on-surface/40 peer-focus:text-on-surface/40",
      )}
    >
      {label}
    </label>
  )

  const support = supportingText ? (
    <p
      id={supportId}
      className={cn(
        "mt-1 px-4 md-body-small",
        error ? "text-error" : "text-on-surface-variant",
      )}
    >
      {supportingText}
    </p>
  ) : null

  if (variant === "filled") {
    return (
      <div className={cn("group", containerClassName)}>
        <div
          className={cn(
            "relative rounded-t-[var(--radius-xs)] bg-surface-container-highest",
            "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-outline after:transition-all",
            "focus-within:after:h-0.5 focus-within:after:bg-primary",
            error && "after:bg-error focus-within:after:bg-error",
            disabled && "opacity-60",
          )}
        >
          {icon(leadingIcon, "left")}
          {field}
          {icon(trailingIcon, "right")}
          {labelEl}
        </div>
        {support}
      </div>
    )
  }

  // outlined (default) — notched outline via fieldset/legend
  return (
    <div className={cn("group", containerClassName)}>
      <div className={cn("relative pt-2", disabled && "opacity-60")}>
        {icon(leadingIcon, "left")}
        {field}
        {icon(trailingIcon, "right")}
        <fieldset
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 top-2 m-0 rounded-[var(--radius-xs)] border border-outline px-3 transition-colors",
            "peer-hover:border-on-surface peer-focus:border-2 peer-focus:border-primary",
            error && "border-error peer-hover:border-error peer-focus:border-error",
          )}
        >
          <legend
            className={cn(
              "invisible h-0 max-w-full overflow-hidden whitespace-nowrap px-1 md-body-small transition-all duration-200",
              "peer-[:placeholder-shown:not(:focus)]:max-w-[0.01px] peer-[:placeholder-shown:not(:focus)]:px-0",
            )}
          >
            <span>{label}</span>
          </legend>
        </fieldset>
        {labelEl}
      </div>
      {support}
    </div>
  )
}

export { TextField }
export type { TextFieldProps }
