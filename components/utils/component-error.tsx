import Image from "next/image";

export default function ComponentError({ message }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Image src="/404-error.png" alt="error-icon" height={100} width={100} />
      <p className="text-red-400">{message}</p>
    </div>
  );
}
