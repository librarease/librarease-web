import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getListBorrows } from "@/lib/api/borrow";
import Link from "next/link";

export default async function Borrows({
  searchParams,
}: {
  searchParams: Promise<{
    skip?: number;
    limit?: number;
    library_id?: string;
  }>;
}) {
  const sp = await searchParams;
  const skip = Number(sp?.skip ?? 0);
  const limit = Number(sp?.limit ?? 20);
  const library_id = sp?.library_id;
  const res = await getListBorrows({
    sort_by: "created_at",
    sort_in: "desc",
    limit: limit,
    skip: skip,
    ...(library_id ? { library_id } : {}),
  });

  if ("error" in res) {
    console.log(res);
    return <div>{JSON.stringify(res.message)}</div>;
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0;

  const nextURL = `/borrows?skip=${skip + limit}&limit=${limit}`;
  const prevURL = `/borrows?skip=${prevSkip}&limit=${limit}`;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Borrows</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Borrows</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Table>
        {/* <TableCaption>List of books available in the library.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Book</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Returned Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {res.data.map((b) => (
            <TableRow key={b.id}>
              <TableCell>{b.book.code}</TableCell>
              <TableCell>{b.borrowed_at}</TableCell>
              <TableCell>{b.subscription.user.name}</TableCell>
              <TableCell>{b.due_at}</TableCell>
              <TableCell>{b.book.title}</TableCell>
              <TableCell>{b.returned_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={prevURL} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={nextURL} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
