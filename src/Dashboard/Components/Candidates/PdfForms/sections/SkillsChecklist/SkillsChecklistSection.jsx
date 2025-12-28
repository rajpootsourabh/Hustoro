import React from 'react';

const SkillsChecklistSection = ({ formData, skillsData, onInputChange, onSkillRatingChange, getSelectedColumn }) => {
  const ratingOptions = [
    { value: 0, label: "1 - Very Experienced" },
    { value: 1, label: "2 - Moderate Experience" },
    { value: 2, label: "3 - No Experience" },
    { value: 3, label: "4 - Do Not Want to Perform" }
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-6">Skills Checklist</h3>
      
      <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2">
        {skillsData.map((sectionData) => (
          <div key={sectionData.section} className="border rounded-lg p-4">
            <h4 className="font-semibold text-blue-600 mb-4">
              {sectionData.title} 
            </h4>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left font-medium text-gray-700 min-w-[200px]">Skill</th>
                    <th className="border p-2 text-center font-medium text-gray-700">1 - Very Experienced</th>
                    <th className="border p-2 text-center font-medium text-gray-700">2 - Moderate Experience</th>
                    <th className="border p-2 text-center font-medium text-gray-700">3 - No Experience</th>
                    <th className="border p-2 text-center font-medium text-gray-700">4 - Do Not Want</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionData.skills.map((skill, skillIndex) => {
                    const selectedColumn = getSelectedColumn(sectionData.section, skillIndex);
                    
                    return (
                      <tr key={`${sectionData.section}-${skillIndex}`} className="hover:bg-gray-50">
                        <td className="border p-2 font-medium text-gray-700">
                          <div className="flex items-center">
                            <span>{skill}</span>
                          </div>
                        </td>
                        {[0, 1, 2, 3].map((colIndex) => (
                          <td key={colIndex} className="border p-2 text-center">
                            <input
                              type="radio"
                              name={`skill-${sectionData.section}-${skillIndex}`}
                              checked={selectedColumn === colIndex}
                              onChange={() => {
                                console.log(`Selecting: Section ${sectionData.section}, Skill ${skillIndex}, Column ${colIndex}`);
                                onSkillRatingChange(sectionData.section, skillIndex, colIndex);
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              {ratingOptions.map((option) => (
                <div key={option.value} className="flex items-center text-sm">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    option.value === 0 ? 'bg-green-500' :
                    option.value === 1 ? 'bg-yellow-500' :
                    option.value === 2 ? 'bg-red-500' :
                    'bg-gray-500'
                  }`} />
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
            
            {/* Debug info for this section
            <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
              <p className="font-medium">Field pattern for this section:</p>
              <p className="text-gray-600">
                {sectionData.section}.{1}.0 to {sectionData.section}.{4}.{sectionData.skills.length - 1}
              </p>
            </div> */}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-blue-50 rounded-md">
        <h4 className="font-medium text-blue-700 mb-2">Instructions:</h4>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Select ONE rating for each skill (1-4)</li>
          <li>• Rating 1: Very Experienced - You have significant experience with this skill</li>
          <li>• Rating 2: Moderate Experience - You have some experience but may need guidance</li>
          <li>• Rating 3: No Experience - You have no experience with this skill</li>
          <li>• Rating 4: Do Not Want to Perform - You prefer not to perform this task</li>
          <li>• CNA & PA2 Candidates: Complete all sections</li>
          <li>• PA1 & Chore Candidates: Complete sections 1-4 only</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillsChecklistSection;