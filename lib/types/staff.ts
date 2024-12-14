import { WithCommon } from "./common";
import { Library } from "./library";
import { User } from "./user";

export type Staff = WithCommon<{
  name: string;
  library_id: string;
  user_id: string;
  library?: Pick<Library, "id" | "name">;
  user?: Pick<User, "id" | "name">;
}>;

export type StaffDetail = Omit<Staff, "user" | "library"> & {
  user: User;
  library: Library;
};
