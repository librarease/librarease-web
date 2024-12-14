import { WithCommon } from "./common";
import { Library } from "./library";

export type Membership = WithCommon<{
  name: string;
  library_id: string;
  duration: number;
  active_loan_limit: number;
  loan_period: number;
  library: Pick<Library, "id" | "name">;
}>;

export type MembershipDetail = Omit<Membership, "library"> & {
  library: Library;
};
