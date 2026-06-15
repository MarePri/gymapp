interface GlassHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function GlassHeader({ title, subtitle, icon, action }: GlassHeaderProps) {
  return (
    <div className="glass rounded-2xl p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          <h1 className="text-lg font-bold text-white">{title}</h1>
          {subtitle && <p className="text-xs text-gray-400 font-mono">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
