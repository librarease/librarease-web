export interface ResMeta {
  total: number;
  skip: number;
  limit: number;
}

interface ResErr {
  error: string;
  message: string;
}

export type ResList<T> =
  | ResErr
  | {
      data: T[];
      meta: ResMeta;
    };

export type ResSingle<T> =
  | ResErr
  | {
      data: T;
    };

type WithID<T> = T & { id: string };
type WithDates<T> = T & { created_at: string; updated_at: string };
export type WithCommon<T> = WithID<WithDates<T>>;

export type QueryParams<T> = {
  sort_by?: keyof T;
  sort_in?: "asc" | "desc";
  limit?: number;
  skip?: number;
} & Partial<T>;
