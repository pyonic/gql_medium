const CustomHttpPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ response }) {
        if (
          response.body.kind === 'single' &&
          response.body.singleResult?.errors &&
          response.body.singleResult?.errors?.[0]?.statusCode
        ) {
          response.http.status =
            response.body.singleResult.errors?.[0]?.statusCode;
        }
      },
    };
  },
};

export { CustomHttpPlugin };
