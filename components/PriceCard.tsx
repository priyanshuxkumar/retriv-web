import { Check } from "lucide-react";

const RetrivBenefits = [
  {
    title: "One Agent dedicated to your Website",
  },
  {
    title: "Crawl and Index up to 200 Pages per Agent",
  },
  {
    title: "Instant AI Responses based on your Content",
  },
  {
    title: "Accurate Source Tracking for Every Answer",
  },
  {
    title: "Track and Analyze User Queries in Real-Time",
  },
  {
    title: "Agent Performance Insights and Analytics",
  }
];

export default function PriceCard() {
  return (
    <div className="border rounded-xl py-6 px-5 bg-white">
      <div className="text-xl font-bold">Pro</div>
      <div className="mb-6">
        <p className="text-3xl font-semibold mt-1">$29 / mo</p>
      </div>
      <div className="mt-3">
        {RetrivBenefits.map((item, idx) => (
          <div key={idx} className="flex gap-2 justify-start content-center space-y-4">
            <div>
              <Check size={18} strokeWidth={4}/>
            </div>
            <div className="text-sm">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
