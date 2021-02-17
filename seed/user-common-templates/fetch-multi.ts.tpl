  fetchAll = async () => {
    const promises = [<!--@@FETCH-->]
    const results = await fetch.concurrentPromise<!--@@RETURN_TYPE-->(promises, <!--@@API_COUNT-->);
    this.setState({
    <!--@@SET_STATE-->
    });
  }
