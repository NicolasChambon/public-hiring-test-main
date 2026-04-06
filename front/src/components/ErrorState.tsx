export default function ErrorState({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="rounded-md bg-red-50 p-4 max-w-md">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
          <p className="text-red-600 text-sm mt-2">
            Make sure your backend is running on localhost:3000
          </p>
        </div>
      </div>
    </div>
  );
}
