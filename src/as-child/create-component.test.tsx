import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { createComponent } from "./create-component"

describe("create normal button component", () => {
	const Button = createComponent<
		"button",
		{ variant: "primary" | "secondary"; disabled?: boolean }
	>(
		(
			{ variant, disabled = false, ...buttonProps },
			{ asChild, children, ref },
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
		}),
	)

	it.each([
		// as button
		{ name: "primary button", ui: <Button variant="primary">Click me</Button> },
		{
			name: "secondary button",
			ui: <Button variant="secondary">Click me</Button>,
		},
		{
			name: "disabled button",
			ui: (
				<Button variant="primary" disabled>
					Click me
				</Button>
			),
		},

		// as link
		{
			name: "button as link",
			ui: (
				<Button asChild variant="primary">
					<a href="...">link</a>
				</Button>
			),
		},
		{
			name: "button as disabled link",
			ui: (
				<Button asChild variant="primary" disabled>
					<a href="...">link</a>
				</Button>
			),
		},
	])("$name", ({ ui }) => {
		const { asFragment } = render(ui)

		expect(asFragment()).toMatchSnapshot()
	})
})

describe("create button component with decoration props(outer, inner, ...)", () => {
	const Button = createComponent<
		"button",
		{ variant: "primary" | "secondary"; disabled?: boolean }
	>(
		(
			{ variant, disabled = false, ...buttonProps },
			{ asChild, children, ref },
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
			outer: ({children}) => <div className="outer">{children}</div>,
			inner: ({children}) => <div className="inner">{children}</div>,
			preChildren: <><span className="pre1">pre1</span><span className="pre2">pre2</span></>,
		 	postChildren: <><span className="post1">post1</span><span className="post2">post2</span></>,
		}),
	)

	it.each([
		{ name: "primary button", ui: <Button variant="primary">Click me</Button> },
		{
			name: "button as link",
			ui: (
				<Button asChild variant="primary">
					<a href="...">link</a>
				</Button>
			),
		},
	])("$name", ({ ui }) => {
		const { asFragment } = render(ui)

		expect(asFragment()).toMatchSnapshot()
	})
})
