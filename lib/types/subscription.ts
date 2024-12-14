import { WithCommon } from "./common";
import { Membership } from "./membership";
import { User } from "./user";

export type Subscription = WithCommon<{
  user_id: string;
  membership_id: string;
  expires_at: string;
  loan_period: number;
  active_loan_limit: number;
  user: Pick<User, "id" | "name">;
  membership: Pick<Membership, "id" | "name" | "library_id" | "library">;
}>;

export type SubscriptionDetail = Omit<Subscription, "user" | "membership"> & {
  user: User;
  membership: Membership;
};
