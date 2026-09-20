export default function CategoryHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-steel-200 bg-steel-50">
      <div className="container-wrap py-12">
        <p className="label-eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-steel-600">{description}</p>
      </div>
    </div>
  );
}
