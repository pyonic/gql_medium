const mapObjectById = (data: Array<any>) => {
  const objectMap = {};
  data.forEach((d: any) => (objectMap[d.id] = d));
  return objectMap;
};

export { mapObjectById };
