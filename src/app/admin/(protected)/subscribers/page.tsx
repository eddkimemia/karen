import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/ui";
import {
  SubscribersTable,
  type SubscriberRow,
} from "@/components/admin/subscribers-table";

export default async function AdminSubscribersPage() {
  const rows = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  const subscribers: SubscriberRow[] = rows.map((s) => ({
    id: s.id,
    email: s.email,
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <>
      <AdminHeader
        title="Subscribers"
        description={`${subscribers.length} newsletter subscribers — the Dispatches list.`}
      />
      <SubscribersTable subscribers={subscribers} />
    </>
  );
}
