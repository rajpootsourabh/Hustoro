const EmployeeTabs = ({ mainTab, setMainTab, subTab, setSubTab }) => {
  const tabs = ['Information', 'Associated Candidates', 'Time Off'];

  const infoSubTabs = [
    'Personal',
    'Job',
    'Compensation & Benefits',
    'Legal Documents',
    'Experience',
    'Emergency'
  ];

  const timeOffSubTabs = ['Balance', 'Upcoming', 'History'];

  return (
    <div className="border-b px-6 pt-4 pb-2">
      <div className="flex space-x-6 text-sm font-medium">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 ${
              mainTab === tab ? 'text-teal-700 border-b-2 border-teal-700' : 'text-gray-500'
            }`}
            onClick={() => {
              setMainTab(tab);
              // Reset subTab when switching mainTab
              if (tab === 'Information') {
                setSubTab('Personal');
              } else if (tab === 'Time Off') {
                setSubTab('Balance');
              } else {
                setSubTab('');
              }
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {mainTab === 'Information' && (
        <div className="flex space-x-6 text-sm font-medium mt-4">
          {infoSubTabs.map((tab) => (
            <button
              key={tab}
              className={`pb-2 ${
                subTab === tab ? 'text-teal-700 border-b-2 border-teal-700' : 'text-gray-500'
              }`}
              onClick={() => setSubTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {mainTab === 'Time Off' && (
        <div className="flex space-x-6 text-sm font-medium mt-4">
          {timeOffSubTabs.map((tab) => (
            <button
              key={tab}
              className={`pb-2 ${
                subTab === tab ? 'text-teal-700 border-b-2 border-teal-700' : 'text-gray-500'
              }`}
              onClick={() => setSubTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeTabs;
