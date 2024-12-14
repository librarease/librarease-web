import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getListStaffs } from "@/lib/api/staff";
import Link from "next/link";

export default async function Staffs() {
  const res = await getListStaffs({
    sort_by: "created_at",
    sort_in: "desc",
    limit: 20,
  });

  if ("error" in res) {
    console.log(res);
    return <div>{JSON.stringify(res.message)}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Libraries</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Staffs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {res.data.map((staff) => (
        <div key={staff.id}>
          <Link href={`staffs/${staff.id}`} legacyBehavior>
            {staff.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
