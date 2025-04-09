// components/Loader.jsx
import { Spinner } from "@material-tailwind/react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 bg-white/70 flex items-center justify-center">
      <Spinner className="h-12 w-12 text-blue-600" />
    </div>
  );
};

export default Loader;
