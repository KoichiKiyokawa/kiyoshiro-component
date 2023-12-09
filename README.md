# @kiyoshiro/component

[![CI](https://github.com/KoichiKiyokawa/kiyoshiro-component/actions/workflows/ci.yml/badge.svg)](https://github.com/KoichiKiyokawa/kiyoshiro-component/actions/workflows/ci.yml)

## Install

```bash
npm install @kiyoshiro/component
```

## Usage

### `asChild` pattern

```tsx
import { createComponent } from "@kiyoshiro/component";

// Define Button component
const Button = createComponent<
  "button",
  { variant: "primary" | "secondary"; disabled?: boolean }
>(
  (
    { variant, disabled = false, ...buttonProps },
    { asChild, children, ref }
  ) => ({
    baseElement: asChild ? (
      disabled ? (
        <div />
      ) : (
        children
      )
    ) : (
      <button type="button" ref={ref} disabled={disabled} {...buttonProps} />
    ),

    props: {
      "data-variant": variant,
      className: "button",
      ...(disabled && { "aria-disabled": true }),
    },
  })
);

// Use it
<Button variant="primary">Primary Button</Button>

<Button asChild variant="primary">
  <a href="...">
    Button component as link
  </a>
</Button>
// -> render as child: <a href="..." class="button" data-variant="primary">Button component as link</a>
```
