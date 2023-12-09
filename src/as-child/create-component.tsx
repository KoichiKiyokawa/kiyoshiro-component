import React, { cloneElement, forwardRef, isValidElement } from "react"

type Options<E extends keyof React.JSX.IntrinsicElements> = {
	baseElement: React.ReactElement
	props: React.ComponentPropsWithoutRef<E>
	preChildren?: React.ReactElement
	postChildren?: React.ReactElement
	outer?: React.FC<React.PropsWithChildren>
	inner?: React.FC<React.PropsWithChildren>
}

type ComponentProps<E extends keyof React.JSX.IntrinsicElements, P> = P &
	(
		| { asChild: true; children: React.ReactElement }
		| ({ asChild?: false } & React.ComponentPropsWithRef<E>)
	)

export function createComponent<E extends keyof React.JSX.IntrinsicElements, P>(
	builder: (
		props: P & React.ComponentPropsWithoutRef<E>,
		info: {
			ref: React.ComponentPropsWithRef<E>["ref"]
		} & (
			| { asChild: true; children: React.ReactElement }
			| { asChild: false; children: React.ReactNode }
		),
	) => Options<E>,
) {
	return forwardRef(
		(
			{ asChild = false, children, ...restProps }: ComponentProps<E, P>,
			ref: React.ComponentPropsWithRef<E>["ref"],
		) => {
			const { baseElement, props, outer, inner, preChildren, postChildren } =
				// @ts-ignore
				builder(restProps, { asChild, children, ref })

			const mainChildElements = (
				<>
					{preChildren}
					{asChild && isValidElement(children) ? children.props.children : children}
					{postChildren}
				</>
			)

			const clonedElement = cloneElement(
				baseElement,
				props,
				inner ? inner({ children: mainChildElements }) : mainChildElements,
			)

			return outer ? outer({ children: clonedElement }) : clonedElement
		},
	) as React.FC<ComponentProps<E, P>>
}
