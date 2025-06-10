

const StatsCard = ({ title, value, loading, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-500 text-lg font-medium">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
