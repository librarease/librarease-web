import { WithCommon } from "./common";

export type User = WithCommon<{
  name: string;
  email: string;
  // staff: Staff[];
}>;
