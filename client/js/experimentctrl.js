scanjsModule.controller('ExperimentCtrl', ['$scope', 'ScanSvc', function ExperimentCtrl($scope, ScanSvc) {
  if (!document.getElementById("experiment-mirror").children.length) {
    $scope.codeMirror = new CodeMirror(document.getElementById('experiment-mirror'), {
      mode: 'javascript',
      lineNumbers: true,
      theme: 'mdn-like',
      value: "bar.foo\nfoo=something\nbaz.bar=stuff\nfoo(something)\nfoo.bar\nfoo.bar()\neval(test)\nfoo.innerHTML=danger",
      tabsize: 2,
      styleActiveLine: true
    });
  }
  $scope.results=[];
  $scope.ready=false;
  $scope.rule="eval()"

  var ruleData={
    "name": "manual rule",
    "source": $scope.rule,
    "testhit": $scope.rule,
    "testmiss": "",
    "desc": "Manual input.",
    "threat": "example"
  }

  $scope.runScan = function () {
    $scope.results=[];
    code = $scope.codeMirror.getValue();
    ScanJS.loadRules(ScanSvc.rules);
    $scope.results=ScanJS.scan(code);
    $scope.lastScan=$scope.runScan;
  }


  $scope.runManualScan = function () {
    ruleData.source=$scope.rule;
    ScanJS.loadRules([ruleData]);

    $scope.results=[];
    code = $scope.codeMirror.getValue();
    //put ast on global variable for debugging purposes.
    try{
      window.ast=acorn.parse(code);
    }catch(e){

    }
    //ScanJS.setResultCallback(found);
    $scope.results=ScanJS.scan(code);
    $scope.lastScan=$scope.runManualScan;
  }

  $scope.showResult = function (filename,line, col) {
    document.querySelector("#code-mirror-wrapper").classList.toggle("hidden",false);
    $scope.codeMirror.setCursor(line - 1, col || 0);
    $scope.codeMirror.focus();
  };

  $scope.lastScan=$scope.runScan;
  
}]);
