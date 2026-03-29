import AgentPolicyBeforeAdd from "./agentPolicy";
import AcceptButton from "./AcceptButton";

export default function TermsPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 border rounded-lg shadow">
      <AgentPolicyBeforeAdd /> {/* Server-rendered content */}
      <AcceptButton /> {/* Client logic */}
    </div>
  );
}
