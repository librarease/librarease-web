import { Borrow } from "../types/borrow";
import { QueryParams, ResList, ResSingle } from "../types/common";
import { BASE_URL } from "./common";

const BORROW_URL = `${BASE_URL}/borrowings`;

type GetListBorrowsQuery = QueryParams<
  Borrow & {
    is_active?: boolean;
    is_expired?: boolean;
    library_id?: string;
  }
>;
type GetListBorrowsResponse = Promise<ResList<Borrow>>;

export const getListBorrows = async (
  query: GetListBorrowsQuery
): GetListBorrowsResponse => {
  const url = new URL(BORROW_URL);
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  return response.json();
};

type GetBookQuery = Pick<Borrow, "id">;
type GetBookResponse = Promise<ResSingle<Borrow>>;
export const getBook = async (query: GetBookQuery): GetBookResponse => {
  const url = new URL(`${BORROW_URL}/${query.id}`);
  const response = await fetch(url.toString());
  return response.json();
};
