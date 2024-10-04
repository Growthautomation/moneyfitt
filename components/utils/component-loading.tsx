export default function ComponentLoading() {
  return (
    <div className="text-center text-gray-500 my-5">
      {"Loading...".split("").map((char, index) => (
        <span
          key={index}
          className={`inline-block animate-bounce`}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: "1s",
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
