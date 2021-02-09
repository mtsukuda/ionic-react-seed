  fetchAll = async () => {
    const promises = [<!--@@FETCH-->]
    const results = await fetch.concurrentPromise(promises, <!--@@API_COUNT-->);
    <!--@@ARRAY_MAP_ASSOCIATE_ARRAY-->
    console.log(state);
    <!--@@SET_STATE-->
  }
