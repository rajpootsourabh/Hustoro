export default function ActionButton({
  onClick,
  className = "",
  label = "Submit",
  isLoading = false,
  labelClassName = "",
}) {
  const hasBgColor = /\bbg-/.test(className);
  const defaultBg = "bg-[#09655c] hover:bg-[#00756A]";

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`relative flex items-center justify-center text-white rounded-lg shadow-md disabled:opacity-70 transition-all duration-300 ${!hasBgColor ? defaultBg : ""} ${className}`}
    >
      <div className="flex items-center justify-center space-x-1">
        {isLoading ? (
          <>
            <span className="dot animate-dotPulse" style={{ animationDelay: "0s" }}></span>
            <span className="dot animate-dotPulse" style={{ animationDelay: "0.2s" }}></span>
            <span className="dot animate-dotPulse" style={{ animationDelay: "0.4s" }}></span>
          </>
        ) : (
          <span className={labelClassName}>{label}</span>
        )}
      </div>
    </button>
  );
}
