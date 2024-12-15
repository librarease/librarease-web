import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBook } from "@/lib/api/book";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function NewBook() {
  async function create(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const year = formData.get("year") as string;
    const code = formData.get("code") as string;
    const library_id = formData.get("library_id") as string;

    await createBook({
      title,
      author,
      year: Number(year),
      code,
      library_id,
    });

    redirect("/books");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Books</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/books" passHref legacyBehavior>
              <BreadcrumbLink>books</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Register a book</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form action={create} className="space-y-4 md:max-w-[40%]">
        <Input name="title" placeholder="Title" required />
        <Input name="author" placeholder="Author" required />
        <Input name="year" type="number" placeholder="Year" required />
        <Input name="code" placeholder="Code" required />
        <Input name="library_id" placeholder="Library ID" required />
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}
