define(
  'ephox.alloy.api.ui.SplitToolbar',

  [

  ],

  function () {
    var refresh = function (toolstrip) {
      toolstrip.apis().refresh();
    };

    var setGroups = function (toolstrip, groups) {
      toolstrip.apis().setGroups(groups);
    };

    return {
      refresh: refresh,
      setGroups: setGroups
    };
  }
);