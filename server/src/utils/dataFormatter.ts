// Used when get all [ item - order - follow ... ] to check format same as dto or not
// safeParse data
export const formatDataGetAll = (retrievedData: any, dtoSchema: any) => {
  return retrievedData.map((data: any) => {
    const { _id, ...rest } = data;
    const parsed = dtoSchema.safeParse(rest);
    console.log(parsed.error);
    if (!parsed.success) {
      throw new Error("Invalid data format");
    }
    return { _id, ...parsed.data };
  });
};

export const formatDataGetOne = (retrievedData: any, dtoSchema: any) => {
  if (!retrievedData) {
    throw new Error("Data not found");
  }
  const { _id, ...userData } = retrievedData;
  const parsed = dtoSchema.safeParse(userData);
  console.log(parsed.error);
  if (!parsed.success) {
    throw new Error("Invalid data format");
  }
  return { _id, ...parsed.data };
};

export const formatDataUpdate = (retrievedData: any, dtoSchema: any) => {
  const parsed = dtoSchema.safeParse(retrievedData);
  console.log(parsed.error);
  if (!parsed.success) {
    throw new Error("Invalid data format");
  }
  return parsed.data;
};

export const formatDataAdd = (retrievedData: any, dtoSchema: any) => {
  const parsed = dtoSchema.safeParse(retrievedData);
  console.log(parsed.error);

  if (!parsed.success) {
    throw new Error("Invalid data format");
  }
  return parsed.data;
};
