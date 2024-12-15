import { WithCommon } from "./common";
import { Library } from "./library";

export type Membership = WithCommon<{
  name: string;
  library_id: string;
  duration: number;
  active_loan_limit: number;
  loan_period: number;
  library: Pick<Library, "id" | "name">;
  fine_per_day: number;
}>;

export type MembershipDetail = Omit<Membership, "library"> & {
  library: Library;
};
