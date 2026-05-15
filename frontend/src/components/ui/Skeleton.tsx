export const SkeletonCard: React.FC = () => (
  <div className="glass-card rounded-2xl p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <div className="skeleton w-24 h-4" />
        <div className="skeleton w-16 h-8" />
      </div>
      <div className="skeleton w-12 h-12 rounded-xl" />
    </div>
    <div className="skeleton w-full h-2 rounded-full" />
  </div>
);

export const SkeletonStat: React.FC = () => (
  <div className="glass-card rounded-2xl p-6">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="skeleton w-20 h-3" />
        <div className="skeleton w-16 h-8" />
      </div>
      <div className="skeleton w-12 h-12 rounded-xl" />
    </div>
  </div>
);

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton h-4 rounded"
        style={{ width: `${100 - (i % 2) * 20}%` }}
      />
    ))}
  </div>
);
