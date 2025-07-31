export default function TierBadge({ tier }) {
  const tierConfig = {
    free: {
      label: 'Free',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-300'
    },
    silver: {
      label: 'Silver',
      bgColor: 'bg-gray-200',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-400'
    },
    gold: {
      label: 'Gold',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300'
    },
    platinum: {
      label: 'Platinum',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-300'
    }
  };

  const config = tierConfig[tier] || tierConfig.free;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
      {config.label}
    </span>
  );
} 