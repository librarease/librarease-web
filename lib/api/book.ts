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
