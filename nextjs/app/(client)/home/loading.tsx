import PageLoading from "@/components/utils/page-loading";

export default async function Loading() {
  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <PageLoading />
    </div>
  );
}
