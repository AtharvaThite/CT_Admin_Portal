import { PageHeader } from "@/components/shared/page-header";
import { getTherapists } from "@/lib/queries/therapists";
import { TherapistsClient } from "./therapists-client";

export default async function TherapistsPage() {
  const therapists = await getTherapists();

  return (
    <div>
      <PageHeader
        title="Therapists"
        description="Manage therapist profiles and verification"
      />
      <TherapistsClient therapists={therapists} />
    </div>
  );
}
