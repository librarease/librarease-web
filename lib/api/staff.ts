import { QueryParams, ResList, ResSingle } from '../types/common'
import { Staff, StaffDetail } from '../types/staff'
import { BASE_URL } from './common'

const STAFF_URL = `${BASE_URL}/staffs`

type GetListStaffsQuery = QueryParams<Staff>
type GetListStaffsResponse = Promise<ResList<Staff>>
export const getListStaffs = async (
  query: GetListStaffsQuery,
  init?: RequestInit
): GetListStaffsResponse => {
  const url = new URL(STAFF_URL)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url.toString(), init)
  return response.json()
}

type GetStaffQuery = Pick<Staff, 'id'>
type GetStaffResponse = Promise<ResSingle<StaffDetail>>
export const getStaff = async (query: GetStaffQuery): GetStaffResponse => {
  const url = new URL(`${STAFF_URL}/${query.id}`)
  const response = await fetch(url.toString())
  return response.json()
}

type CreateStaffData = Pick<Staff, 'name' | 'library_id' | 'user_id'>
type CreateStaffResponse = Promise<ResSingle<Staff>>
export const createStaff = async (
  data: CreateStaffData
): CreateStaffResponse => {
  const response = await fetch(STAFF_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}
