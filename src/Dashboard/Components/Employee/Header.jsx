export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm px-6">
            <div className="max-w-7xl mx-auto py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl">Edit profile</h1>
                    <p className="text-gray-500 text-xs">
                        h, h5ty [Draft] -  y6
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-sm text-gray-500 hover:underline">
                        Cancel
                    </button>
                    <button className="border border-teal-700 text-teal-700 rounded px-4 py-2 hover:bg-teal-50 text-sm">
                        Save as draft and exit
                    </button>
                    <button className="bg-teal-700 text-white rounded px-6 py-2 hover:bg-teal-800 text-sm">
                        Publish
                    </button>
                </div>
            </div>
        </header>
    );
}