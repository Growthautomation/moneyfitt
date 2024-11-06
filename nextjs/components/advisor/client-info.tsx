import {
  getUserAnswerHelpArea,
  getUserAnswerSummary,
} from "@/lib/utils/user-answer-summary";
import { mapAnswersToQA } from "@/resources/map-questions";

export default function UserInfoCard({ client }) {
  const { qaList, helpAreas } = mapAnswersToQA(client.all_answers);

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="p-4 bg-[#5C59E4] text-white">
        <h2 className="font-bold text-xl">Client Information</h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Contact Information */}
        <div className="bg-[#ECF0F3] p-4 rounded-lg space-y-2">
          <h3 className="font-bold text-[#222222] mb-3">Contact Details</h3>
          {[
            { label: "Name", value: client?.name },
            { label: "Email", value: client?.preferred_contact_email },
            { label: "Phone", value: client?.phone_number },
            { label: "Telegram", value: client?.telegram },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-[#9CABC2]">{label}</span>
              <span className="font-medium text-[#222222]">{value || "N/A"}</span>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="bg-[#ECF0F3] p-4 rounded-lg space-y-2">
          <h3 className="font-bold text-[#222222] mb-3">Summary</h3>
          <ul className="list-disc pl-5">
            {getUserAnswerSummary(client.all_answers ?? {}).map((item, index) => (
              <li key={index} className="mb-1">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Areas Needing Help Section */}
        <div className="bg-[#ECF0F3] p-4 rounded-lg space-y-2">
          <h3 className="font-bold text-[#222222] mb-3">Areas Needing Assistance</h3>
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
    </div>
  );
}
