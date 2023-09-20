export const request = async (method, url, data) => {
  try {
    let buildRequest;

    if (method === 'GET') {
      buildRequest = fetch(url);
    } else {
      buildRequest = fetch(url, {
        method,
        headers: {
          'content-type': 'application/json',
        },
        data: JSON.stringify(data),
      });
    }
    const response = await buildRequest;

    console.log(response);

    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
};
