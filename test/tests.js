asyncTest("JSONP without params", function() {
  JSONP.get('http://ip.jsontest.com/', function (data) {
    ok(!!data.ip, "Passed!");
    start();
  });
});

asyncTest("JSONP with params", function() {
  JSONP.get('http://validate.jsontest.com/', { json: "{\"key\":\"value\"}" }, function (data) {
    ok(data.validate, "Passed!");
    start();
  });
});
