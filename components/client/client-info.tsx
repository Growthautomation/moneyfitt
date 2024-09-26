export default function UserInfoCard({ client }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4 w-1/2">
      <h3 className="font-semibold mb-2">{client.name}</h3>
      <p className="text-sm text-gray-600">{client.email}</p>
    </div>
  );
}
