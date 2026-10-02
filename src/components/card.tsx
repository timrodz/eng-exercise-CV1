// A sample component from the (pretend) design system —
// the one intentionally "designed" element on the page.
// Treat it like a library primitive: compose it or reuse the pattern.
// Not where the exercise problems live; extend it if you have a reason to.
import type { ReactNode } from "react";

type CardProps = {
  label: string;
  value: ReactNode;
  children?: ReactNode;
};

export function Card({ label, value, children }: CardProps) {
  return (
    <div className="card">
      <div className="card-value">{value}</div>
      <div className="card-label">{label}</div>
      {children ? <div className="card-body">{children}</div> : null}
    </div>
  );
}

type CardGridProps = {
  children: ReactNode;
};

/** Three-column layout for composing Card primitives. */
export function CardGrid({ children }: CardGridProps) {
  return <div className="card-grid">{children}</div>;
}
