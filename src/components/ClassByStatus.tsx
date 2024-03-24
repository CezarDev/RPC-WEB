export default function ClassByStatus(statusId: number) {
    const getClass = (statusId: number) => {
      switch (statusId) {
        case 1:
          return "bg-violet-300";
        case 2:
          return "bg-blue-300";
        case 3:
          return "bg-lime-300";
        default:
          return "bg-gray-300";
      }
    };
  
    return getClass(statusId);
  }
  