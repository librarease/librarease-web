import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  //   TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getListBooks } from "@/lib/api/book";
import { getLibrary } from "@/lib/api/library";
import Link from "next/link";

export default async function LibraryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [libRes, bookRes] = await Promise.all([
    getLibrary({ id }),
    getListBooks({ limit: 20, library_id: id }),
  ]);

  if ("error" in libRes) {
    console.log({ libRes });
    return <div>{JSON.stringify(libRes.message)}</div>;
  }

  if ("error" in bookRes) {
    console.log({ bookRes });
    return <div>{JSON.stringify(bookRes.message)}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">{libRes.data.name}</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/libraries" passHref legacyBehavior>
              <BreadcrumbLink>Libraries</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{libRes.data.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Table>
        <TableCaption>List of books available in the library.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Code</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Year</TableHead>
            <TableHead className="text-right">Author</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookRes.data.map((book) => (
            <TableRow key={book.id}>
              <TableCell className="font-medium">{book.code}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.year}</TableCell>
              <TableCell className="text-right">{book.author}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </div>
  );
}
