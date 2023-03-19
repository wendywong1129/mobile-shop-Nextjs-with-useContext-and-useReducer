import Link from "next/link";

export default function DropdownLink({ href, children, ...rest }) {
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
