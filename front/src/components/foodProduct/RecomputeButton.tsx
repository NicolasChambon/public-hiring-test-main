import RefreshIcon from "@/components/icons/RefreshIcon";

interface RecomputeButtonProps {
  onClick: () => void;
}

export default function RecomputeButton({ onClick }: RecomputeButtonProps) {
  return (
    <button
      onClick={onClick}
      title="Recompute carbon footprint"
      className="inline-flex items-center justify-center w-7 h-7 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
    >
      <RefreshIcon className="h-4 w-4" />
    </button>
  );
}
