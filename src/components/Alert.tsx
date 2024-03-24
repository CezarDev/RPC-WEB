export default function Alert({ message = "", type = "error"}) {
    const alertType = type === "error" ? "bg-red-500" : "bg-green-500";
  
    return (
      <div className={`fixed top-0 left-0 right-0 z-50 ${alertType} text-white text-center py-2`}>
        {message}
      </div>
    );
  }
  