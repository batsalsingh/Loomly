import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const OrderTrackingTimeline = ({ trackingHistory }) => {
  const statusConfig = {
    Processing: {
      icon: Package,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500',
    },
    Shipped: {
      icon: Truck,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500',
    },
    Delivered: {
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500',
    },
    Cancelled: {
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500',
    },
  };

  // Sort tracking history by timestamp
  const sortedHistory = [...(trackingHistory || [])].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  if (!sortedHistory || sortedHistory.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-6">Order Tracking</h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700"></div>

        {/* Timeline items */}
        <div className="space-y-8">
          {sortedHistory.map((entry, index) => {
            const config = statusConfig[entry.status] || statusConfig.Processing;
            const Icon = config.icon;
            const isLatest = index === sortedHistory.length - 1;

            return (
              <div key={index} className="relative flex items-start">
                {/* Icon circle */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full border-2 ${config.borderColor} ${config.bgColor} flex items-center justify-center z-10 ${isLatest ? 'ring-4 ring-gray-800' : ''}`}
                >
                  <Icon className={config.color} size={24} />
                </div>

                {/* Content */}
                <div className="ml-6 flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-bold text-lg ${config.color}`}>
                      {entry.status}
                    </h3>
                    <span className="text-sm text-gray-400">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-gray-300 mt-1">{entry.note}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingTimeline;
