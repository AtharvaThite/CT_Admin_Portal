import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/data-table/data-table";
import { getUsers } from "@/lib/queries/users";
import { formatDate } from "@/lib/utils";
import type { UserProfile } from "@/lib/types/user";
import { UsersClient } from "./users-client";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage platform users and their profiles"
      />
      <UsersClient users={users} />
    </div>
  );
}
