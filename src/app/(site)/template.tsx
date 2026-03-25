export default function SiteTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="magazine-page-enter">{children}</div>;
}
