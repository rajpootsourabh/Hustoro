import { Trash2, Copy, CornerUpRight, Tag, Mail, MessageSquare, Play, Headphones, Hand, RotateCcw } from "lucide-react";

export default function BottomCommandBar({ selectedCandidateIds = [], onCommandClick }) {
    const count = selectedCandidateIds.length;

    const actionItems = [
        { icon: Trash2, label: "Trash", action: "delete" },
        { icon: Copy, label: "Copy", action: "copy" },
        { icon: CornerUpRight, label: "Move Up", action: "moveUp" },
        { icon: Tag, label: "Tag", action: "tag" },
        { icon: Mail, label: "Mail", action: "mail" },
        { icon: MessageSquare, label: "Message", action: "message" },
        { icon: Play, label: "Play", action: "play" },
        { icon: Headphones, label: "Listen", action: "listen" },
        { icon: Hand, label: "Disqualify", action: "disqualify", className: "text-red-500" },
        { icon: RotateCcw, label: "Rotate", action: "rotate" },
    ]

    const handleClick = (action) => {
        if (onCommandClick && typeof onCommandClick === "function") {
            onCommandClick(action, selectedCandidateIds);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-[#2E3840] text-white z-50 border-t border-gray-700 shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                {/* Count (Visible on wide screens) */}
                <div className="w-auto bg-green-500 text-white font-semibold px-3 py-1 rounded-md text-sm flex-shrink-0 sm:block hidden">
                    {count}
                </div>

                {/* Icons and small screen count */}
                <div className="flex flex-wrap items-center justify-center text-white text-sm gap-1 sm:gap-4">

                    {/* Count on small screens */}
                    <div className="w-auto bg-green-500 text-white font-semibold px-3 py-1 rounded-md text-sm flex-shrink-0 sm:hidden block">
                        {count}
                    </div>

                    {/* Action buttons */}
                    {actionItems.map(({ icon: Icon, label, action, className }) => (
                        <button
                            key={action}
                            onClick={() => handleClick(action)}
                            className="flex items-center justify-center p-2 rounded-md hover:bg-white hover:text-[#2E3840] transition"
                            aria-label={label}
                        >
                            <Icon className={`w-5 h-5 ${className || ""}`} />
                        </button>
                    ))}

                </div>

                {/* CTA Button */}
                <button
                    onClick={() => handleClick("nextStage")}
                    className="border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#2E3840] transition text-sm font-medium whitespace-nowrap"
                >
                    Move to next stage
                </button>
            </div>
        </div>
    );
}
