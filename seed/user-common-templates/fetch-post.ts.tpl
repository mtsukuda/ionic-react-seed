<!--@@METHOD_NAME--> = async (<!--@@ARGS-->) => {
  const promises = [<!--@@FETCH-->]
  const results = await fetch.concurrentPromise<!--@@TEMPLATE_TYPE-->(promises, <!--@@API_COUNT-->);
  this.setState({
  <!--@@SET_STATE-->
  });
}
