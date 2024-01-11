"use client"; // Error components must be Client Components
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const returnHomeHandle = () => {
    return router.push("/");
  };

  return (
    <div>
      <div className="font-bold text-2xl flex justify-center mt-10">
        Something went wrong!
      </div>
      <div className="font-normal text-xl flex justify-center mt-2">
        {error.message || "please check your error"}
      </div>
      <div className="flex justify-center">
      <button
        className="p-5 bg-gray-300 hover:bg-gray-400 mt-4 font-bold rounded-full"
        onClick={returnHomeHandle}
      >
        Return Home
      </button>
      </div>
    </div>
  );
}
