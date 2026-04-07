export default function ProgressBar({
  amount,
  total,
}: {
  amount: number;
  total: number;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <div className="w-16 bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-green-500 h-1.5 rounded-full"
          style={{
            width: `${(amount / total) * 100}%`,
          }}
        />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">
        {((amount / total) * 100).toFixed(0)}%
      </span>
    </div>
  );
}
