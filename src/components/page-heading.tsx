type PageHeadingProps = {
  title: string;
  description?: string;
};

export function PageHeading({ title, description }: PageHeadingProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
