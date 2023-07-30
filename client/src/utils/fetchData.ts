export async function fetchData(endpoint: RequestInfo, options?: RequestInit) {
	const apiResponse = await fetch(endpoint, options);
	if (apiResponse.ok) {
		return apiResponse;
	} else {
		const errorBody = await apiResponse.json();
		const errorMsg = errorBody.error;
		throw Error(errorMsg);
	}
}
