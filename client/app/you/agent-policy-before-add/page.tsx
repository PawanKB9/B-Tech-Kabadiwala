import { Suspense } from "react";
import AgentPolicyBeforeAdd from "./agentPolicy";
import AcceptButton from "./AcceptButton";

export default function TermsPage() {
  return (
    <div className="max-w-5xl p-6 mx-auto pb-16 border rounded-lg shadow">
      <AgentPolicyBeforeAdd />

      <Suspense fallback={<div>Loading...</div>}>
        <AcceptButton />
      </Suspense>
    </div>
  );
}
