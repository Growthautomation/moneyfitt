export default function UserInfoCard({ client }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-4 w-1/2">
      <h2 className="font-bold text-xl mb-4">Client Info</h2>
      <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2">
        <span className="font-semibold text-gray-600">Name:</span>
        <span>{client.name}</span>
        <span className="font-semibold text-gray-600">Email:</span>
        <span>{client.email}</span>
      </div>
    </div>
  );
}
