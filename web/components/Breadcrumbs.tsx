import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs">
      {items.map((item, i) => (
        <span key={i}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
          {i < items.length - 1 && <span>/</span>}
        </span>
      ))}
    </nav>
  );
}
