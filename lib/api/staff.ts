import { QueryParams, ResList, ResSingle } from "../types/common";
import { Staff, StaffDetail } from "../types/staff";
import { BASE_URL } from "./common";

const STAFF_URL = `${BASE_URL}/staffs`;

type GetListStaffsQuery = QueryParams<Staff>;
type GetListStaffsResponse = Promise<ResList<Staff>>;
export const getListStaffs = async (
  query: GetListStaffsQuery
): GetListStaffsResponse => {
  const url = new URL(STAFF_URL);
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  return response.json();
};

type GetStaffQuery = Pick<Staff, "id">;
type GetStaffResponse = Promise<ResSingle<StaffDetail>>;
export const getStaff = async (query: GetStaffQuery): GetStaffResponse => {
  const url = new URL(`${STAFF_URL}/${query.id}`);
  const response = await fetch(url.toString());
  return response.json();
};
