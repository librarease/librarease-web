import { Book } from "../types/book";
import { QueryParams, ResList, ResSingle } from "../types/common";
import { BASE_URL } from "./common";

const BOOKS_URL = `${BASE_URL}/books`;

type GetListBooksQuery = QueryParams<Book>;
type GetListBooksResponse = Promise<ResList<Book>>;

export const getListBooks = async (
  query: GetListBooksQuery
): GetListBooksResponse => {
  const url = new URL(BOOKS_URL);
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  return response.json();
};

type GetBookQuery = Pick<Book, "id">;
type GetBookResponse = Promise<ResSingle<Book>>;
export const getBook = async (query: GetBookQuery): GetBookResponse => {
  const url = new URL(`${BOOKS_URL}/${query.id}`);
  const response = await fetch(url.toString());
  return response.json();
};

type CreateBookQuery = Pick<
  Book,
  "title" | "author" | "year" | "code" | "library_id"
>;
type CreateBookResponse = Promise<ResSingle<Pick<Book, "id">>>;
export const createBook = async (
  query: CreateBookQuery
): CreateBookResponse => {
  const response = await fetch(BOOKS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query),
  });
  if (!response.ok) {
    const e = await response.json();
    throw e;
  }
  return response.json();
};
