export default function MobileSidebar({ sections, activeSection, handleSectionClick }) {
    return (
        <div className="lg:hidden bg-white p-4 border-t mt-auto">
            <h2 className="text-lg mb-4">Profile sections</h2>
            <nav className="flex overflow-x-auto gap-2 pb-2">
                {sections.map((section) => (
                    <button
                        key={section}
                        onClick={() => handleSectionClick(section)}
                        className={`whitespace-nowrap px-4 py-2 rounded text-sm ${
                            activeSection === section
                                ? "bg-teal-700 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {section}
                    </button>
                ))}
            </nav>
        </div>
    );
}