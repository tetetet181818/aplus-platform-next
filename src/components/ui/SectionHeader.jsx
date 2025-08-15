export default function SectionHeader({ title, description }) {
  return (
    <div>
      <h2 className="sm:text-3xl text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
        {title}
      </h2>
      <p className="text-muted-foreground sm:text-lg text-sm mt-2">
        {description}
      </p>
    </div>
  );
}
