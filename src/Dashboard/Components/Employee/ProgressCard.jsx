// ProgressCard.js
const ProgressCard = ({ max = 6, current = 3 }) => {
    const percentage = Math.min(Math.round((current / max) * 100), 100);
    const circumference = 2 * Math.PI * 45; // 45 is the radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
    return (
      <div className="w-64 h-28 bg-teal-700 text-white rounded-lg p-4">
        <h3 className="text-sm font-medium mb-4">Profile progress</h3>
        <div className="flex items-center">
          {/* Circular progress indicator */}
          <div className="relative w-10 h-10 mr-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeOpacity="0.2"
              />
              {/* Progress circle - now in green */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#10B981" // Emerald-500 green color
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          
          {/* Progress text */}
          <div>
            <p className="text-base font-semibold">{percentage}% completed</p>
            <p className="text-xs">{current} out of {max} mandatory fields</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProgressCard;