import Link from "next/link";

export default function DropdownLink({ children, href, ...rest }) {
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
