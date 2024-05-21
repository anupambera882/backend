export interface response<ResponseType = Array<any> | object | undefined> {
  statusCode: number;
  response: ResponseType;
  message: string;
}

export interface PaginationResponse<listType> {
  data: listType[];
  pagination: {
    pageNumber: number;
    limitCount: number;
    total: number;
  };
}
