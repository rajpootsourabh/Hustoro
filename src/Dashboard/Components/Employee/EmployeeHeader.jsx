import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

const EmployeeHeader = ({ employee }) => {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center space-x-6">
                <img
                    src={employee?.profile_image}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                />
                <div className="text-sm">
                    <h2 className="text-lg font-semibold">
                        {employee?.last_name}, {employee?.first_name}
                    </h2>
                    <p className="text-xs text-gray-600">
                        {employee?.job_detail?.job_title
                            ? `${employee.job_detail.job_title} (${employee.job_detail.employment_type || 'N/A'})`
                            : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600">
                        {employee?.job_detail?.entity || 'N/A'}
                    </p>
                    <div className="mt-3 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <EnvelopeIcon className="w-4 h-4 text-gray-600" />
                            <span className="text-xs">{employee?.work_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <PhoneIcon className="w-4 h-4 text-gray-600" />
                            <span className="text-xs">{employee?.phone}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative">
                <button className="text-sm border px-4 py-[3px] rounded-2xl">Actions</button>
                <p className="text-xs text-gray-500 mt-1 text-center">Updates (0)</p>
            </div>
        </div>
    );
};

export default EmployeeHeader;
