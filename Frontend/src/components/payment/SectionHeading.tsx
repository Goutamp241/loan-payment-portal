export function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded-md bg-primary/8 flex items-center justify-center flex-shrink-0">
        <span className="text-primary">{icon}</span>
      </div>
      <h2 className="text-[13px] font-bold text-foreground">{title}</h2>
    </div>
  );
}
