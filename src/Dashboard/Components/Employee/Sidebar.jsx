export default function Sidebar({ sections, activeSection, handleSectionClick }) {
    const formatSectionName = (sectionName) => {
        if (sectionName === "CompensationBenefits") {
            return "Compensation & Benefits";
        }
        return sectionName
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
            .replace(/^./, str => str.toUpperCase());
    };

    return (
        <aside className="hidden lg:block fixed top-18 left-0 w-64 bg-white p-6 border-r h-full overflow-y-auto">
            <h2 className="text-lg mb-4">Profile sections</h2>
            <nav className="flex flex-col gap-2">
                {sections.map((section) => (
                    <button
                        key={section}
                        onClick={() => handleSectionClick(section)}
                        className={`text-left px-4 py-2 rounded text-sm whitespace-nowrap ${
                            activeSection === section
                                ? "bg-teal-700 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {formatSectionName(section)}
                    </button>
                ))}
            </nav>
        </aside>
    );
}