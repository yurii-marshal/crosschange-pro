export interface Pagination {
  offset: number;
  limit: number;
}

export const defaultPagination: Pagination = {
  offset: 0,
  limit: 4,
};
