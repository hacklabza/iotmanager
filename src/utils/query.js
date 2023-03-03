export const handleQueryParams = (params) => {
  if (params) {
    const queryParms = new URLSearchParams(params);
    return queryParms.toString();
  }
}
