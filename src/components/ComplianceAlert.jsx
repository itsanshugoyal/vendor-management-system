import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const ComplianceAlert = ({ title, description, severity, onResolve }) => (
  <div className={`rounded-md ${severity === "high" ? "bg-red-50" : "bg-yellow-50"} p-4 mb-4`}>
    <div className="flex">
      <div className="flex-shrink-0">
        <ExclamationTriangleIcon
          className={`h-5 w-5 ${severity === "high" ? "text-red-400" : "text-yellow-400"}`}
          aria-hidden="true"
        />
      </div>
      <div className="ml-3 flex-grow">
        <h3 className={`text-sm font-medium ${severity === "high" ? "text-red-800" : "text-yellow-800"}`}>{title}</h3>
        <div className={`mt-2 text-sm ${severity === "high" ? "text-red-700" : "text-yellow-700"}`}>
          <p>{description}</p>
        </div>
      </div>
      {onResolve && (
        <button
          onClick={onResolve}
          className="ml-3 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Resolve
        </button>
      )}
    </div>
  </div>
);

export default ComplianceAlert;
