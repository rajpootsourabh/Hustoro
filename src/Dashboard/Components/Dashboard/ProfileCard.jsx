import React from "react";

const teammates = [
  {
    name: "Kshelrin Justice",
    title: "VP of HR",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    name: "Laura Smith",
    title: "HR Specialist",
    image: "https://randomuser.me/api/portraits/women/51.jpg",
  },
  {
    name: "John Doe",
    title: "Talent Acquisition",
    image: "https://randomuser.me/api/portraits/men/70.jpg",
  },
  {
    name: "Emily Stone",
    title: "Recruiter",
    image: "https://randomuser.me/api/portraits/women/60.jpg",
  },
  {
    name: "Emily Stone",
    title: "Recruiter",
    image: "https://randomuser.me/api/portraits/women/60.jpg",
  },
  {
    name: "Emily Stone",
    title: "Recruiter",
    image: "https://randomuser.me/api/portraits/women/60.jpg",
  },
  {
    name: "Emily Stone",
    title: "Recruiter",
    image: "https://randomuser.me/api/portraits/women/60.jpg",
  },
  // Add more teammates as needed
];

const ProfileCard = () => {
  return (
    <div className="bg-[#007A6E] text-white rounded-2xl shadow p-6 space-y-5 w-full max-w-sm mx-auto">
      <div className="w-16 h-16 rounded-full bg-white text-[#007A6E] text-xl font-bold flex items-center justify-center mx-auto">
        VA
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-medium leading-tight">
          Scrum Master, Azure<br />
          Devops, Power BI
        </p>
        <p className="font-semibold text-sm">HR Generalist</p>
        <p className="text-xs text-white/70 leading-tight">
          US Entity | Boston Massachusetts,<br />
          United States | Boston HQ
        </p>
      </div>

      <div className="bg-[#00B5A0] p-3 rounded-xl space-y-2">
        <p className="text-sm font-semibold text-white">HR Manager</p>
        <div className="flex items-center gap-3">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Manager"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold text-white">Will Luz</p>
            <p className="text-xs text-white/70">CHRO</p>
          </div>
        </div>
      </div>

      <div className="bg-[#00B5A0] p-3 rounded-xl space-y-2">
        <p className="text-sm font-semibold text-white">Teammates</p>

        <div className="max-h-40 overflow-y-auto pr-1 scrollbar-enhanced">
          {teammates.map((tm, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2 transition-all duration-200 ${idx !== teammates.length - 1 ? "border-b border-white/20" : ""
                } rounded-md hover:rounded-md hover:bg-[#00a390]`}
            >
              <img
                src={tm.image}
                alt={tm.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold text-white">{tm.name}</p>
                <p className="text-xs text-white/70">{tm.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProfileCard;
