import {
  getUserAnswerHelpArea,
  getUserAnswerSummary,
} from "@/lib/utils/user-answer-summary";
import { mapAnswersToQA } from "@/resources/map-questions";

export default function UserInfoCard({ client }) {
  const { qaList, helpAreas } = mapAnswersToQA(client.all_answers);

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-4">
      <h2 className="font-bold text-xl mb-4">Client Info</h2>

      {/* Contact Information Section */}
      {client && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
          <p>
            <strong>Name:</strong> {client?.name}
          </p>
          <p>
            <strong>Email:</strong> {client?.email}
          </p>
          <p>
            <strong>Phone:</strong> {client?.phone_number}
          </p>
        </div>
      )}

      {/* Summary Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Summary</h3>
        <ul className="list-disc pl-5">
          {getUserAnswerSummary(client.all_answers ?? {}).map((item, index) => (
            <li key={index} className="mb-1">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Areas Needing Help Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Areas Needing Assistance</h3>
        <ul className="list-disc pl-5">
          {getUserAnswerHelpArea(client.all_answers ?? {}).map(
            (item, index) => (
              <li key={index} className="mb-1">
                {item}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
